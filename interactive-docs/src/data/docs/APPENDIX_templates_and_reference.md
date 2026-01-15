# 부록. 템플릿 모음 및 레퍼런스

---

## A. 스펙 템플릿 모음

### A.1 백엔드 API 스펙 템플릿

```markdown
# [API명] 스펙

## 1. 기능 목적

[이 API가 왜 필요하고 어떤 가치를 제공하는가]

## 2. API 엔드포인트

### 엔드포인트 1: [작업명]
```
HTTP 메서드: [POST/GET/PUT/DELETE]
경로: [/api/...]
인증: [필요/불필요]
권한: [필요한 역할]

요청 파라미터:
- [필드명]: [타입] - [설명]
- [필드명]: [타입] - [선택]

요청 본문:
{
  "[필드명]": [예시값],
  "[필드명]": [예시값]
}

응답 성공 (200/201):
{
  "success": true,
  "data": {
    "[필드명]": [예시값]
  }
}

응답 실패 (400/401/403/404/500):
{
  "success": false,
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[사용자 친화적 메시지]"
  }
}
```

## 3. 데이터 모델

[필요한 모든 데이터 구조]

## 4. 비즈니스 로직

[단계별 처리 과정]

## 5. 에러 처리

[모든 가능한 에러 상황]

## 6. 성능 요구사항

- 응답 시간: [시간]
- 동시성: [사용자수]
- 처리량: [req/s]

## 7. 테스트 시나리오

- [ ] 정상 케이스
- [ ] 경계값 테스트
- [ ] 에러 케이스
- [ ] 성능 테스트
```

### A.2 프론트엔드 컴포넌트 스펙 템플릿

```markdown
# [컴포넌트명] 스펙

## Props (입력값)

```typescript
interface [ComponentName]Props {
  [propName]: [type]; // [설명]
  [optionalProp]?: [type]; // [선택]
}
```

## 상태

```typescript
[상태명]: [타입] // [설명]
```

## 이벤트/콜백

```typescript
on[EventName]?: (data: [type]) => void;
```

## UI 레이아웃

[컴포넌트의 시각적 구조 설명]

## 상호작용

1. 사용자가 [액션]을 하면
2. [컴포넌트]가 [상태변화]
3. [이벤트]를 발동
4. 부모는 [처리]

## 접근성

- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] 색상 대비
- [ ] 포커스 인디케이터

## 반응형

- 모바일: [너비]
- 태블릿: [너비]
- 데스크톱: [너비]

## 사용 예시

```javascript
<[ComponentName]
  prop1={value}
  prop2={value}
  on[Event]={handleEvent}
/>
```
```

### A.3 데이터베이스 스키마 스펙 템플릿

```markdown
# [테이블명] 스키마

## 테이블 정의

```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY,
  [column_name] [type] [constraints],
  [column_name] [type] [constraints],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 컬럼 설명

| 컬럼명 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | 기본 키 |
| [컬럼] | [타입] | [제약] | [설명] |

## 인덱스

```sql
CREATE INDEX idx_[table]_[column] ON [table]([column]);
```

## 관계

```
[TableA] ←→ [TableB]
FK: [column] references [table]([column])
```

## 예시 데이터

```json
{
  "id": "uuid",
  "[column]": "값"
}
```
```

---

## B. 유용한 Skills 레퍼런스

### B.1 GitHub에서 찾을 수 있는 공개 Skills

- **anthropic/prompt-reference**: Claude 프롬프팅 가이드
  https://github.com/anthropics/prompt-reference

- **community-skills**: 커뮤니티 작성 Skills 모음
  https://github.com/topics/claude-skills

### B.2 자주 사용되는 Skills 카테고리

**아키텍처:**
- Clean Architecture
- Microservices
- Hexagonal Architecture
- Event-Driven

**프레임워크:**
- NestJS
- Django
- Spring Boot
- Next.js
- Vue.js

**도메인:**
- Authentication
- Payment Processing
- Notification System
- File Upload
- Search Functionality

**언어별:**
- TypeScript
- Python
- Go
- Rust

---

## C. MCP 도구 카탈로그

### C.1 필수 MCP 서버 목록

**파일 시스템**
- 기능: 프로젝트 파일 접근
- 설정: 자동 포함
- 용도: 프로젝트 구조 이해

**데이터베이스**
- PostgreSQL: DB 쿼리 및 스키마 관리
- MySQL: 유사한 기능
- SQLite: 로컬 개발 환경
- MongoDB: NoSQL 쿼리

**버전 관리**
- Git: 커밋 이력, 브랜치 관리
- GitHub: PR, Issue 관리
- GitLab: 유사한 기능

**외부 서비스**
- HTTP API: REST API 호출
- GraphQL: GraphQL 쿼리
- Slack: 메시지 전송
- Email: 이메일 발송

### C.2 상황별 추천 MCP 조합

**풀스택 개발**
- 파일시스템
- PostgreSQL
- Git
- HTTP API

**데이터 분석**
- 파일시스템
- PostgreSQL
- HTTP API
- (+ Python 스크립트 MCP)

**팀 협업**
- GitHub
- Slack
- Git
- 파일시스템

---

## D. 도구별 단축키 및 명령어 치트시트

### D.1 Claude Code CLI 명령어

```bash
# 기본 시작
claude-code

