# BuyFlow ERP

구매 요청부터 승인, 발주, 입고, 검수, 재고 관리까지 물류 업무의 흐름을 통합적으로 관리하기 위한 **웹 기반 ERP 시스템**입니다.

BuyFlow ERP는 **Next.js 프론트엔드**, **Spring Boot 백엔드**, **Oracle Autonomous Database**를 기반으로 구현했으며, 최종적으로 **Docker, GitHub Container Registry(GHCR), Oracle Kubernetes Engine(OKE), NGINX Ingress, GitHub Actions**를 이용한 CI/CD 자동화 배포 구조까지 구성했습니다.

---

## 1. 프로젝트 개요

### 프로젝트명

```text
BuyFlow ERP
```

### 서비스 주소

현재 Kubernetes Ingress 설정 기준 서비스 주소입니다.

```text
https://buyflow-system.168-110-117-4.nip.io
```

### 프로젝트 목적

기업 내부의 구매 및 물류 업무는 품목 등록, 구매 요청, 승인, 발주, 입고, 검수, 재고 반영 등 여러 단계로 구성됩니다.

BuyFlow ERP는 이러한 업무 흐름을 하나의 시스템에서 처리하고, 사용자 역할과 권한에 따라 접근 가능한 메뉴 및 업무 기능을 제어할 수 있도록 구성한 물류 ERP 프로젝트입니다.

```text
품목 / 공급업체 / 창고 관리
        ↓
구매 요청 등록
        ↓
승인 또는 반려
        ↓
발주 처리
        ↓
입고 처리
        ↓
검수 처리
        ↓
재고 반영 및 이력 관리
```

---

## 2. Repository 구성

```text
BuyFlow-ERP
├── frontend-buyflow
├── backend-buyflow
└── buyflow-deploy
```

| Repository         | 역할                                                | 운영 기준 브랜치 |
| ------------------ | --------------------------------------------------- | ---------------- |
| `frontend-buyflow` | Next.js 프론트엔드                                  | `master`         |
| `backend-buyflow`  | Spring Boot REST API                                | `main`           |
| `buyflow-deploy`   | Kubernetes Manifest 및 GitHub Actions 배포 Workflow | `master`         |

### Repository 연결 구조

```text
frontend-buyflow/master push
        ↓
frontend trigger-deploy workflow
        ↓
buyflow-deploy deploy workflow 호출
```

```text
backend-buyflow/main push
        ↓
backend trigger-deploy workflow
        ↓
buyflow-deploy deploy workflow 호출
```

---

## 3. 주요 기능

### 인증 및 사용자 관리

- 로그인
- 회원가입
- 아이디 찾기
- 비밀번호 재설정
- 현재 로그인 사용자 조회
- 사용자 정보 조회 및 수정
- 마이페이지
- 직원 등록
- 사용자 관리
- 사용자 상태 변경
- 사용자 역할 관리
- 역할 및 권한 관리
- 부서별 접근 권한 관리
- 관리자, 요청자, 구매담당자 역할 구분
- 권한 기반 메뉴 접근 제어
- JWT 기반 인증
- 인증되지 않은 사용자의 업무 화면 접근 차단

### 대시보드

- 물류 업무 현황 요약
- 납기 지연 발주 건수 확인
- 승인 대기 요청 건수 확인
- 입고 예정 건수 확인
- 검수 대기 건수 확인
- 안전재고 부족 품목 확인
- 월별 입고 현황 차트
- 재고 상태 비율 차트
- 최근 구매 요청 목록
- 안전재고 부족 품목 목록
- 조회 기간 변경
- 상세 목록 Modal
- Route Loading 및 공통 Loading Overlay 적용

### 기준정보 관리

- 품목 관리
- 공급업체 관리
- 창고 관리
- 품목 사용 여부 관리
- 공급업체 거래 상태 관리
- 품목별 창고 및 안전재고 설정
- 창고 담당자 및 주소 관리
- 검색 및 필터링
- 페이지네이션
- 엑셀 다운로드

### 구매 요청 관리

- 구매 요청 등록
- 구매 요청 목록 조회
- 구매 요청 상세 조회
- 구매 요청 수정
- 구매 요청 삭제
- 구매 요청 취소
- 요청 상태 관리
- 요청 우선순위 관리
- 요청 총금액 계산
- 품목 선택 Modal
- 품목 코드 및 품목명 검색
- 품목 카테고리 필터링
- 품목별 요청 수량 입력
- 품목별 예상 단가 처리
- 품목별 비고 입력
- 첨부파일 업로드
- 구매 요청 검색 및 필터링
- 구매 요청 엑셀 다운로드
- 등록 및 수정 화면 초기 데이터 Loading 처리
- 품목 목록 조회 중 Loading 처리
- 등록 및 수정 제출 중 Loading 처리

### 승인 관리

- 승인 목록 조회
- 승인 목록 검색
- 승인 요약 정보 조회
- 승인 상세 조회
- 승인 처리
- 반려 처리
- 구매 요청 취소 처리
- 승인 이력 확인
- 첨부파일 확인
- 권한 기반 승인 처리
- 페이지네이션
- 구매 요청 상태 코드 공통화

### 발주 관리

- 발주 등록
- 발주 목록 조회
- 발주 상세 조회
- 발주 수정
- 발주 취소
- 발주 검색 및 필터링
- 구매 요청 기반 발주 처리
- 발주 품목 선택
- 공급업체 연결
- 발주 상태 변경
- 발주 엑셀 다운로드

### 입고 관리

- 입고 목록 조회
- 입고 검색 및 필터링
- 입고 등록
- 발주 기반 입고 처리
- 입고 상세 조회
- 입고 품목 관리
- 입고 수량 관리
- 입고 상태 관리
- 입고 이후 검수 업무 연결

### 검수 관리

- 검수 대기 목록 조회
- 검수 검색 및 필터링
- 검수 상세 조회
- 검수 등록
- 검수 결과 처리
- 정상 수량 및 불량 수량 관리
- 검수 완료 목록 조회
- 검수 완료 이후 재고 반영

