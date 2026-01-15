# 5부. MCP (Model Context Protocol) 마스터하기

## 학습 목표
이 장을 마치면 다음을 이해하게 됩니다:
- MCP란 무엇이고 어떤 문제를 해결하는가
- 환경별 MCP 지원 현황
- MCP 설정 및 활용 방법
- 실전 MCP 활용 사례
- 커스텀 MCP 서버 개발 기초

---

## 5.1 MCP란 무엇인가

### 개념

**MCP (Model Context Protocol)**는 Claude의 기능을 확장하여 외부 도구, 데이터, 서비스와 연결할 수 있게 해주는 표준 프로토콜입니다.

### MCP의 역할

**MCP 없이**:
```
사용자: "GitHub의 최신 커밋 5개를 보여줘"
Claude: "죄송합니다. GitHub에 접근할 수 없습니다."
```

**MCP 있이**:
```
사용자: "GitHub의 최신 커밋 5개를 보여줘"
Claude: [MCP를 통해 GitHub API 접근]
Claude: "최신 커밋: [데이터]"
```

### MCP가 해결하는 문제들

**문제 1: 실시간 정보 부족**
- ❌ 문제: Claude의 학습 데이터는 2024년 2월까지만 포함
- ✅ 해결: MCP로 실시간 데이터 접근

**문제 2: 프로젝트 특화 데이터 부족**
- ❌ 문제: 개인 프로젝트 코드를 Claude가 모름
- ✅ 해결: MCP로 프로젝트 파일 접근

**문제 3: 외부 서비스 연동 불가**
- ❌ 문제: 데이터베이스, API 등에 접근 불가
- ✅ 해결: MCP로 외부 서비스 연동

**문제 4: 작업 실행 불가**
- ❌ 문제: Claude가 제안만 하고 직접 실행 불가
- ✅ 해결: MCP로 실제 작업 자동 실행

---

## 5.2 MCP 환경별 지원 현황

### 지원 현황 표

| 환경 | MCP 지원 | 설정 방식 | 기본 MCP | 커스텀 |
|-----|--------|---------|--------|-------|
| Web Interface | 제한적 | UI 설정 | 일부 | ✓ |
| Claude Code | 전체 | 설정 파일 | 기본 포함 | ✓ |
| Cursor | 자체 확장 | 플러그인 | - | × |
| Windsurf | 자체 확장 | 플러그인 | - | × |
| API 직접 사용 | 전체 | 프로그래밍 | 없음 | ✓ |

### 각 환경별 특징

#### Web Interface
- **지원**: 파일 시스템, 웹 검색 (기본)
- **제약**: 사용자가 선택한 MCP만 사용 가능
- **설정**: claude.ai의 설정 메뉴에서 활성화

#### Claude Code (CLI)
- **지원**: 모든 MCP
- **장점**: 가장 많은 MCP 접근 가능
- **설정**: `~/.claude/mcp_servers.json`

#### Cursor / Windsurf
- **지원**: 고유의 확장 시스템
- **특징**: IDE 통합 확장이 더 강력
- **설정**: `.cursorrules` 또는 `.windsurfrules`

---

## 5.3 MCP 설정 및 활용

### Claude Code에서 MCP 설정

#### 1단계: MCP 설정 파일 위치

```
~/.claude/mcp_servers.json
```

