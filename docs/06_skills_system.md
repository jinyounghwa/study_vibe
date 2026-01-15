# 6부. Skills - 재사용 가능한 지식 체계

## 학습 목표
이 장을 마치면 다음을 이해하게 됩니다:
- Skills의 개념과 필요성
- Skills 작성 방법과 문서화 방식
- 플랫폼별 Skills 활용 방법
- 카테고리별 실전 Skills 예제
- Skills 관리 및 버전 관리 전략

---

## 6.1 Skills의 개념과 필요성

### Skills란 무엇인가?

**Skills**는 Claude에게 프로젝트의 특정 컨벤션, 아키텍처, 도메인 지식을 가르치는 문서입니다.

### 필요성: Skills 없을 때 vs 있을 때

#### Skills 없을 때

```
개발자: "사용자 조회 API를 만들어줘"

Claude (매번 설명 필요):
1. "기술 스택이 뭐예요?"
2. "데이터베이스는?"
3. "에러 처리는 어떻게?"
4. "로깅은 어떤 라이브러리?"
5. "코딩 스타일은?"

→ 시간 낭비, 일관성 없음
```

#### Skills 있을 때

```
개발자: "[Skills 업로드] 사용자 조회 API를 만들어줘"

Claude:
Skills를 읽고 프로젝트 컨벤션 이해
→ 일관된 스타일로 즉시 구현

결과: 빠르고 일관된 코드
```

### Skills의 3가지 이점

#### 1. 개발 속도 향상

```
구현 속도 비교:
- 설명 없음: 1단계 설명 → 구현 (30분)
- Skills 있음: 구현 (10분)

→ 3배 빠름
```

#### 2. 일관성 유지

```
문제: 여러 개발자가 다른 스타일로 코드 작성
- 개발자 A: camelCase
- 개발자 B: snake_case
- 개발자 C: PascalCase

해결: Skills에 코딩 컨벤션 정의
→ 모두 동일한 스타일로 작성
```

#### 3. 지식 공유

```
시니어 개발자가 축적한 지식을:
- 주니어 개발자도 바로 활용 가능
- 새로운 팀원이 빠르게 학습
- 기술 부채 예방
```

---

## 6.2 Skills 작성 방법

### SKILL.md 파일 구조

```markdown
# [프로젝트명] Skills

## 📋 개요
이 문서는 [프로젝트명]의 개발 컨벤션과 아키텍처를 설명합니다.

## 🏗️ 아키텍처

### 폴더 구조
[폴더 구조 설명]

### 주요 패턴
[아키텍처 패턴 설명]

## 💻 코딩 컨벤션

### 네이밍 규칙
[네이밍 컨벤션]

### 코드 스타일
[코드 스타일 예시]

## 🔧 기술 스택
[기술 스택 명시]

## 📚 자주 구현하는 패턴

### 패턴 1: [설명]
[코드 예시]

### 패턴 2: [설명]
[코드 예시]

## ⚠️ 주의사항
[피해야 할 것들]

## 📖 참고 자료
[관련 문서 링크]
```

### 실제 예시: NestJS 백엔드 Skills

```markdown
# E-Commerce API Skills

## 📋 개요
NestJS + TypeScript + PostgreSQL 기반의 전자상거래 API입니다.
모든 개발자는 이 Skills를 따라 일관된 코드를 작성해야 합니다.

## 🏗️ 아키텍처

### 폴더 구조
```
src/
├─ modules/
│  ├─ users/
│  │  ├─ controllers/
│  │  ├─ services/
│  │  ├─ entities/
│  │  ├─ dtos/
│  │  └─ user.module.ts
│  ├─ products/
│  │  ├─ ...
│  ├─ orders/
│  │  ├─ ...
│  └─ common/
│     ├─ decorators/
│     ├─ filters/
│     ├─ guards/
│     └─ interceptors/
├─ config/
├─ database/
│  ├─ migrations/
│  └─ seeds/
├─ utils/
└─ main.ts
```

### 주요 패턴: Module 구조

```typescript
// users/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

## 💻 코딩 컨벤션

### 네이밍 규칙

**클래스/인터페이스**: PascalCase
```typescript
export class UserService {}
export interface CreateUserDto {}
```

**변수/함수**: camelCase
```typescript
const userName = 'John';
function getUserById(id: number) {}
```

**상수**: UPPER_SNAKE_CASE
```typescript
const MAX_LOGIN_ATTEMPTS = 3;
const JWT_EXPIRATION_TIME = '24h';
```

**데이터베이스 컬럼**: snake_case
```typescript
@Column({ name: 'created_at' })
createdAt: Date;
```

**파일명**: kebab-case
```
user.service.ts
user.controller.ts
create-user.dto.ts
```

### 코드 스타일

**타입 지정**: 항상 명시적
```typescript
// ✅ Good
function createUser(name: string, email: string): Promise<User> {}

// ❌ Bad
function createUser(name, email) {}
```

**Error 처리**: HttpException 사용
```typescript
// ✅ Good
if (!user) {
  throw new NotFoundException('User not found');
}

// ❌ Bad
if (!user) {
  throw new Error('User not found');
}
```