### 재고 관리

- 재고 현황 조회
- 품목별 재고 조회
- 창고별 재고 조회
- 안전재고 부족 품목 확인
- 재고 상태 계산
- 재고 조정
- 재고 이력 조회
- 재고 변동 이력 관리
- 재고 검색 및 필터링
- 페이지네이션

### 공통 기능

- Next.js App Router 기반 화면 구성
- 공통 Dashboard Layout
- Header 및 Sidebar
- 권한 기반 메뉴 접근
- 공통 Loading Overlay
- 공통 페이지네이션
- 공통 상태 코드 및 Label 변환
- 공통 API 요청 처리
- JWT Authorization Header 설정
- HTTP 401 응답 시 인증 정보 제거 및 로그인 화면 이동
- 공통 API 오류 처리
- 첨부파일 처리
- Blob 및 CSV 파일 다운로드
- Mock API와 실제 API 전환
- 반응형 화면 구성

---

## 4. 기술 스택

### Frontend

현재 `package.json`과 Dockerfile 기준입니다.

| 구분            | 기술                      |
| --------------- | ------------------------- |
| Language        | JavaScript ES6+           |
| UI Library      | React `19.2.4`            |
| Framework       | Next.js `16.2.6`          |
| Routing         | Next.js App Router        |
| Styling         | Tailwind CSS `4.x`        |
| Chart           | Recharts `3.8.1`          |
| Icon            | lucide-react `1.17.0`     |
| Lint            | ESLint `9.x`              |
| Build           | Next.js Standalone Output |
| Package Manager | npm                       |
| Docker Runtime  | Node.js `22-alpine`       |

### Backend

현재 `build.gradle`과 Dockerfile 기준입니다.

| 구분              | 기술                       |
| ----------------- | -------------------------- |
| Language          | Java 17                    |
| Framework         | Spring Boot `3.5.14`       |
| Security          | Spring Security            |
| Authentication    | JWT, JJWT `0.12.6`         |
| ORM               | Spring Data JPA            |
| Validation        | Spring Validation          |
| DB Driver         | Oracle JDBC `23.3.0.23.09` |
| Oracle Security   | Oracle PKI `23.3.0.23.09`  |
| API Documentation | springdoc-openapi `2.8.17` |
| Excel             | Apache POI `5.2.5`         |
| Monitoring        | Spring Boot Actuator       |
| Build Tool        | Gradle                     |
| Runtime           | Eclipse Temurin Java 17    |

### Database

| 구분              | 기술                                     |
| ----------------- | ---------------------------------------- |
| DBMS              | Oracle Autonomous Database               |
| Connection        | Oracle Wallet                            |
| ORM Dialect       | Hibernate OracleDialect                  |
| Schema Validation | `spring.jpa.hibernate.ddl-auto=validate` |
| Schema 기준 파일  | `BuyFlow.sql`                            |

### DevOps / Infra

| 구분                 | 기술                             |
| -------------------- | -------------------------------- |
| Container            | Docker                           |
| Multi-platform Build | Docker Buildx                    |
| Container Registry   | GitHub Container Registry, GHCR  |
| Orchestration        | Oracle Kubernetes Engine, OKE    |
| Cloud                | Oracle Cloud Infrastructure, OCI |
| Ingress              | NGINX Ingress Controller         |
| TLS                  | cert-manager, Let’s Encrypt      |
| CI/CD                | GitHub Actions                   |
| Domain               | nip.io                           |
| Kubernetes Namespace | `buyflow`                        |
| Build Platform       | `linux/amd64`                    |

---

## 5. 시스템 아키텍처

```text
사용자 브라우저
        ↓
https://buyflow-system.168-110-117-4.nip.io
        ↓
nip.io DNS
        ↓
Oracle Cloud Load Balancer
        ↓
NGINX Ingress Controller
        ↓
Ingress
  ├── /      → buyflow-frontend-service:3000
  └── /api   → buyflow-backend-service:8080
        ↓
Oracle Kubernetes Engine
        ↓
namespace: buyflow
  ├── buyflow-frontend Deployment
  ├── buyflow-frontend-service
  ├── buyflow-backend Deployment
  ├── buyflow-backend-service
  ├── buyflow-config ConfigMap
  ├── buyflow-secret Secret
  ├── oracle-wallet Secret
  └── ghcr-secret ImagePullSecret
        ↓
Oracle Autonomous Database
```

---

## 6. CI/CD 배포 구조

최종 배포 흐름은 다음과 같습니다.

```text
frontend-buyflow/master 또는 backend-buyflow/main push
        ↓
각 Repository의 trigger-deploy workflow 실행
        ↓
buyflow-deploy/master의 deploy workflow 호출
        ↓
GitHub Actions 실행
        ↓
buyflow-deploy Repository Checkout
        ↓
frontend-buyflow/master Checkout
backend-buyflow/main Checkout
        ↓
OCI CLI 설치 및 인증
        ↓
Docker Buildx 설정
        ↓
GHCR 로그인
        ↓
Frontend Docker Image Build
Backend Docker Image Build
        ↓
GHCR에 Docker Image Push
        ↓
OKE Kubeconfig 생성
        ↓
Kubernetes Secret 생성 또는 갱신
        ↓
Oracle Wallet Secret 생성 또는 갱신
        ↓
GHCR ImagePullSecret 생성 또는 갱신
        ↓
ConfigMap 및 Service 적용
        ↓
Deployment Manifest Image Tag 갱신
        ↓
Deployment 적용
        ↓
Ingress 적용
        ↓
Deployment Rollout 확인
        ↓
실제 배포 Image 확인
        ↓
비정상 Pod 검사
        ↓
사용자 접속
```

### 배포 이미지 예시

배포 Workflow는 실행 시간을 기준으로 Image Tag를 생성합니다.

```text
ghcr.io/ax0caghpplpc/buyflow-frontend:<timestamp>
ghcr.io/ax0caghpplpc/buyflow-backend:<timestamp>
```