#### 2단계: 기본 설정 구조

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["~/.claude/mcp-server-filesystem.js"],
      "enabled": true
    },
    "postgres": {
      "command": "node",
      "args": ["~/.claude/mcp-server-postgres.js"],
      "env": {
        "DB_URL": "postgresql://user:pass@localhost/db"
      },
      "enabled": true
    }
  }
}
```

### 주요 MCP 도구 소개

#### 1. 파일 시스템 MCP

**기능**: 프로젝트의 파일 구조 탐색 및 검색

```
사용 사례:
- 프로젝트 구조 이해
- 특정 파일 찾기
- 파일 내용 읽기/쓰기
```

**사용 예**:
```
사용자: "프로젝트에서 TypeScript 타입 정의 파일을 모두 찾아줘"
Claude: [파일시스템 MCP 사용]
Claude: "다음 .d.ts 파일을 찾았습니다:
- types/user.d.ts
- types/product.d.ts
- ..."
```

#### 2. 데이터베이스 MCP

**기능**: 데이터베이스 쿼리 실행 및 스키마 조회

```
지원 데이터베이스:
- PostgreSQL
- MySQL
- SQLite
- MongoDB
```

**사용 예**:
```
사용자: "현재 데이터베이스의 테이블 구조를 알려줘"
Claude: [DB MCP 사용]
Claude: "테이블:
- users (id, email, created_at, ...)
- products (id, name, price, ...)
- ..."
```

#### 3. Git MCP

**기능**: Git 저장소 조회 및 관리

```
기능:
- 최근 커밋 조회
- 브랜치 관리
- 파일 변경 이력 조회
- 커밋 메시지 기반 검색
```

**사용 예**:
```
사용자: "최근 1주일 동안 변경된 파일을 보여줘"
Claude: [Git MCP 사용]
Claude: "변경된 파일:
- src/api/userController.ts
- src/services/userService.ts
- tests/user.test.ts"
```

#### 4. API 호출 MCP

**기능**: 외부 API 호출

```
지원 서비스:
- HTTP/REST API
- GraphQL
- WebAPI (JSON 기반)
```

**사용 예**:
```
사용자: "날씨 API에서 서울의 날씨를 조회해줘"
Claude: [API MCP 사용]
Claude: "서울 날씨:
- 기온: 15°C
- 습도: 60%
- ..."
```

---

## 5.4 실전 MCP 활용 사례

### 사례 1: 파일 시스템 MCP로 프로젝트 구조 탐색

**상황**: 새로운 팀원이 프로젝트에 합류

```
팀원: "이 프로젝트의 전체 구조를 이해하고 싶어"

Claude:
1. [파일시스템 MCP] 프로젝트 루트에서 디렉토리 구조 탐색
2. 각 디렉토리의 README 파일 읽기
3. 핵심 파일들의 내용 분석
4. 아키텍처 설명 작성

결과:
"이 프로젝트는 다음과 같은 구조를 가집니다:
- /src: 소스 코드
  - /api: API 엔드포인트
  - /services: 비즈니스 로직
  - /models: 데이터 모델
- /tests: 테스트 코드
- /docs: 문서
- ..."
```

### 사례 2: 데이터베이스 MCP로 스키마 관리

**상황**: API 문서와 실제 DB 스키마 검증

```
팀 리드: "API 문서에 명시된 필드와 실제 DB 스키마가 일치하는지 확인해줘"

Claude:
1. [DB MCP] 실제 테이블 스키마 조회
2. API 문서의 필드 명세 분석
3. 불일치 항목 검출
4. 개선안 제시

결과:
"다음 불일치를 찾았습니다:
- API 문서: status는 'active'/'inactive' (문자열)
- 실제 DB: status는 boolean
→ DB 마이그레이션 필요"
```

### 사례 3: Git MCP로 버전 관리 자동화

**상황**: 주간 변경 사항 리포트

```
매니저: "지난 주 우리 팀이 뭘 했는지 정리해줘"

Claude:
1. [Git MCP] 최근 7일 커밋 조회
2. 각 커밋의 메시지 분석
3. 파일 변경 통계
4. 주간 리포트 작성

결과:
"지난 주 변경 사항:
- 4개의 새로운 기능 추가
- 12개의 버그 수정
- 8개 파일 리팩토링
- 코드 리뷰: 23개 (평균 2.2시간 소요)"
```

---

## 5.5 커스텀 MCP 서버 개발

### MCP 서버 개발 기초

#### 기본 구조

```javascript
// mcp-server-custom.js

const { Server } = require('@anthropic-ai/mcp-sdk');

// 1. 서버 생성
const server = new Server();

// 2. 도구 등록
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'greet_user',
        description: '사용자에게 인사하기',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '사용자 이름'
            }
          },
          required: ['name']
        }
      }
    ]
  };
});

