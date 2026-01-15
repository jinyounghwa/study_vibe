# 시니어 개발자를 위한 AI 모델 완전 가이드
## 토크나이저부터 KV 캐시까지

---

## 목차
1. [AI 모델의 기본 개념](#1-ai-모델의-기본-개념)
2. [토크나이저(Tokenizer)](#2-토크나이저tokenizer)
3. [임베딩(Embedding)](#3-임베딩embedding)
4. [트랜스포머 아키텍처](#4-트랜스포머-아키텍처)
5. [어텐션 메커니즘](#5-어텐션-메커니즘)
6. [KV 캐시](#6-kv-캐시)
7. [로컬 AI 구동 원리](#7-로컬-ai-구동-원리)
8. [실전 적용](#8-실전-적용)

---

## 1. AI 모델의 기본 개념

### 1.1 LLM이란?
Large Language Model의 약자로, 방대한 텍스트 데이터로 학습된 신경망 모델입니다.

**개발자 관점에서 이해하기:**
```
입력: "안녕하세요"
↓
[토크나이저] → [1234, 5678]
↓
[임베딩] → [[0.1, 0.2, ...], [0.3, 0.4, ...]]
↓
[트랜스포머 레이어들] → 수십 개 층을 거침
↓
[출력 레이어] → 다음 토큰 확률 분포
↓
결과: "반갑습니다" (가장 높은 확률)
```

### 1.2 모델 크기 이해하기
- **7B 모델**: 70억 개의 파라미터 (메모리: ~14GB)
- **13B 모델**: 130억 개의 파라미터 (메모리: ~26GB)
- **70B 모델**: 700억 개의 파라미터 (메모리: ~140GB)

**왜 파라미터 수 × 2 = 메모리?**
- 각 파라미터는 16bit(2byte) float로 저장되기 때문
- 7B × 2bytes = 14GB

---

## 2. 토크나이저(Tokenizer)

### 2.1 토크나이저란?
텍스트를 모델이 이해할 수 있는 숫자(토큰)로 변환하는 도구입니다.

### 2.2 토큰화 과정

**예시 1: 영어**
```
입력: "Hello, World!"
↓
토큰화: ["Hello", ",", " World", "!"]
↓
토큰 ID: [15496, 11, 4435, 0]
```

**예시 2: 한글의 문제**
```
입력: "안녕하세요"
↓
영어 기반 토크나이저:
["안", "녕", "하", "세", "요"]  → 5개 토큰
↓
한글 최적화 토크나이저:
["안녕하세요"]  → 1개 토큰
```

### 2.3 토크나이저 종류

#### BPE (Byte Pair Encoding)
- GPT 계열에서 사용
- 자주 나오는 문자 조합을 하나의 토큰으로

```python
# 간단한 BPE 예시
원본: "aaabdaaabac"
↓
빈도 분석: "aa" 가장 많음
↓
압축: "ZabdZabac" (Z = aa)
↓
반복하면: 더 효율적인 토큰화
```

#### WordPiece
- BERT에서 사용
- BPE와 유사하지만 확률 기반

#### SentencePiece
- 언어 독립적
- 공백도 특수 문자로 처리

### 2.4 실제 코드로 확인

```python
# Hugging Face transformers 사용
from transformers import AutoTokenizer

# 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# 토큰화
text = "Hello, World!"
tokens = tokenizer.encode(text)
print(f"Tokens: {tokens}")
# 출력: [15496, 11, 4435, 0]

# 디코딩
decoded = tokenizer.decode(tokens)
print(f"Decoded: {decoded}")
# 출력: "Hello, World!"

# 토큰 자세히 보기
tokens_detail = tokenizer.tokenize(text)
print(f"Token strings: {tokens_detail}")
# 출력: ['Hello', ',', ' World', '!']
```

### 2.5 한글 토크나이저의 중요성

**영어 기반 토크나이저:**
```
"안녕하세요" → 5~10개 토큰
↓
- 입력 길이 증가 (비용↑)
- 문맥 이해 저하
- 생성 속도 감소
```

**한글 최적화 토크나이저:**
```
"안녕하세요" → 1~2개 토큰
↓
- 효율적인 처리
- 더 나은 한글 이해
- 빠른 응답
```

---

## 3. 임베딩(Embedding)

### 3.1 임베딩이란?
토큰 ID를 고차원 벡터로 변환하는 과정입니다.

### 3.2 왜 필요한가?

**토큰 ID만으로는 부족:**
```
"왕" → ID: 1234
"여왕" → ID: 5678
"남자" → ID: 9012
"여자" → ID: 3456

문제: 숫자 사이에 의미적 관계가 없음
```

**임베딩으로 해결:**
```
"왕" → [0.1, 0.9, 0.2, ...]
"여왕" → [0.1, 0.1, 0.2, ...]
"남자" → [0.9, 0.9, 0.1, ...]
"여자" → [0.9, 0.1, 0.1, ...]

이제 벡터 연산 가능:
왕 - 남자 + 여자 ≈ 여왕
```

### 3.3 임베딩 차원

```
모델마다 다른 임베딩 크기:
- GPT-2: 768차원
- GPT-3: 12,288차원
- LLaMA-7B: 4096차원

각 토큰 → 4096개의 float 숫자
```

### 3.4 코드로 이해하기

```python
import torch
import torch.nn as nn

# 간단한 임베딩 레이어
vocab_size = 50000  # 어휘 크기
embedding_dim = 768  # 임베딩 차원

embedding = nn.Embedding(vocab_size, embedding_dim)

# 토큰 ID
token_ids = torch.tensor([1234, 5678])

# 임베딩 변환
embedded = embedding(token_ids)
print(f"Shape: {embedded.shape}")
# 출력: torch.Size([2, 768])
# 2개 토큰, 각각 768차원 벡터
```

### 3.5 포지셔널 임베딩

단어의 위치 정보도 중요합니다:

```
"나는 밥을 먹었다" vs "밥을 나는 먹었다"
↓
같은 단어지만 순서가 다름
↓
포지셔널 임베딩으로 위치 정보 추가

최종 임베딩 = 토큰 임베딩 + 포지셔널 임베딩
```

---

## 4. 트랜스포머 아키텍처

### 4.1 전체 구조

```
입력 텍스트
    ↓
[토크나이저]
    ↓
토큰 ID: [123, 456, 789]
    ↓
[임베딩 레이어]
    ↓
임베딩 벡터: [[0.1, ...], [0.2, ...], [0.3, ...]]
    ↓
[트랜스포머 블록 1]
    ├── Multi-Head Attention
    ├── Layer Normalization
    ├── Feed Forward
    └── Layer Normalization
    ↓
[트랜스포머 블록 2]
    ├── ...
    ↓
[트랜스포머 블록 N]  (예: 32개 블록)
    ↓
[출력 레이어]
    ↓
다음 토큰 확률 분포
```

### 4.2 트랜스포머 블록 상세

```python
class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, n_heads)
        self.norm1 = LayerNorm(d_model)
        self.ffn = FeedForward(d_model)
        self.norm2 = LayerNorm(d_model)
    
    def forward(self, x):
        # 1. Self-Attention
        attn_output = self.attention(x)
        x = self.norm1(x + attn_output)  # 잔차 연결
        
        # 2. Feed Forward
        ffn_output = self.ffn(x)
        x = self.norm2(x + ffn_output)  # 잔차 연결
        
        return x
```

### 4.3 왜 여러 레이어?

```
레이어 1: 단순한 패턴 인식
"고양이는" → "귀엽다" 같은 직접적 관계

레이어 5: 구문 구조 이해
주어-동사-목적어 관계 파악

레이어 10: 문맥 이해
앞 문장과의 연결 파악

레이어 20: 추상적 개념
비유, 암시, 논리적 추론

레이어 32: 복잡한 추론
긴 문맥의 종합적 이해
```

---

## 5. 어텐션 메커니즘

### 5.1 어텐션이란?

문장에서 어떤 단어에 "주목"할지 결정하는 메커니즘입니다.

**예시:**
```
입력: "그 고양이는 생선을 좋아해서 매일 먹었다"

"먹었다"를 생성할 때:
- "고양이는" (주어) → 높은 주목도
- "생선을" (목적어) → 높은 주목도
- "그" → 낮은 주목도
- "매일" → 중간 주목도
```

### 5.2 Self-Attention 계산 과정

```
1단계: Q, K, V 생성
입력 벡터 x
    ↓
Q (Query) = x × W_q    (질문: 내가 찾는 정보는?)
K (Key) = x × W_k      (키: 나는 이런 정보를 가짐)
V (Value) = x × W_v    (값: 실제 정보)

2단계: 유사도 계산
Scores = Q × K^T / √d_k
(각 단어 쌍의 관련성)

3단계: Softmax
Attention_weights = softmax(Scores)
(확률 분포로 변환)

4단계: 가중합
Output = Attention_weights × V
(중요한 정보에 가중치를 두고 합산)
```

### 5.3 코드로 이해하기

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    """
    Q: (batch, seq_len, d_k)
    K: (batch, seq_len, d_k)
    V: (batch, seq_len, d_v)
    """
    d_k = Q.size(-1)
    
    # 1. Q와 K의 내적
    scores = torch.matmul(Q, K.transpose(-2, -1))
    
    # 2. 스케일링
    scores = scores / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    
    # 3. Softmax (확률로 변환)
    attention_weights = F.softmax(scores, dim=-1)
    
    # 4. V와 가중합
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights

# 예시
batch_size, seq_len, d_k = 1, 5, 64
Q = torch.randn(batch_size, seq_len, d_k)
K = torch.randn(batch_size, seq_len, d_k)
V = torch.randn(batch_size, seq_len, d_k)

output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Output shape: {output.shape}")  # (1, 5, 64)
print(f"Attention weights shape: {weights.shape}")  # (1, 5, 5)
```

### 5.4 Multi-Head Attention

여러 개의 어텐션을 병렬로 실행합니다.

```
왜 여러 개?
Head 1: 주어-동사 관계에 집중
Head 2: 수식 관계에 집중
Head 3: 시간적 순서에 집중
...
Head 8: 감정/뉘앙스에 집중

각 Head가 다른 패턴을 학습!
```

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        # Q, K, V 변환 행렬
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, x):
        batch_size, seq_len, d_model = x.size()
        
        # Q, K, V 생성
        Q = self.W_q(x)  # (batch, seq_len, d_model)
        K = self.W_k(x)
        V = self.W_v(x)
        
        # 여러 헤드로 분리
        Q = Q.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        K = K.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        # 결과: (batch, n_heads, seq_len, d_k)
        
        # 각 헤드별 어텐션 계산
        output, _ = scaled_dot_product_attention(Q, K, V)
        
        # 헤드 합치기
        output = output.transpose(1, 2).contiguous()
        output = output.view(batch_size, seq_len, d_model)
        
        # 최종 변환
        output = self.W_o(output)
        
        return output
```

---

## 6. KV 캐시

### 6.1 문제 상황

**텍스트 생성 과정:**
```
1회: "안녕" → "하" 생성
2회: "안녕하" → "세" 생성
3회: "안녕하세" → "요" 생성

문제: 매번 "안녕", "안녕하", "안녕하세"를 
      처음부터 다시 계산!
```

### 6.2 KV 캐시란?

이전에 계산한 Key와 Value를 저장해두는 기법입니다.

```
일반적인 생성 (캐시 없음):
토큰 1개 생성 = 전체 시퀀스 다시 계산
시간 복잡도: O(n²)

KV 캐시 사용:
토큰 1개 생성 = 새 토큰만 계산
시간 복잡도: O(n)

100배 이상 속도 향상!
```

### 6.3 작동 원리

```
[1단계] 첫 토큰 "안녕"
Q_안녕, K_안녕, V_안녕 계산
→ K_안녕, V_안녕을 캐시에 저장

[2단계] "하" 생성
Q_하만 새로 계산
K_하, V_하를 캐시에 추가
기존 캐시: [K_안녕, K_하], [V_안녕, V_하]

[3단계] "세" 생성
Q_세만 새로 계산
캐시된 K, V 재사용
→ 어텐션 계산
```

### 6.4 메모리 트레이드오프

```
캐시 메모리 사용량:
= 레이어 수 × 헤드 수 × 시퀀스 길이 × d_k × 2(K,V) × 데이터타입

예시 (LLaMA-7B):
- 32 레이어
- 32 헤드
- 4096 시퀀스
- 128 d_k
- 2 (K, V)
- 2 bytes (FP16)

= 32 × 32 × 4096 × 128 × 2 × 2 bytes
= 약 2GB

결론: 긴 대화는 많은 메모리 필요!
```

### 6.5 실제 구현

```python
class KVCache:
    def __init__(self, max_batch_size, max_seq_len, n_layers, n_heads, d_k):
        self.cache_k = torch.zeros(
            (max_batch_size, n_layers, n_heads, max_seq_len, d_k)
        )
        self.cache_v = torch.zeros(
            (max_batch_size, n_layers, n_heads, max_seq_len, d_k)
        )
        self.seq_len = 0
    
    def update(self, layer_idx, k, v):
        """새로운 K, V를 캐시에 추가"""
        batch_size, n_heads, new_len, d_k = k.shape
        
        # 캐시에 추가
        self.cache_k[:batch_size, layer_idx, :, self.seq_len:self.seq_len+new_len, :] = k
        self.cache_v[:batch_size, layer_idx, :, self.seq_len:self.seq_len+new_len, :] = v
        
        # 시퀀스 길이 업데이트
        self.seq_len += new_len
        
        # 전체 K, V 반환
        return (
            self.cache_k[:batch_size, layer_idx, :, :self.seq_len, :],
            self.cache_v[:batch_size, layer_idx, :, :self.seq_len, :]
        )
    
    def reset(self):
        """캐시 초기화"""
        self.seq_len = 0

# 사용 예시
def generate_with_cache(model, input_ids, max_new_tokens):
    kv_cache = KVCache(
        max_batch_size=1,
        max_seq_len=2048,
        n_layers=model.config.n_layers,
        n_heads=model.config.n_heads,
        d_k=model.config.d_k
    )
    
    # 첫 번째 토큰들 처리
    logits = model(input_ids, kv_cache=kv_cache)
    next_token = torch.argmax(logits[:, -1, :], dim=-1)
    
    generated = [next_token.item()]
    
    # 나머지 토큰 생성
    for _ in range(max_new_tokens - 1):
        # 새 토큰만 입력 (캐시 활용)
        logits = model(next_token.unsqueeze(0), kv_cache=kv_cache)
        next_token = torch.argmax(logits[:, -1, :], dim=-1)
        generated.append(next_token.item())
    
    return generated
```

### 6.6 최적화 기법들

```
1. GQA (Grouped Query Attention)
   - 여러 Query가 하나의 K, V 공유
   - 캐시 메모리 1/4로 감소

2. MQA (Multi Query Attention)
   - 모든 Query가 하나의 K, V 공유
   - 캐시 메모리 1/8로 감소
   - 속도 향상, 약간의 성능 저하

3. Flash Attention
   - GPU 메모리 효율적 사용
   - 불필요한 중간 결과 저장 안 함
```

---

## 7. 로컬 AI 구동 원리

### 7.1 로컬 AI의 장점

```
클라우드 API vs 로컬 AI

클라우드 (GPT-4, Claude):
✓ 최고 성능
✗ 비용 발생 (토큰당 과금)
✗ 인터넷 필요
✗ 데이터가 외부로

로컬 (LLaMA, Mistral):
✓ 무료 (하드웨어 비용만)
✓ 오프라인 가능
✓ 데이터 보안
✗ 하드웨어 요구사항
```

### 7.2 필요한 하드웨어

```
Mac Mini M4 (진영화님 환경):
- 통합 메모리: 32GB
- Neural Engine 탑재
- 최적화된 MLX 프레임워크

추천 모델 크기:
- 7B 모델: 여유롭게 구동 (14GB)
- 13B 모델: 구동 가능 (26GB)
- 양자화 사용 시 더 큰 모델도 가능
```

### 7.3 양자화(Quantization)

모델 크기를 줄이는 기법입니다.

```
FP16 (16bit float):
파라미터 하나 = 2 bytes
7B 모델 = 14GB

INT8 (8bit integer):
파라미터 하나 = 1 byte
7B 모델 = 7GB
성능 저하: ~5%

INT4 (4bit integer):
파라미터 하나 = 0.5 bytes
7B 모델 = 3.5GB
성능 저하: ~10%
```

**GGUF 형식:**
```
llama-7b-q4_0.gguf  → 4bit 양자화
llama-7b-q8_0.gguf  → 8bit 양자화

메모리는 줄고, 추론은 거의 그대로!
```

### 7.4 로컬 AI 스택

```
[애플리케이션 레벨]
    ↓
Ollama / LM Studio / LocalAI
(모델 관리 및 API 제공)
    ↓
llama.cpp / MLX
(추론 엔진)
    ↓
GGUF / MLX 모델 파일
(양자화된 가중치)
    ↓
[하드웨어]
CPU / GPU / Neural Engine
```

### 7.5 MLX (Apple Silicon 최적화)

```python
# MLX를 사용한 모델 로드 및 추론
import mlx.core as mx
from mlx_lm import load, generate

# 모델 로드
model, tokenizer = load("mlx-community/Qwen2.5-7B-Instruct")

# 추론
prompt = "안녕하세요, AI에 대해 설명해주세요."
response = generate(
    model, 
    tokenizer, 
    prompt=prompt,
    max_tokens=500,
    temp=0.7
)

print(response)
```

**MLX의 장점:**
```
1. Metal API 활용
   - Apple GPU 직접 제어
   
2. 통합 메모리 최적화
   - CPU-GPU 메모리 복사 불필요
   
3. Neural Engine 활용
   - 행렬 연산 가속
   
4. 낮은 지연시간
   - 토큰당 50-100ms (7B 모델)
```

### 7.6 Ollama로 로컬 서버 구축

```bash
# Ollama 설치 (Mac)
brew install ollama

# 모델 다운로드
ollama pull llama3.2:7b
ollama pull qwen2.5:7b

# 서버 실행
ollama serve

# API 호출
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:7b",
  "prompt": "안녕하세요",
  "stream": false
}'
```

**NestJS에서 Ollama 사용:**
```typescript
// ollama.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaService {
  private readonly baseUrl = 'http://localhost:11434';

  async generate(prompt: string, model: string = 'llama3.2:7b') {
    const response = await axios.post(`${this.baseUrl}/api/generate`, {
      model,
      prompt,
      stream: false,
    });
    
    return response.data.response;
  }

  async chat(messages: Array<{role: string; content: string}>) {
    const response = await axios.post(`${this.baseUrl}/api/chat`, {
      model: 'llama3.2:7b',
      messages,
      stream: false,
    });
    
    return response.data.message.content;
  }
}
```

### 7.7 스트리밍 구현

```typescript
// 실시간 응답을 위한 스트리밍
import { Response } from 'express';

async streamGenerate(prompt: string, res: Response) {
  const response = await axios.post(
    `${this.baseUrl}/api/generate`,
    {
      model: 'llama3.2:7b',
      prompt,
      stream: true,
    },
    {
      responseType: 'stream',
    }
  );

  response.data.on('data', (chunk: Buffer) => {
    const lines = chunk.toString().split('\n').filter(Boolean);
    
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          // SSE 형식으로 전송
          res.write(`data: ${json.response}\n\n`);
        }
        
        if (json.done) {
          res.end();
        }
      } catch (e) {
        // 파싱 오류 무시
      }
    }
  });
}
```

---

## 8. 실전 적용

### 8.1 로컬 AI 프로젝트 아키텍처

```
[프론트엔드]
React / Next.js
    ↓ HTTP/SSE
[백엔드 API]
NestJS
    ↓ REST API
[Ollama 서버]
localhost:11434
    ↓
[모델 추론]
llama.cpp / MLX
    ↓
[하드웨어]
Mac Mini M4
```

### 8.2 간단한 챗봇 구현

```typescript
// chat.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { OllamaService } from './ollama.service';

@Controller('chat')
export class ChatController {
  constructor(private ollamaService: OllamaService) {}

  @Post('message')
  async sendMessage(@Body() body: { message: string }) {
    const response = await this.ollamaService.generate(body.message);
    return { response };
  }

  @Post('stream')
  async streamMessage(
    @Body() body: { message: string },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.ollamaService.streamGenerate(body.message, res);
  }
}
```

```typescript
// 프론트엔드 (React)
import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    
    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // API 호출
    const response = await fetch('http://localhost:3000/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    
    const data = await response.json();
    
    // AI 응답 추가
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    
    setInput('');
    setLoading(false);
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      
      <button onClick={sendMessage} disabled={loading}>
        전송
      </button>
    </div>
  );
}
```

### 8.3 RAG (Retrieval Augmented Generation) 구현

문서 검색 + AI 생성을 결합한 시스템:

```typescript
// rag.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class RagService {
  private documents: Array<{id: string; content: string; embedding: number[]}> = [];

  async indexDocument(id: string, content: string) {
    // 1. 문서를 임베딩으로 변환
    const embedding = await this.getEmbedding(content);
    
    // 2. 저장
    this.documents.push({ id, content, embedding });
  }

  async search(query: string, topK: number = 3) {
    // 1. 쿼리를 임베딩으로 변환
    const queryEmbedding = await this.getEmbedding(query);
    
    // 2. 코사인 유사도 계산
    const similarities = this.documents.map(doc => ({
      ...doc,
      similarity: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));
    
    // 3. 상위 K개 반환
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    // Ollama의 임베딩 API 사용
    const response = await axios.post('http://localhost:11434/api/embeddings', {
      model: 'nomic-embed-text',
      prompt: text,
    });
    
    return response.data.embedding;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }
}
```

**사용 예시:**
```typescript
// RAG 기반 답변 생성
async function answerWithRag(question: string) {
  // 1. 관련 문서 검색
  const relevantDocs = await ragService.search(question, 3);
  
  // 2. 컨텍스트 구성
  const context = relevantDocs.map(doc => doc.content).join('\n\n');
  
  // 3. 프롬프트 생성
  const prompt = `
다음 문서들을 참고해서 질문에 답변해주세요:

${context}

질문: ${question}

답변:`;
  
  // 4. LLM으로 답변 생성
  const answer = await ollamaService.generate(prompt);
  
  return {
    answer,
    sources: relevantDocs.map(doc => doc.id),
  };
}
```

### 8.4 성능 최적화 팁

```
1. 배치 처리
   - 여러 요청을 묶어서 처리
   - GPU 활용도 증가

2. 프롬프트 캐싱
   - 시스템 프롬프트는 캐시
   - 매번 재계산 방지

3. 적절한 모델 선택
   - 간단한 작업: 7B 모델
   - 복잡한 추론: 13B+ 모델

4. 양자화 활용
   - Q4_K_M: 균형잡힌 선택
   - Q8_0: 품질 우선

5. 컨텍스트 길이 관리
   - 불필요한 히스토리 제거
   - 요약 기능 활용
```

### 8.5 모니터링

```typescript
// 모델 성능 모니터링
class ModelMonitor {
  private metrics = {
    requestCount: 0,
    totalTokens: 0,
    avgLatency: 0,
    errors: 0,
  };

  async trackRequest(fn: () => Promise<any>) {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      
      // 메트릭 업데이트
      this.metrics.requestCount++;
      this.metrics.totalTokens += result.tokens || 0;
      
      const latency = Date.now() - startTime;
      this.metrics.avgLatency = 
        (this.metrics.avgLatency * (this.metrics.requestCount - 1) + latency) 
        / this.metrics.requestCount;
      
      return result;
    } catch (error) {
      this.metrics.errors++;
      throw error;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      tokensPerSecond: this.metrics.totalTokens / (this.metrics.avgLatency / 1000),
    };
  }
}
```

---

## 마무리

### 핵심 요약

1. **토크나이저**: 텍스트 → 숫자 변환
2. **임베딩**: 숫자 → 의미 벡터
3. **트랜스포머**: 여러 레이어로 깊은 이해
4. **어텐션**: 중요한 부분에 집중
5. **KV 캐시**: 이전 계산 재사용으로 속도 향상
6. **로컬 AI**: 하드웨어만 있으면 무료, 보안

### 다음 단계

```
1. Ollama 설치 및 실습
   → 로컬에서 직접 모델 실행

2. 간단한 챗봇 구현
   → NestJS + Ollama 연동

3. RAG 시스템 구축
   → 문서 검색 + AI 결합

4. 프로덕션 배포
   → 성능 최적화 및 모니터링
```

### 참고 자료

- **Ollama 공식 문서**: https://ollama.com/
- **MLX 문서**: https://ml-explore.github.io/mlx/
- **Hugging Face**: https://huggingface.co/
- **llama.cpp**: https://github.com/ggerganov/llama.cpp
- **LangChain**: https://www.langchain.com/

---

**작성일**: 2026년 1월  
**대상**: 시니어 개발자를 위한 AI 기초 교육 자료  
**환경**: Mac Mini M4, MLX, Ollama