예시:

```text
ghcr.io/ax0caghpplpc/buyflow-frontend:20260713135721
ghcr.io/ax0caghpplpc/buyflow-backend:20260713135721
```

### Docker Build Platform

현재 배포 Workflow는 다음 Platform을 사용합니다.

```text
linux/amd64
```

```bash
docker buildx build --platform linux/amd64
```

### GitHub Actions Workflow 구성

| Repository         | Workflow                               | 역할                                   |
| ------------------ | -------------------------------------- | -------------------------------------- |
| `frontend-buyflow` | `.github/workflows/trigger-deploy.yml` | `master` Push 시 배포 Workflow 호출    |
| `backend-buyflow`  | `.github/workflows/trigger-deploy.yml` | `main` Push 시 배포 Workflow 호출      |
| `buyflow-deploy`   | `.github/workflows/deploy.yml`         | Docker Build, GHCR Push, OKE 배포 수행 |

### buyflow-deploy Workflow 주요 작업

```text
1. buyflow-deploy Repository Checkout
2. frontend-buyflow/master Checkout
3. backend-buyflow/main Checkout
4. OCI CLI 설치 및 인증
5. Docker Buildx 설정
6. GHCR 로그인
7. Frontend Docker Image Build
8. Backend Docker Image Build
9. GHCR Image Push
10. OKE Kubeconfig 생성
11. Kubernetes Secret 생성 또는 갱신
12. Oracle Wallet Secret 생성 또는 갱신
13. GHCR ImagePullSecret 생성 또는 갱신
14. ConfigMap 및 Service 적용
15. Deployment Manifest Image Tag 갱신
16. Deployment 적용
17. Ingress 적용
18. Rollout Status 확인
19. 실제 배포 Image 확인
20. 비정상 Pod 검사
```

---

## 7. Kubernetes 배포 구성

```text
namespace: buyflow

frontend
  ├── Deployment
  │   ├── replicas: 2
  │   ├── containerPort: 3000
  │   ├── readinessProbe
  │   └── livenessProbe
  └── Service
      ├── type: ClusterIP
      └── port: 3000

backend
  ├── Deployment
  │   ├── replicas: 1
  │   ├── containerPort: 8080
  │   └── Oracle Wallet Mount
  └── Service
      ├── type: ClusterIP
      └── port: 8080

common
  ├── ConfigMap
  ├── Secret
  ├── Oracle Wallet Secret
  └── GHCR ImagePullSecret

external access
  └── NGINX Ingress
      ├── /api → Backend
      └── /    → Frontend
```

### Frontend Resource 설정

| 구분           | 값      |
| -------------- | ------- |
| Request CPU    | `100m`  |
| Request Memory | `256Mi` |
| Limit CPU      | `500m`  |
| Limit Memory   | `512Mi` |

### Backend Resource 설정

| 구분           | 값      |
| -------------- | ------- |
| Request CPU    | `250m`  |
| Request Memory | `512Mi` |
| Limit CPU      | `1000m` |
| Limit Memory   | `1Gi`   |

### 주요 Manifest

```text
buyflow-deploy/k8s/namespace.yaml
buyflow-deploy/k8s/configmap.yaml
buyflow-deploy/k8s/backend-deployment.yaml
buyflow-deploy/k8s/backend-service.yaml
buyflow-deploy/k8s/frontend-deployment.yaml
buyflow-deploy/k8s/frontend-service.yaml
buyflow-deploy/k8s/ingress.yaml
buyflow-deploy/k8s/cert-manager/cluster-issuer-prod.yaml
buyflow-deploy/k8s/cert-manager/cluster-issuer-staging.yaml
buyflow-deploy/k8s/example/secret-example.yaml
```

### Deployment Repository 구조

```text
buyflow-deploy
├── .github
│   └── workflows
│       └── deploy.yml
├── k8s
│   ├── cert-manager
│   │   ├── cluster-issuer-prod.yaml
│   │   └── cluster-issuer-staging.yaml
│   ├── example
│   │   └── secret-example.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── configmap.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   └── namespace.yaml
├── scripts
│   ├── delete.sh
│   └── deploy.sh
├── .gitignore
├── README.md
└── SECURITY-NOTES.md
```

### 최근 배포 Repository 변경사항

| 구분 | 파일 또는 폴더                 | 변경 내용                                                      |
| ---- | ------------------------------ | -------------------------------------------------------------- |
| 추가 | `.gitignore`                   | 민감정보와 불필요한 파일의 Git 추적 제외                       |
| 추가 | `SECURITY-NOTES.md`            | Oracle Wallet, Secret, Token 관리 주의사항 문서화              |
| 수정 | `.github/workflows/deploy.yml` | Frontend와 Backend Image Build Platform을 `linux/amd64`로 설정 |
| 삭제 | `backup-oke`                   | 운영 Secret과 Wallet 정보가 포함될 수 있는 백업 폴더 제거      |

Kubernetes Secret에 저장된 Base64 값은 암호화된 값이 아니므로 실제 Secret Manifest와 Oracle Wallet 파일을 Git에 Commit하면 안 됩니다.

---

## 8. 데이터베이스 구조

BuyFlow ERP의 데이터베이스는 Oracle 기반으로 구성되어 있습니다.

업로드된 SQL 파일에는 총 28개의 `CREATE TABLE` 구문과 26개의 `CREATE SEQUENCE` 구문이 포함되어 있습니다.

28개 Table 중 핵심 업무 및 인증 Table은 25개이고, 나머지 3개는 SQL Developer 실행 이력 또는 Backup Table입니다.

### 주요 테이블