**비동기 함수**: async/await 사용
```typescript
// ✅ Good
async findUserById(id: number): Promise<User> {
  return this.userRepository.findOne(id);
}

// ❌ Bad
findUserById(id): User {
  return this.userRepository.findOne(id);
}
```

## 🔧 기술 스택

- **프레임워크**: NestJS 10.0
- **언어**: TypeScript 5.0
- **데이터베이스**: PostgreSQL 14
- **ORM**: TypeORM 0.3
- **인증**: JWT (jsonwebtoken 9.0)
- **검증**: class-validator 0.14
- **로깅**: Winston 3.0
- **테스트**: Jest 29.0

## 📚 자주 구현하는 패턴

### 패턴 1: 리소스 생성 (CREATE)

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}

// user.service.ts
async create(createUserDto: CreateUserDto): Promise<User> {
  const existingUser = await this.userRepository.findOne({
    where: { email: createUserDto.email }
  });

  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

  const user = this.userRepository.create({
    ...createUserDto,
    passwordHash: await this.hashPassword(createUserDto.password)
  });

  return this.userRepository.save(user);
}

// user.controller.ts
@Post()
@HttpCode(201)
async create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### 패턴 2: 리소스 조회 (READ)

```typescript
async findById(id: number): Promise<User> {
  const user = await this.userRepository.findOne({
    where: { id }
  });

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
}

@Get(':id')
async getById(@Param('id', ParseIntPipe) id: number) {
  return this.userService.findById(id);
}
```

### 패턴 3: 리소스 업데이트 (UPDATE)

```typescript
async update(
  id: number,
  updateUserDto: UpdateUserDto
): Promise<User> {
  const user = await this.findById(id);

  Object.assign(user, updateUserDto);

  return this.userRepository.save(user);
}

@Put(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateUserDto: UpdateUserDto
) {
  return this.userService.update(id, updateUserDto);
}
```

### 패턴 4: 리소스 삭제 (DELETE)

```typescript
async delete(id: number): Promise<void> {
  const result = await this.userRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
}

@Delete(':id')
@HttpCode(204)
async remove(@Param('id', ParseIntPipe) id: number) {
  return this.userService.delete(id);
}
```

## ⚠️ 주의사항

### 피해야 할 것

❌ **var 사용**
- const/let만 사용

❌ **any 타입**
- 구체적인 타입 명시

❌ **동기 작업 (동기 라이브러리)**
- 항상 비동기로 (async/await)

❌ **전역 변수**
- 의존성 주입 사용

❌ **비즈니스 로직을 Controller에**
- Service에 모든 로직 이동

❌ **Raw SQL**
- QueryBuilder나 Repository 사용

## 📖 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [TypeORM 문서](https://typeorm.io)
- [프로젝트 README](./README.md)
```

---

## 6.3 Skills 플랫폼별 활용

### Web Interface

**방법**:
1. claude.ai 접속
2. Projects 탭 선택
3. 프로젝트 설정에서 "Skills 업로드"
4. SKILL.md 파일 선택

**특징**:
- 프로젝트별로 다른 Skills 관리 가능
- 팀원들과 자동으로 공유됨
- 웹 인터페이스에서 쉽게 편집 가능

### Claude Code (CLI)

**방법 1: 프로젝트 설정 파일**
```
프로젝트 루트/
├─ SKILL.md
├─ package.json
└─ ...
```

Claude Code가 자동으로 인식하고 활용합니다.

**방법 2: 명시적으로 제공**
```
사용자: "[Skills 읽기] SKILL.md를 기반으로 [기능] 구현해줘"
```

### Cursor / Windsurf

**Cursor 방법**:
```
프로젝트 루트/
├─ .cursorrules
├─ package.json
└─ ...
```

**.cursorrules 내용**:
```
# Cursor Rules for MyProject

## Architecture
[아키텍처 설명]

## Code Style
[코드 스타일]

## Naming Convention
[네이밍 규칙]

## Key Patterns
[주요 패턴]
```

**Windsurf 방법**:
```
프로젝트 루트/
├─ .windsurfrules
├─ package.json
└─ ...
```

---

## 6.4 Skills 카테고리별 가이드

### 카테고리 1: 아키텍처 Skills

**다루는 주제**:
- 레이어드 아키텍처
- 헥사고널 아키텍처
- 마이크로서비스
- 이벤트 기반 아키텍처

**문서화 포인트**:
- 전체 시스템 아키텍처 다이어그램
- 각 계층/레이어의 역할
- 데이터 흐름
- 모듈 간 의존성

### 카테고리 2: 프레임워크 Skills

**프레임워크 종류**:
- NestJS
- Django
- Spring Boot
- Ruby on Rails
- Next.js

**문서화 포인트**:
- 프로젝트 구조
- 프레임워크별 컨벤션
- 자주 사용하는 패턴
- 주의사항

### 카테고리 3: 도메인 Skills

**도메인 종류**:
- 인증/인가
- 결제 처리
- 알림 시스템
- 파일 업로드
- 이메일 발송

**문서화 포인트**:
- 도메인 개념
- 구현 패턴
- 에러 처리
- 보안 고려사항

### 카테고리 4: 코딩 컨벤션 Skills

**다루는 내용**:
- 네이밍 규칙
- 파일 구조
- 코드 포맷팅
- 주석 및 문서화
- 테스트 작성

**문서화 포인트**:
- 실제 코드 예시
- 피해야 할 것
- 자동화 도구 (linter, formatter)
- 검증 기준

---

## 6.5 실전 Skills 예제

### 예제 1: React + TypeScript 프론트엔드 Skills

```markdown
# Frontend Skills - React + TypeScript