# 도움말 확인
claude-code --help
/help

# 프로젝트 초기화
claude-code init

# 특정 파일로 시작
claude-code src/

# 이전 대화 계속
claude-code resume [conversation-id]
```

### D.2 Cursor 주요 단축키

| 기능 | 단축키 |
|------|--------|
| AI Chat | Cmd/Ctrl + K |
| Inline Edit | Cmd/Ctrl + L |
| Accept | Tab |
| Reject | Esc |
| Composer | Cmd/Ctrl + Shift + K |

### D.3 Windsurf 주요 명령어

| 기능 | 명령어 |
|------|--------|
| Cascade Mode | Cmd + / |
| Multi-file Edit | Cmd + Shift + K |
| Terminal | Ctrl + ` |
| Command Palette | Cmd + Shift + P |

---

## E. 추가 학습 자료

### E.1 Claude 공식 문서

- **Claude API 문서**: https://docs.anthropic.com
- **Claude Code 가이드**: https://claude.ai/claude-code
- **Prompt Engineering 가이드**: https://docs.anthropic.com/en/docs/build-a-claude-app

### E.2 각 도구별 공식 문서

| 도구 | 문서 |
|------|------|
| Cursor | https://www.cursor.com/docs |
| Windsurf | https://codeium.com/windsurf |
| Aider | https://aider.chat/docs |
| Continue.dev | https://docs.continue.dev |

### E.3 바이브코딩 커뮤니티

**온라인 커뮤니티:**
- GitHub Discussions (anthropics/claude-code)
- Discord (Claude Community Server)
- Reddit (r/ClaudeAI)

**학습 리소스:**
- YouTube: Claude 튜토리얼 채널
- Medium: AI 개발 블로그
- Dev.to: 커뮤니티 아티클

### E.4 실전 프로젝트 예제 저장소

**GitHub 저장소 추천:**
- anthropics/cookbook: 실전 예제
- community-examples: 커뮤니티 프로젝트
- awesome-claude: 큐레이션된 리소스

---

## F. 개발 체크리스트 모음

### F.1 프로젝트 시작 체크리스트

```
□ 요구사항 정의
  □ 비즈니스 목표 확인
  □ 사용자 시나리오 작성
  □ 기능 우선순위 정리

□ 스펙 작성
  □ 상세 스펙 작성
  □ 팀 리뷰 및 승인
  □ 기술 스택 결정

□ 기술 준비
  □ Skills 작성
  □ 보일러플레이트 생성
  □ 개발 환경 설정

□ 도구 준비
  □ Claude Code 설치
  □ Editor 설정 (Cursor/Windsurf)
  □ Git 저장소 생성
```

### F.2 기능 구현 체크리스트

```
□ 스펙 이해
  □ 요구사항 명확히 이해
  □ 예외 상황 파악
  □ 성능 요구사항 확인

□ 구현
  □ AI에 명확한 지시
  □ Skills 기반 요청
  □ 코드 생성 및 검증

□ 테스트
  □ 단위 테스트 작성
  □ 통합 테스트 작성
  □ 성능 테스트

□ 리뷰
  □ 스펙 준수 확인
  □ 보안 검증
  □ 성능 확인
  □ 코드 품질 검토

□ 배포
  □ 배포 준비
  □ 모니터링 설정
  □ 배포 실행
```

### F.3 코드 리뷰 체크리스트

```
기능 정확성:
□ 스펙의 모든 요구사항 충족
□ 엣지 케이스 처리
□ 에러 처리 적절
□ 테스트 커버리지 충분

코드 품질:
□ 변수명 명확
□ 함수 단일 책임
□ DRY 원칙 준수
□ 주석 필요한 부분만

성능:
□ N+1 쿼리 없음
□ 불필요한 연산 없음
□ 메모리 누수 없음
□ 응답 시간 요구사항 충족

보안:
□ 입력값 검증
□ SQL injection 방지
□ XSS 방지
□ 민감 정보 보호
□ 인증/인가 확인

유지보수성:
□ 기존 코드와 일관성
□ Skills 준수
□ 테스트 커버리지
□ 문서화
```

---

## G. 자주 묻는 스펙 패턴

### G.1 페이지네이션 스펙

```markdown
## 페이지네이션

쿼리 파라미터:
- `page`: 페이지 번호 (기본값: 1, 최소: 1)
- `pageSize`: 한 페이지 크기 (기본값: 20, 최대: 100)
- `sort`: 정렬 기준 (기본값: 'created_at:desc')

응답:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 500,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### G.2 필터링 스펙

```markdown
## 필터링

쿼리 파라미터:
- 텍스트 필터: `keyword` (부분검색)
- 범위 필터: `minPrice`, `maxPrice` (포함)
- 정확 필터: `status` (정확일치)
- 다중 필터: `tags` (쉼표로 구분)
- 날짜 필터: `startDate`, `endDate` (ISO 8601)