| 테이블                           | 역할                    |
| -------------------------------- | ----------------------- |
| `USERS`                          | 사용자 정보             |
| `ROLES`                          | 역할 정보               |
| `PERMISSIONS`                    | 권한 정보               |
| `USER_ROLES`                     | 사용자와 역할 매핑      |
| `ROLE_PERMISSIONS`               | 역할과 권한 매핑        |
| `DEPARTMENT_PERMISSIONS`         | 부서별 권한 정보        |
| `DEPARTMENT_ROLE_ASSIGN_RULES`   | 부서별 역할 부여 규칙   |
| `USER_DEPARTMENT_AUTHORIZATIONS` | 사용자별 부서 접근 권한 |
| `PRODUCTS`                       | 품목 기준정보           |
| `SUPPLIER`                       | 공급업체 기준정보       |
| `WAREHOUSE`                      | 창고 기준정보           |
| `PURCHASE_REQUESTS`              | 구매 요청 Header        |
| `PURCHASE_REQUEST_ITEM`          | 구매 요청 품목 상세     |
| `APPROVAL_HISTORY`               | 승인 및 반려 이력       |
| `PURCHASE_ORDER`                 | 발주 Header             |
| `PURCHASE_ORDER_ITEM`            | 발주 품목 상세          |
| `RECEIPT`                        | 입고 Header             |
| `RECEIPT_ITEM`                   | 입고 품목 상세          |
| `INSPECTION`                     | 검수 정보               |
| `STOCK`                          | 현재 재고 현황          |
| `STOCK_HISTORY`                  | 재고 변동 이력          |
| `ATTACHMENT`                     | 첨부파일 Metadata       |
| `EXCEL_EXPORT_HISTORY`           | 엑셀 다운로드 이력      |
| `EMAIL_VERIFICATION_CODES`       | 이메일 인증 코드        |
| `PASSWORD_RESET_TOKENS`          | 비밀번호 재설정 Token   |

### 보조 및 Backup 테이블

| 테이블                      | 역할                           |
| --------------------------- | ------------------------------ |
| `DBTOOLS$EXECUTION_HISTORY` | Oracle SQL Developer 실행 이력 |
| `RECEIPT_BACKUP`            | 입고 Table Backup              |
| `USERS_BACKUP_20260618`     | 사용자 Table Backup            |

Backup Table은 실제 업무 Entity 및 Repository에서 사용하는 핵심 Table과 구분하여 관리해야 합니다.

### 핵심 데이터 흐름

```text
USERS
  ↓
PURCHASE_REQUESTS
  ↓
PURCHASE_REQUEST_ITEM
  ↓
APPROVAL_HISTORY
  ↓
PURCHASE_ORDER
  ↓
PURCHASE_ORDER_ITEM
  ↓
RECEIPT
  ↓
RECEIPT_ITEM
  ↓
INSPECTION
  ↓
STOCK
  ↓
STOCK_HISTORY
```

### 주요 Sequence

```text
SEQ_USERS
SEQ_ROLES
SEQ_PERMISSIONS
SEQ_USER_ROLES
SEQ_ROLE_PERMISSIONS
SEQ_PURCHASE_REQUEST
SEQ_PURCHASE_REQUEST_ITEM
SEQ_APPROVAL_HISTORY
SEQ_PURCHASE_ORDER
SEQ_PURCHASE_ORDER_ITEM
SEQ_RECEIPT
SEQ_RECEIPT_ITEM
SEQ_INSPECTION
SEQ_STOCK
SEQ_STOCK_HISTORY
SEQ_SUPPLIER
SEQ_WAREHOUSE
```

---

## 9. 화면 개발 현황

Next.js의 `(auth)`와 `(dashboard)`는 Route Group이므로 실제 URL에는 포함되지 않습니다.

| 구분        | 화면                    | URL                                    | 상태 |
| ----------- | ----------------------- | -------------------------------------- | ---- |
| 인증        | 로그인                  | `/login`                               | 완료 |
| 인증        | 회원가입                | `/signup`                              | 완료 |
| 인증        | 아이디 찾기             | `/find-id`                             | 완료 |
| 인증        | 비밀번호 재설정         | `/reset-password`                      | 완료 |
| 대시보드    | 현황 요약               | `/dashboard`                           | 완료 |
| 마이페이지  | 사용자 정보             | `/mypage`                              | 완료 |
| 품목 관리   | 품목 목록 및 검색       | `/products`                            | 완료 |
| 품목 관리   | 품목 등록               | `/products/new`                        | 완료 |
| 품목 관리   | 품목 수정               | `/products/{productId}/edit`           | 완료 |
| 공급업체    | 공급업체 목록           | `/suppliers`                           | 완료 |
| 공급업체    | 공급업체 등록           | `/suppliers/new`                       | 완료 |
| 공급업체    | 공급업체 수정           | `/suppliers/{supplierId}/edit`         | 완료 |
| 창고 관리   | 창고 목록, 등록 및 수정 | `/warehouses`                          | 완료 |
| 구매 요청   | 구매 요청 목록          | `/purchase-requests`                   | 완료 |
| 구매 요청   | 구매 요청 등록          | `/purchase-requests/new`               | 완료 |
| 구매 요청   | 구매 요청 상세          | `/purchase-requests/{requestId}`       | 완료 |
| 구매 요청   | 구매 요청 수정          | `/purchase-requests/{requestId}/edit`  | 완료 |
| 승인 관리   | 승인 목록               | `/approvals`                           | 완료 |
| 승인 관리   | 승인 상세               | `/approvals/{approvalId}`              | 완료 |
| 발주 관리   | 발주 목록               | `/purchase-orders`                     | 완료 |
| 발주 관리   | 발주 등록               | `/purchase-orders/new`                 | 완료 |
| 발주 관리   | 발주 수정               | `/purchase-orders/{orderId}/edit`      | 완료 |
| 입고 관리   | 입고 목록               | `/receipts`                            | 완료 |
| 입고 관리   | 입고 등록               | `/receipts/new`                        | 완료 |
| 입고 관리   | 입고 상세               | `/receipts/{receiptId}`                | 완료 |
| 입고 관리   | 발주 기반 입고          | `/receipts/order/{orderId}`            | 완료 |
| 검수 관리   | 검수 목록               | `/inspections`                         | 완료 |
| 검수 관리   | 검수 상세               | `/inspections/{inspectionId}`          | 완료 |
| 검수 관리   | 검수 등록               | `/inspections/{inspectionId}/register` | 완료 |
| 검수 관리   | 검수 완료 목록          | `/inspections/completed`               | 완료 |
| 재고 관리   | 재고 현황               | `/stock`                               | 완료 |
| 재고 관리   | 재고 이력               | `/stock/history`                       | 완료 |
| 시스템 관리 | 사용자 및 권한 관리     | `/system`                              | 완료 |