// 3. 도구 실행
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request;

  if (name === 'greet_user') {
    return {
      content: [
        {
          type: 'text',
          text: `안녕하세요, ${args.name}님!`
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 4. 서버 시작
server.start();
```

#### 등록 방법

```json
// ~/.claude/mcp_servers.json
{
  "mcpServers": {
    "custom_greeting": {
      "command": "node",
      "args": ["~/.claude/mcp-server-custom.js"],
      "enabled": true
    }
  }
}
```

### 프로젝트 특화 도구 만들기

**예제: 프로젝트 설정 도구**

```javascript
// mcp-server-project-config.js

const fs = require('fs');
const path = require('path');

const server = new Server();

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'get_project_config',
        description: '프로젝트 설정 파일 읽기',
        inputSchema: {
          type: 'object',
          properties: {
            filename: {
              type: 'string',
              description: 'package.json, .env 등'
            }
          },
          required: ['filename']
        }
      },
      {
        name: 'update_project_config',
        description: '프로젝트 설정 파일 업데이트',
        inputSchema: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
            content: { type: 'string' }
          },
          required: ['filename', 'content']
        }
      }
    ]
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request;

  if (name === 'get_project_config') {
    const filePath = path.join(process.cwd(), args.filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      content: [{ type: 'text', text: content }]
    };
  }

  if (name === 'update_project_config') {
    const filePath = path.join(process.cwd(), args.filename);
    fs.writeFileSync(filePath, args.content);
    return {
      content: [{ type: 'text', text: '설정이 업데이트되었습니다.' }]
    };
  }
});

server.start();
```

### 보안 및 권한 관리

#### 원칙 1: 최소 권한 원칙

```javascript
// 예: 읽기만 허용하고 쓰기는 제한
server.setRequestHandler('tools/call', async (request) => {
  if (request.name === 'dangerous_delete') {
    throw new Error('이 도구는 비활성화되었습니다.');
  }
  // ...
});
```

#### 원칙 2: 경로 검증

```javascript
// 예: /secure 디렉토리 내의 파일만 접근
function validatePath(filePath) {
  const realPath = path.resolve(filePath);
  const allowedDir = path.resolve('/secure');

  if (!realPath.startsWith(allowedDir)) {
    throw new Error('이 경로에 접근할 수 없습니다.');
  }
  return realPath;
}
```

#### 원칙 3: 입력 검증

```javascript
// 예: SQL injection 방지
function validateQuery(query) {
  const dangerous = ['DROP', 'DELETE', 'TRUNCATE'];

  if (dangerous.some(keyword => query.includes(keyword))) {
    throw new Error('위험한 쿼리입니다.');
  }
  return query;
}
```

---

## 5.6 MCP 활용 체크리스트

### MCP 선택 시 확인

- [ ] 필요한 MCP가 존재하는가?
- [ ] 현재 환경에서 지원하는가?
- [ ] 보안 요구사항을 만족하는가?
- [ ] 설정이 복잡하지 않은가?

### MCP 설정 후 확인

- [ ] 설정 파일이 올바르게 작성되었는가?
- [ ] 필요한 환경 변수가 설정되었는가?
- [ ] 권한(파일, 데이터베이스)이 올바른가?
- [ ] 서버가 제대로 시작되는가?

### MCP 사용 시 확인

- [ ] 도구가 예상대로 작동하는가?
- [ ] 성능이 만족스러운가?
- [ ] 에러 처리가 적절한가?
- [ ] 로그가 기록되는가?

---

## 5.7 다음 장 미리보기

다음 장에서는 반복되는 패턴을 재사용 가능하게 관리하는 Skills 시스템을 배웁니다:
- Skills의 개념과 필요성
- Skills 작성 방법
- 플랫폼별 Skills 활용
- 실전 Skills 예제
- Skills 관리 및 버전 관리

---

## 학습 체크리스트

이 장을 완료한 후 다음 항목들을 확인하세요:

- [ ] MCP가 무엇이고 어떤 문제를 해결하는지 이해한다
- [ ] 환경별 MCP 지원 현황을 알고 있다
- [ ] Claude Code에서 MCP를 설정할 수 있다
- [ ] 주요 MCP 도구 (파일시스템, DB, Git, API)를 활용할 수 있다
- [ ] 실전 MCP 활용 사례를 이해한다
- [ ] 간단한 커스텀 MCP 서버를 만들 수 있다
- [ ] 보안 원칙을 이해하고 적용할 수 있다