예시:
GET /api/products?keyword=laptop&minPrice=1000&maxPrice=5000&status=active&page=1
```

### G.3 정렬 스펙

```markdown
## 정렬

쿼리 파라미터:
- `sort`: 정렬 필드와 방향 (기본값: '-created_at')
- 형식: `[필드명]` 또는 `-[필드명]` (음수는 역순)

예시:
- `sort=price` (가격 오름차순)
- `sort=-price` (가격 내림차순)
- `sort=created_at,name` (여러 기준)

허용된 정렬 필드:
- created_at
- updated_at
- price
- rating
```

---

## H. 프롬프트 분석 및 최적화 가이드

### H.1 나쁜 프롬프트 vs 좋은 프롬프트

**예시 1: API 구현 요청**

❌ 나쁜 프롬프트:
```
"API를 만들어줘"
```

✅ 좋은 프롬프트:
```
"[Skills 기반] 다음 API를 구현해줘:

엔드포인트: POST /api/users/search
입력: {keyword: string, filter: {category?: string}}
출력: {users: {id, name, email}[], total: number}

요구사항:
- 텍스트는 부분검색
- 카테고리는 정확검색
- 결과는 최대 50개
- 응답시간 < 200ms

기술:
- Node.js + Express
- PostgreSQL + Sequelize ORM"
```

### H.2 프롬프트 최적화 체크리스트

```
□ 목표가 명확한가?
□ 기술 스택이 명시되었는가?
□ 입출력이 정의되었는가?
□ 제약조건이 명시되었는가?
□ 예시 코드를 제공했는가?
□ Skills/컨텍스트를 제공했는가?
□ 성공 기준이 명확한가?
□ 길이가 너무 길지 않은가? (500 토큰 이하 권장)
```

---

## I. 성능 최적화 가이드 참고

### I.1 일반적인 성능 병목

| 병목 | 증상 | 해결책 |
|-----|-----|---------|
| 느린 쿼리 | 응답 시간 증가 | 인덱스, 쿼리 최적화 |
| N+1 쿼리 | 쿼리 수 증가 | JOIN, batch load |
| 메모리 누수 | 메모리 증가 | 참조 정리 |
| 동기 처리 | 블로킹 | async/await |
| 캐싱 미사용 | 반복 계산 | Redis/메모리 캐싱 |

### I.2 성능 측정 도구

- **Lighthouse**: 웹 성능 측정
- **New Relic**: APM 모니터링
- **Datadog**: 인프라 모니터링
- **Prometheus**: 메트릭 수집

---

## J. 보안 고려사항 체크리스트

```
입력 검증:
□ 모든 입력값 검증
□ 타입 확인
□ 길이 제한
□ 형식 검증 (이메일, URL 등)

인증/인가:
□ 인증 방식 명확
□ 권한 검증 존재
□ 세션 관리 적절
□ 토큰 유효기간 설정

데이터 보호:
□ 전송 암호화 (HTTPS)
□ 저장 암호화 (민감 데이터)
□ 개인정보 접근 로그
□ 주기적 백업

API 보안:
□ Rate limiting
□ CSRF 방지
□ 헤더 검증
□ 로깅 및 모니터링
```

---

## K. 용어 사전

- **바이브코딩**: AI를 활용한 의도 기반 개발
- **Skills**: Claude에게 프로젝트 컨벤션을 가르치는 문서
- **MCP**: Model Context Protocol, Claude를 확장하는 표준
- **스펙**: 기능의 상세한 명세서
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token, 인증 토큰
- **ORM**: Object-Relational Mapping
- **TDD**: Test-Driven Development
- **E2E**: End-to-End 테스트
- **CI/CD**: Continuous Integration/Deployment

---

## L. 추천 읽을거리

### 책
- "Clean Code" (Robert C. Martin)
- "The Pragmatic Programmer"
- "Software Engineering at Google"

### 온라인 자료
- Anthropic Docs: https://docs.anthropic.com
- MDN Web Docs: https://developer.mozilla.org
- Dev.to: https://dev.to

### 커뮤니티
- Stack Overflow: 문제 해결
- GitHub Issues: 보고 및 논의
- Discord Communities: 실시간 대화

---

## 마지막 조언

### 시작하기

1. **작은 프로젝트부터 시작**
   - 간단한 기능 1-2개 구현
   - 도구 익숙해지기
   - 프로세스 정립

2. **지속적으로 개선**
   - 주간 회고
   - Skills 업데이트
   - 팀 피드백 수집

3. **커뮤니티와 소통**
   - 경험 공유
   - 베스트 프랙티스 배우기
   - 새로운 도구 시도

### 성공의 핵심

```
바이브코딩의 성공 = 좋은 스펙 + 효과적인 검증 + 지속적 개선

1. 좋은 스펙
   → AI가 정확히 이해할 수 있도록
   → 명확성, 완결성, 실행 가능성

2. 효과적인 검증
   → 생성된 코드를 믿지 말고 검증
   → 보안, 성능, 정확성 확인

3. 지속적 개선
   → 팀 피드백 수집
   → Skills 업데이트
   → 프로세스 최적화
```

좋은 개발 되세요! 🚀