창고 등록과 수정은 별도 URL이 아니라 `/warehouses` 화면 내부의 Modal 방식으로 처리합니다.

Root URL인 `/`로 접근하면 로그인 화면인 `/login`으로 이동합니다.

---

## 10. 프론트엔드 디렉터리 구조

```text
frontend-buyflow
├── .github
│   └── workflows
│       └── trigger-deploy.yml
├── public
│   ├── icons
│   └── images
│       └── buyflow-erp
│           └── loading.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── find-id
│   │   │   ├── login
│   │   │   ├── reset-password
│   │   │   └── signup
│   │   ├── (dashboard)
│   │   │   ├── approvals
│   │   │   ├── dashboard
│   │   │   ├── inspections
│   │   │   ├── mypage
│   │   │   ├── products
│   │   │   ├── purchase-orders
│   │   │   ├── purchase-requests
│   │   │   ├── receipts
│   │   │   ├── stock
│   │   │   ├── suppliers
│   │   │   ├── system
│   │   │   └── warehouses
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components
│   │   ├── common
│   │   │   └── LoadingOverlay.jsx
│   │   └── layout
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   ├── constants
│   │   ├── pagination.js
│   │   ├── productStatus.js
│   │   └── purchaseRequestStatus.js
│   ├── features
│   │   ├── approval
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── inspection
│   │   ├── mypage
│   │   ├── product
│   │   ├── purchase-order
│   │   ├── purchase-request
│   │   │   ├── api
│   │   │   ├── components
│   │   │   ├── config
│   │   │   ├── data
│   │   │   ├── hooks
│   │   │   └── utils
│   │   ├── receipt
│   │   ├── stock
│   │   ├── supplier
│   │   ├── system
│   │   └── warehouse
│   ├── hooks
│   ├── lib
│   │   ├── api
│   │   │   └── fetchClient.js
│   │   ├── env
│   │   │   └── isMockEnabled.js
│   │   └── file
│   │       └── downloadFile.js
│   └── utils
│       ├── authStorage.js
│       ├── permissions.js
│       └── useClientReady.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
├── env.example
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
└── postcss.config.mjs
```

### 주요 폴더 역할

| 폴더                        | 역할                                               |
| --------------------------- | -------------------------------------------------- |
| `src/app`                   | Next.js App Router 기반 화면 경로 관리             |
| `src/app/(auth)`            | 로그인, 회원가입 등 인증 Route Group               |
| `src/app/(dashboard)`       | 로그인 이후 업무 화면 Route Group                  |
| `src/components/common`     | 여러 기능에서 사용하는 공통 UI                     |
| `src/components/layout`     | Header, Sidebar 등 Layout Component                |
| `src/constants`             | 페이지네이션, 상태 코드, 상태 Label 등 공통 상수   |
| `src/features`              | 업무 기능별 API, Component, Hook, Data, Utils 관리 |
| `src/features/*/api`        | 기능별 Backend API 요청                            |
| `src/features/*/components` | 기능별 화면 및 UI Component                        |
| `src/features/*/hooks`      | 기능별 상태 및 비즈니스 로직                       |
| `src/features/*/data`       | Mock Data 및 화면 초기 Option                      |
| `src/features/*/utils`      | 기능별 변환, 계산, Filter 함수                     |
| `src/features/*/config`     | 기능별 설정값과 제한값                             |
| `src/lib/api`               | Backend API 통신 공통 로직                         |
| `src/lib/env`               | 환경변수 및 Mock 활성화 처리                       |
| `src/lib/file`              | Blob, CSV, 파일명 추출 및 다운로드                 |
| `src/hooks`                 | 공통 React Hook                                    |
| `src/utils`                 | 인증 저장소 및 권한 관련 공통 함수                 |

### 최근 추가된 공통 파일

| 파일                                                                | 역할                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| `src/constants/pagination.js`                                       | 기본 Page Size 및 Page Number 생성 함수 공통화          |
| `src/constants/productStatus.js`                                    | 품목 사용 여부와 Backend `Y`, `N` 값 변환               |
| `src/constants/purchaseRequestStatus.js`                            | 구매 요청 상태, 우선순위, Label, CSS Class 공통화       |
| `src/features/purchase-request/config/purchaseRequestFormConfig.js` | 첨부파일 제한, 기본 비고, 잠금 Form Field 설정          |
| `src/features/purchase-request/utils/purchaseRequestFormUtils.js`   | 품목 Filter, Category 생성, 첨부파일 검증, Payload 변환 |
| `src/lib/env/isMockEnabled.js`                                      | 개발 환경에서 Mock 활성화 여부 확인                     |
| `src/lib/file/downloadFile.js`                                      | Blob, CSV 다운로드 및 파일명 추출                       |

### 최근 수정된 구매 요청 파일

| 파일                                                                   | 수정 내용                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| `src/app/(dashboard)/dashboard/loading.jsx`                            | 공통 `LoadingOverlay`의 `show` 속성 적용                      |
| `src/features/purchase-request/components/PurchaseItemSelectModal.jsx` | 품목 조회 중 안내 문구와 버튼 비활성화 처리                   |
| `src/features/purchase-request/components/PurchaseRequestCreate.jsx`   | 초기화, 품목 조회, 등록 제출 상태를 Loading Overlay와 연결    |
| `src/features/purchase-request/components/PurchaseRequestEdit.jsx`     | 상세 조회, 품목 조회, 수정 제출 상태를 Loading Overlay와 연결 |
| `src/features/purchase-request/hooks/usePurchaseRequestCreate.js`      | 인증 초기화 및 품목 Modal 최초 조회 상태 관리                 |
| `src/features/purchase-request/hooks/usePurchaseRequestEdit.js`        | 수정 화면 품목 조회 Loading State 정리                        |