## 📋 개요
React 18 + TypeScript 5.0 기반 프론트엔드 프로젝트입니다.

## 🏗️ 폴더 구조

```
src/
├─ components/        # 재사용 가능한 컴포넌트
│  ├─ Button/
│  ├─ Card/
│  └─ Modal/
├─ pages/            # 페이지별 컴포넌트
├─ hooks/            # 커스텀 훅
├─ services/         # API 호출 로직
├─ context/          # Context API
├─ styles/           # 글로벌 스타일
└─ types/            # TypeScript 타입 정의
```

## 💻 코딩 컨벤션

### 컴포넌트 작성

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  children,
  disabled = false
}) => (
  <button
    className={`btn btn-${variant}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
```

### Hook 작성

```typescript
// ✅ Good
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        setData(await response.json());
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

## 📚 자주 사용하는 패턴

### 패턴 1: Form 처리

[폼 처리 예시]

### 패턴 2: 데이터 페칭

[데이터 페칭 예시]

### 패턴 3: 상태 관리

[상태 관리 예시]
```

---

## 6.6 Skills 관리 및 버전 관리

### Skills 저장소 구성

```
skills-repository/
├─ backend/
│  ├─ nestjs-skills.md
│  ├─ django-skills.md
│  └─ spring-boot-skills.md
├─ frontend/
│  ├─ react-skills.md
│  ├─ vue-skills.md
│  └─ angular-skills.md
├─ architecture/
│  ├─ microservices-skills.md
│  ├─ hexagonal-skills.md
│  └─ event-driven-skills.md
├─ domains/
│  ├─ authentication-skills.md
│  ├─ payment-skills.md
│  └─ notification-skills.md
└─ conventions/
   ├─ code-style.md
   ├─ naming.md
   └─ testing.md
```

### 팀 내 Skills 공유 방법

#### 방법 1: GitHub 저장소

```bash
# Skills 저장소 생성
mkdir company-skills
cd company-skills
git init

# Skills 파일 추가
git add .
git commit -m "Initial Skills commit"
git push origin main
```

#### 방법 2: 프로젝트별 Skills

```
각 프로젝트 루트에 SKILL.md 유지
```

#### 방법 3: 드라이브 공유

```
Google Drive / Notion / Confluence에서 관리
```

### Skills 업데이트 및 개선 프로세스

#### 프로세스

```
1. Skills 변경 필요 인식
   └─ 팀원 피드백
   └─ 기술 스택 변경
   └─ 새로운 패턴 발견

2. 변경 제안서 작성
   └─ 변경 사항
   └─ 이유
   └─ 영향 범위

3. 팀 리뷰
   └─ 최소 2명 이상 검토

4. 병합 및 배포
   └─ 변경사항 적용
   └─ 모든 프로젝트에 공지

5. 마이그레이션
   └─ 기존 코드 업데이트 (필요한 경우)
```

### 버전 관리

```markdown
# Frontend Skills v2.1.0

## Changelog

### v2.1.0 (2024-12-15)
- 추가: Next.js 14 마이그레이션 가이드
- 수정: Tailwind CSS 클래스명 규칙
- 삭제: SCSS 관련 가이드

### v2.0.0 (2024-11-01)
- 추가: TypeScript 5.0 지원
- 변경: Hook 네이밍 규칙 변경
- 삭제: Class Component 지원 중단

### v1.0.0 (2024-09-01)
- 초기 버전 릴리스
```

---

## 6.7 다음 장 미리보기

다음 장에서는 Skills, MCP, Claude Code를 모두 활용한 통합 워크플로우를 배웁니다:
- 프로젝트 시작부터 배포까지의 전체 프로세스
- 각 개발 단계별 최적 도구 선택
- 실전 프로젝트 예제
- 협업 및 코드 리뷰 프로세스

---

## 학습 체크리스트

이 장을 완료한 후 다음 항목들을 확인하세요:

- [ ] Skills의 개념과 필요성을 이해한다
- [ ] SKILL.md 파일을 효과적으로 작성할 수 있다
- [ ] 플랫폼별로 Skills를 활용할 수 있다
- [ ] 아키텍처, 프레임워크, 도메인, 컨벤션별 Skills를 구분할 수 있다
- [ ] 실제 프로젝트에 맞게 Skills를 커스터마이징할 수 있다
- [ ] 팀 내에서 Skills를 공유하고 관리할 수 있다