### 구매 요청 Loading 처리 구조

구매 요청 등록 화면은 다음 상태 중 하나라도 진행 중이면 Loading Overlay를 표시합니다.

```javascript
const showLoadingOverlay = isInitializing || isProductLoading || isSubmitting
```

구매 요청 수정 화면은 다음 상태 중 하나라도 진행 중이면 Loading Overlay를 표시합니다.

```javascript
const showLoadingOverlay = loading || isProductLoading || isSubmitting
```

품목 목록은 구매 요청 등록 화면에 진입하자마자 조회하지 않고, 사용자가 품목 선택 Modal을 열 때 최초 조회합니다.

---

## 11. 백엔드 디렉터리 구조

```text
backend-buyflow
├── .github
│   └── workflows
│       └── trigger-deploy.yml
├── gradle
│   └── wrapper
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── buyflow
│   │   │           └── erp
│   │   │               ├── Common
│   │   │               ├── Config
│   │   │               ├── Controller
│   │   │               ├── Dto
│   │   │               ├── Entity
│   │   │               ├── Exception
│   │   │               ├── Repository
│   │   │               ├── Security
│   │   │               ├── Service
│   │   │               └── Util
│   │   └── resources
│   │       ├── db
│   │       ├── application-local.properties
│   │       ├── application-prod.properties
│   │       └── application.properties
│   └── test
│       └── java
├── Dockerfile
├── build.gradle
├── gradlew
├── gradlew.bat
└── settings.gradle
```

### 주요 계층

| 계층         | 역할                                          |
| ------------ | --------------------------------------------- |
| `Controller` | REST API 요청 처리                            |
| `Service`    | 비즈니스 로직 처리                            |
| `Repository` | Spring Data JPA 기반 데이터베이스 접근        |
| `Entity`     | Oracle DB Table과 JPA Entity 매핑             |
| `Dto`        | 요청 및 응답 데이터 전달                      |
| `Security`   | JWT 생성, 인증 Filter 및 Security 처리        |
| `Config`     | Security, CORS, Swagger, Web 설정             |
| `Common`     | 공통 응답, 예외, 오류 코드, 상태 및 권한 상수 |
| `Exception`  | 기능별 예외 처리                              |
| `Util`       | 공통 Utility                                  |

### 주요 Controller

```text
AdminRbacController
AdminUserController
ApprovalController
AttachmentController
AuthController
DashboardController
DepartmentPermissionController
HealthController
InspectionController
PermissionController
ProductController
PurchaseOrderController
PurchaseOrderItemController
PurchaseRequestController
ReceiptController
ReceiptItemController
RoleController
StockController
StockHistoryController
SupplierController
UserController
WarehouseController
```

### 최근 추가된 Common 클래스

| 파일                                     | 역할                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `Common/FilterCodes.java`                | 검색 조건의 `"전체"` 값을 공통 상수로 관리       |
| `Common/PermissionCodes.java`            | 승인 조회 및 승인 처리 권한 코드 관리            |
| `Common/PurchaseRequestStatusCodes.java` | 구매 요청 상태 코드를 공통 상수로 관리           |
| `Common/RoleCodes.java`                  | 관리자 및 승인 관련 역할 코드를 공통 상수로 관리 |

### 구매 요청 상태 코드

```text
DRAFT
PENDING_APPROVAL
APPROVED
REJECTED
ORDERED
CANCELED
CANCEL_REQUESTED
```

### 승인 관련 권한 코드

```text
approvals.read
approvals.process
```

### 역할 코드

```text
ADMIN
MANAGER
APPROVER
TEAM_MANAGER
```

### 최근 수정된 Service

| 파일                                | 수정 내용                                                        |
| ----------------------------------- | ---------------------------------------------------------------- |
| `Service/ApprovalServiceImpl.java`  | 승인 상태, 권한, 역할 및 전체 Filter 문자열을 Common 상수로 교체 |
| `Service/DashboardServiceImpl.java` | 구매 요청 상태 문자열을 Common 상태 상수로 교체                  |

Backend의 공통 Context Path는 다음과 같습니다.

```properties
server.servlet.context-path=/api
```

따라서 실제 API 주소는 다음 형태입니다.

```text
http://localhost:8080/api/auth/login
http://localhost:8080/api/products
http://localhost:8080/api/purchase-requests
http://localhost:8080/api/approvals
```

---

## 12. 로컬 실행 방법

### Frontend

#### Repository Clone

```bash
git clone https://github.com/BuyFlow-ERP/frontend-buyflow.git
cd frontend-buyflow
```

#### Package 설치

`package-lock.json`에 기록된 동일한 의존성을 설치하려면 다음 명령어를 권장합니다.

```bash
npm ci
```

일반 설치는 다음 명령어를 사용할 수 있습니다.

```bash
npm install
```

#### 개발 서버 실행

```bash
npm run dev
```

로컬 접속 주소:

```text
http://localhost:3000
```

#### Lint 실행

```bash
npm run lint
```

#### Production Build

```bash
npm run build
```

#### Production Server 실행

```bash
npm run start
```

### Backend

#### Repository Clone

```bash
git clone https://github.com/BuyFlow-ERP/backend-buyflow.git
cd backend-buyflow
```

Backend의 기본 Profile은 `local`입니다.

```properties
spring.profiles.default=local
```

#### Windows 실행

```powershell
gradlew.bat clean bootRun
```

#### Git Bash, macOS 또는 Linux 실행

```bash
chmod +x gradlew
./gradlew clean bootRun
```

백엔드 기본 주소:

```text
http://localhost:8080
```

API 기본 주소:

```text
http://localhost:8080/api
```

---

## 13. 환경변수

### Frontend

프로젝트 Root에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
API_INTERNAL_BASE_URL=http://localhost:8080

NEXT_PUBLIC_USE_DASHBOARD_MOCK=false
NEXT_PUBLIC_USE_PRODUCT_MOCK=false
NEXT_PUBLIC_USE_PURCHASE_REQUEST_MOCK=false
NEXT_PUBLIC_USE_APPROVAL_MOCK=false
NEXT_PUBLIC_USE_SUPPLIER_MOCK=false
NEXT_PUBLIC_USE_WAREHOUSE_MOCK=false
NEXT_PUBLIC_USE_PURCHASE_ORDER_MOCK=false
NEXT_PUBLIC_USE_RECEIPT_MOCK=false
NEXT_PUBLIC_USE_INSPECTION_MOCK=false
NEXT_PUBLIC_USE_STOCK_MOCK=false
NEXT_PUBLIC_USE_SYSTEM_MOCK=false
```

Frontend API 함수에서 `/api` 경로를 직접 추가하므로 `NEXT_PUBLIC_API_BASE_URL`에는 일반적으로 `/api`를 붙이지 않습니다.

올바른 로컬 설정:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

운영 설정:

```env
NEXT_PUBLIC_API_BASE_URL=https://buyflow-system.168-110-117-4.nip.io
```

다음과 같이 `/api`를 중복해서 설정하지 않도록 주의해야 합니다.

```env
# 잘못된 예시
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

Kubernetes 내부 Backend Service 주소는 다음과 같습니다.

```env
API_INTERNAL_BASE_URL=http://buyflow-backend-service.buyflow.svc.cluster.local:8080
```

현재 Frontend Source의 Browser API 요청은 `NEXT_PUBLIC_API_BASE_URL`을 사용합니다.

### Backend Local Profile

Local 환경에서는 다음 환경변수를 사용합니다.

```env
LOCAL_DB_URL=jdbc:oracle:thin:@<SERVICE_NAME>?TNS_ADMIN=C:/oracle/Wallet_Ventureworld/
LOCAL_DB_USERNAME=<DB_USERNAME>
LOCAL_DB_PASSWORD=<DB_PASSWORD>
LOCAL_JWT_SECRET=<LOCAL_JWT_SECRET>
```

`.env` 파일은 Spring Boot에서 기본적으로 자동으로 읽지 않습니다.

다음 방법 중 하나로 환경변수를 설정해야 합니다.

- 운영체제 환경변수
- IntelliJ Run Configuration
- VS Code Launch Configuration
- 명령어 실행 전 Shell 환경변수
- 별도 환경변수 Loader

### Backend Production Profile

```env
DB_URL=jdbc:oracle:thin:@<SERVICE_NAME>?TNS_ADMIN=/app/wallet
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
JWT_SECRET=<JWT_SECRET>
UPLOAD_DIR=/app/uploads
CORS_ALLOWED_ORIGIN=https://buyflow-system.168-110-117-4.nip.io
JWT_EXPIRATION_MINUTES=120
DB_POOL_SIZE=5
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
JPA_FORMAT_SQL=false
SERVER_FORWARD_HEADERS_STRATEGY=framework
```

### 환경변수 주의사항

- `.env.local`은 GitHub에 업로드하지 않습니다.
- DB 비밀번호와 JWT Secret을 Source Code에 직접 작성하지 않습니다.
- Oracle Wallet 파일을 Repository에 업로드하지 않습니다.
- 운영 환경의 민감정보는 GitHub Actions Secrets와 Kubernetes Secret으로 관리합니다.
- Kubernetes Secret의 Base64 값은 암호화된 값이 아닙니다.
- `NEXT_PUBLIC_` 환경변수는 Next.js Build 시점에 Client Bundle에 포함될 수 있으므로 민감정보를 저장하면 안 됩니다.

### 현재 Mock 환경변수 확인사항

현재 일부 API는 공통 `isMockEnabled` 함수를 사용하고, 일부 API는 환경변수를 직접 비교합니다.

공통 함수는 다음 형태입니다.

```javascript
export function isMockEnabled(envValue) {
  return process.env.NODE_ENV !== "production" && envValue === "true"
}
```

따라서 호출할 때는 환경변수 이름 문자열이 아니라 실제 환경변수 값을 전달해야 합니다.

```javascript
isMockEnabled(process.env.NEXT_PUBLIC_USE_PRODUCT_MOCK)
```

Mock 처리 방식은 향후 전체 API 파일에서 동일한 방식으로 통일할 필요가 있습니다.

또한 `NEXT_PUBLIC_USE_SYSTEM_MOCK`은 현재 `systemApi.js`에서 참조하지만 Frontend Dockerfile과 배포 Workflow의 Build Argument에는 포함되어 있지 않으므로 추가 정리가 필요합니다.

---

## 14. GitHub Actions Secrets

### buyflow-deploy Repository

```text
CHECKOUT_TOKEN
GHCR_USERNAME
GHCR_PAT
OCI_USER_OCID
OCI_TENANCY_OCID
OCI_FINGERPRINT
OCI_PRIVATE_KEY_B64
OCI_REGION
OKE_CLUSTER_OCID
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
ORACLE_WALLET_ZIP_B64
```

### frontend-buyflow / backend-buyflow Repository

```text
DEPLOY_PAT
```

`DEPLOY_PAT`는 Frontend 또는 Backend Repository의 Push 이벤트에서 `buyflow-deploy` Repository의 `deploy.yml` Workflow를 호출하기 위해 사용합니다.

### Secret 관리 원칙

다음 정보는 Source Code와 Git Repository에 직접 저장하지 않습니다.

```text
DB 비밀번호
JWT Secret
OCI Private Key
Oracle Wallet
GHCR Personal Access Token
Kubernetes Secret Manifest
.env
.env.local
```

민감정보가 과거 Git History에 포함된 적이 있다면 단순히 파일만 삭제하지 않고 관련 비밀번호, Token, Key 및 Wallet을 교체해야 합니다.

---

## 15. 배포 결과 확인 명령어

### Pod 확인

```bash
kubectl get pods -n buyflow
```

### Service 확인

```bash
kubectl get svc -n buyflow
```

### Ingress 확인

```bash
kubectl get ingress -n buyflow
```

### Deployment 확인

```bash
kubectl get deployment -n buyflow
```

### 배포 이미지 확인

Frontend:

```bash
kubectl get deployment buyflow-frontend \
  -n buyflow \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

Backend:

```bash
kubectl get deployment buyflow-backend \
  -n buyflow \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

### Rollout 확인

Frontend:

```bash
kubectl rollout status deployment/buyflow-frontend -n buyflow
```

Backend:

```bash
kubectl rollout status deployment/buyflow-backend -n buyflow
```

### Log 확인

Frontend:

```bash
kubectl logs deployment/buyflow-frontend -n buyflow
```

Backend:

```bash
kubectl logs deployment/buyflow-backend -n buyflow
```

### 비정상 Pod 확인

```bash
kubectl get pods -n buyflow --field-selector=status.phase!=Running
```

---

## 16. 팀 정보

### 김호현

- 역할: 팀장
- 담당 영역: 대시보드, 품목 관리, 구매 요청, 승인 관리, DevOps
- 구현 내용:
  - 대시보드 화면 및 데이터 연동
  - 품목 관리 기능 구현
  - 구매 요청 등록, 목록, 상세, 수정 및 삭제 구현
  - 구매 요청 품목 선택 기능 구현
  - 구매 요청 상태 및 우선순위 공통화
  - 구매 요청 등록 및 수정 Loading 처리
  - 승인 및 반려 처리
  - 구매 요청 취소 및 상태 관리
  - 공통 페이지네이션 및 파일 다운로드 Refactoring
  - Docker Image Build 구성
  - Kubernetes Manifest 구성
  - Oracle Kubernetes Engine 배포
  - GitHub Container Registry Image 관리
  - GitHub Actions CI/CD 구성

### 하지수

- 역할: 팀원
- 담당 영역: 창고, 발주, 검수, 첨부파일, 엑셀 다운로드
- 구현 내용:
  - 발주 등록, 목록 및 상세 기능 구현
  - 발주 수정 및 상태 변경 기능 구현
  - 검수 등록 및 검수 결과 처리 기능 구현
  - 검수 완료 목록 구현
  - 창고 관리 기능 구현
  - 첨부파일 처리
  - 엑셀 다운로드 기능 구현

### 배승훈

- 역할: 팀원
- 담당 영역: 회원, 권한, 공통 기능, 공급업체 관리
- 구현 내용:
  - 공급업체 관리 기능 구현
  - 로그인 및 회원가입 기능 구현
  - 아이디 찾기 및 비밀번호 재설정 기능 구현
  - 직원 등록 기능 구현
  - 사용자 및 권한 관리 기능 구현
  - 관리자, 요청자, 구매담당자 역할 구분
  - 공통 Layout 구현
  - 권한 기반 메뉴 접근 제어 구현

### 김연준

- 역할: 팀원
- 담당 영역: 입고, 재고
- 구현 내용:
  - 입고 등록 및 상세 기능 구현
  - 발주 기반 입고 처리 기능 구현
  - 입고 처리 이후 재고 반영 기능 구현
  - 재고 현황 조회 기능 구현
  - 재고 이력 조회 기능 구현
  - 재고 조정 기능 구현

---

## 17. 최종 완료 상태

현재 Repository와 배포 설정 기준 구현 상태입니다.

```text
Frontend 화면 구현: 완료
Backend REST API 구현: 완료
Oracle Database Schema 구성: 완료
Oracle Autonomous Database 연동: 완료
Oracle Wallet 연동 설정: 완료
JWT 인증 및 권한 처리: 완료
Docker Multi-stage Build 구성: 완료
GHCR Image Push Workflow 구성: 완료
Kubernetes Manifest 구성: 완료
OKE 배포 Workflow 구성: 완료
NGINX Ingress 연결: 완료
TLS 인증서 발급 설정: 완료
도메인 연결 설정: 완료
GitHub Actions CI/CD 자동화 배포 구성: 완료
```

실제 운영 상태는 GitHub Actions의 최근 Workflow 실행 결과와 다음 명령어를 통해 확인해야 합니다.

```bash
kubectl get pods -n buyflow
kubectl get ingress -n buyflow
kubectl rollout status deployment/buyflow-frontend -n buyflow
kubectl rollout status deployment/buyflow-backend -n buyflow
```

---

## 18. 향후 개선 사항

- Mock 활성화 로직을 모든 API에서 공통 함수로 통일
- `NEXT_PUBLIC_USE_SYSTEM_MOCK` Docker Build Argument 추가
- `API_INTERNAL_BASE_URL` 실제 사용 여부 정리
- `env.example`의 Kubernetes 내부 Service 주소 오타 수정
- Dashboard `loading.jsx`의 Component 이름을 경로에 맞게 변경
- 기능별 파일명 대소문자 규칙 통일
- 입고 기능의 `ReceiptApi.js`, `ReceiptUtils.js` 파일명 정리
- Backend의 사용하지 않는 Example 파일 제거
- Backend의 `User.java`, `Users.java` 중복 사용 여부 확인
- Backend Service 클래스 기능 단위 분리
- API 응답 Format 표준화
- 기능별 Unit Test 및 Integration Test 보강
- Frontend Error Boundary 적용
- Backend Health Check Probe 추가
- 첨부파일 저장소를 PersistentVolume 또는 OCI Object Storage로 분리
- 운영 Log 수집 및 Monitoring 구성
- Prometheus 및 Grafana 적용
- Docker Layer Cache를 적용하여 GitHub Actions Build 시간 단축
- 배포 실패 알림 구성
- 배포 Image Tag와 Release Note 연결
- Kubernetes Secret을 OCI Vault 또는 External Secrets로 전환
- E2E Test 자동화
- 빈 `scripts/deploy.sh`, `scripts/delete.sh` 파일 구현 또는 제거

---

## 19. License

본 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다.
