# BuyFlow ERP

구매 요청부터 승인, 발주, 입고, 검수, 재고 관리까지 기업의 구매·물류 업무 흐름을 통합적으로 관리하기 위한 **웹 기반 ERP 시스템**입니다.

BuyFlow ERP는 다음 기술을 기반으로 구성되어 있습니다.

- Frontend: Next.js, React, Tailwind CSS
- Backend: Spring Boot, Spring Security, Spring Data JPA
- Database: Oracle Autonomous Database
- Deployment: Docker, GHCR, Oracle Kubernetes Engine
- CI/CD: GitHub Actions
- External Access: NGINX Ingress, cert-manager, Let’s Encrypt, nip.io

---

## 1. 프로젝트 개요

### 1.1 프로젝트명

```text
BuyFlow ERP
```

### 1.2 운영 서비스 주소

현재 Kubernetes Ingress manifest 기준 서비스 주소입니다.

```text
https://buyflow-system.168-110-117-4.nip.io
```

### 1.3 프로젝트 목적

기업 내부의 구매 및 물류 업무는 다음과 같은 여러 단계로 구성됩니다.

```text
품목 / 공급업체 / 창고 등록
        ↓
구매 요청 등록
        ↓
구매 요청 승인 또는 반려
        ↓
발주 등록 및 발주 처리
        ↓
입고 등록
        ↓
검수 처리
        ↓
재고 반영
        ↓
재고 변동 이력 관리
```

BuyFlow ERP는 위 업무를 하나의 시스템에서 처리하고, 사용자 역할 및 권한에 따라 접근 가능한 메뉴와 기능을 제어할 수 있도록 구현한 프로젝트입니다.

---

## 2. Repository 구성

BuyFlow ERP는 Frontend, Backend, Deployment 저장소로 분리되어 있습니다.

```text
BuyFlow-ERP
├── frontend-buyflow
├── backend-buyflow
└── buyflow-deploy
```

| Repository         | 역할                                            | 운영 기준 브랜치 |
| ------------------ | ----------------------------------------------- | ---------------- |
| `frontend-buyflow` | Next.js 기반 Frontend                           | `master`         |
| `backend-buyflow`  | Spring Boot 기반 REST API                       | `main`           |
| `buyflow-deploy`   | Kubernetes manifest 및 GitHub Actions 배포 설정 | `master`         |

### Repository 간 연결 구조

```text
frontend-buyflow/master push
        ↓
frontend trigger-deploy.yml
        ↓
buyflow-deploy/deploy.yml 실행
```

```text
backend-buyflow/main push
        ↓
backend trigger-deploy.yml
        ↓
buyflow-deploy/deploy.yml 실행
```

---

## 3. 주요 업무 흐름

```text
사용자 로그인
    ↓
품목 / 공급업체 / 창고 기준정보 관리
    ↓
구매 요청 등록
    ↓
승인 담당자의 승인 또는 반려
    ↓
승인 완료 요청을 기준으로 발주 등록
    ↓
발주 건을 기준으로 입고 등록
    ↓
입고 품목 검수
    ↓
정상 입고 수량 재고 반영
    ↓
재고 현황 및 재고 이력 조회
```

---

## 4. 주요 기능

## 4.1 인증 및 사용자 기능

- 로그인
- 회원가입
- 아이디 찾기
- 비밀번호 재설정
- 현재 로그인 사용자 조회
- JWT 기반 인증
- 로그인 세션 저장 및 제거
- 인증되지 않은 사용자 로그인 화면 이동
- 마이페이지 사용자 정보 조회 및 수정
- 사이드바 사용자 정보 표시

## 4.2 시스템 및 권한 관리

- 사용자 목록 조회
- 사용자 검색 및 페이지네이션
- 사용자 등록
- 사용자 정보 수정
- 사용자 상태 변경
- 사용자 승인 처리
- 사용자 역할 변경
- 부서별 접근 권한 설정
- 역할별 권한 설정
- 권한 기반 메뉴 노출 제어
- 관리자 전용 기능 접근 제어

## 4.3 대시보드

- 물류 업무 현황 요약
- 승인 대기 구매 요청 건수
- 입고 예정 건수
- 검수 대기 건수
- 안전재고 부족 품목 건수
- 월별 입고 현황 차트
- 재고 상태 비율 차트
- 최근 구매 요청 목록
- 안전재고 부족 품목 목록
- 조회 기간 변경
- 공통 로딩 오버레이 적용

## 4.4 품목 관리

- 품목 목록 조회
- 품목 검색
- 품목 필터링
- 품목 등록
- 품목 수정
- 품목 상세 조회
- 품목 사용 여부 관리
- 품목별 창고 설정
- 품목별 안전재고 설정
- 페이지네이션
- 필터 옵션 조회
- 엑셀 다운로드

## 4.5 공급업체 관리

- 공급업체 목록 조회
- 공급업체 검색 및 필터링
- 공급업체 등록
- 공급업체 수정
- 공급업체 상세 조회
- 공급업체 거래 상태 변경
- 페이지네이션
- 엑셀 다운로드

## 4.6 창고 관리

- 창고 목록 조회
- 창고 검색
- 창고 등록
- 창고 수정
- 창고 상세 조회
- 창고 주소 관리
- 창고 담당자 관리
- 창고 사용 여부 관리
- 페이지네이션
- 엑셀 다운로드

창고 등록과 수정은 별도의 URL 화면이 아니라 `/warehouses` 화면 내부의 Modal 방식으로 처리합니다.

## 4.7 구매 요청 관리

- 구매 요청 목록 조회
- 구매 요청 검색 및 필터링
- 구매 요청 요약 정보 조회
- 구매 요청 등록
- 구매 요청 상세 조회
- 구매 요청 수정
- 구매 요청 삭제
- 구매 요청 취소
- 품목 선택 Modal
- 품목 코드 및 품목명 검색
- 품목 카테고리 필터링
- 품목별 요청 수량 입력
- 품목별 예상 단가 처리
- 품목별 비고 입력
- 요청 총금액 계산
- 첨부파일 업로드
- 구매 요청 엑셀 다운로드
- 구매 요청 상태 및 우선순위 공통화
- 등록·수정·품목 조회·제출 과정 로딩 오버레이 적용

## 4.8 승인 관리

- 승인 목록 조회
- 승인 목록 검색
- 승인 요약 정보 조회
- 승인 상세 조회
- 구매 요청 승인
- 구매 요청 반려
- 구매 요청 취소 처리
- 승인 이력 조회
- 첨부파일 확인
- 권한 기반 승인 처리
- 페이지네이션

## 4.9 발주 관리

- 발주 목록 조회
- 발주 검색 및 필터링
- 발주 등록
- 발주 상세 조회
- 발주 수정
- 발주 취소
- 발주 품목 선택
- 공급업체 연결
- 구매 요청 기반 발주 처리
- 발주 상태 변경
- 엑셀 다운로드

## 4.10 입고 관리

- 입고 목록 조회
- 입고 검색 및 필터링
- 입고 요약 정보 조회
- 입고 등록
- 발주 기반 입고 등록
- 입고 상세 조회
- 입고 품목 관리
- 입고 수량 관리
- 입고 상태 관리
- 입고 이후 검수 업무 연결

## 4.11 검수 관리

- 검수 대기 목록 조회
- 검수 검색 및 필터링
- 검수 요약 정보 조회
- 검수 상세 조회
- 검수 결과 등록
- 정상 수량 및 불량 수량 관리
- 검수 완료 목록 조회
- 검수 완료 요약 정보 조회
- 검수 완료 이후 재고 반영

## 4.12 재고 관리

- 재고 현황 조회
- 품목별 재고 조회
- 창고별 재고 조회
- 안전재고 부족 품목 확인
- 재고 상태 계산
- 재고 조정
- 재고 변동 이력 조회
- 재고 이력 검색 및 필터링
- 페이지네이션

## 4.13 공통 기능

- Next.js App Router 기반 라우팅
- 공통 Dashboard Layout
- Header 및 Sidebar
- 인증 사용자 보호 Layout
- 공통 API 요청 처리
- JWT Authorization Header 설정
- HTTP 401 응답 시 로그인 화면 이동
- 공통 API 오류 처리
- 공통 로딩 오버레이
- 공통 페이지네이션 상수
- 공통 상태 코드 및 상태 Label 변환
- Blob 및 CSV 다운로드
- Mock API와 실제 API 전환
- 반응형 화면 구성

---

## 5. 기술 스택

## 5.1 Frontend

`package.json` 및 Dockerfile 기준입니다.

| 구분            | 기술                  |
| --------------- | --------------------- |
| Language        | JavaScript ES6+       |
| Framework       | Next.js `16.2.6`      |
| UI Library      | React `19.2.4`        |
| DOM Renderer    | React DOM `19.2.4`    |
| Routing         | Next.js App Router    |
| Styling         | Tailwind CSS `4.x`    |
| Chart           | Recharts `3.8.1`      |
| Icon            | lucide-react `1.17.0` |
| Lint            | ESLint `9.x`          |
| Build Output    | Next.js Standalone    |
| Package Manager | npm                   |
| Docker Runtime  | Node.js `22-alpine`   |

## 5.2 Backend

`build.gradle` 및 Dockerfile 기준입니다.

| 구분                  | 기술                                 |
| --------------------- | ------------------------------------ |
| Language              | Java 17                              |
| Framework             | Spring Boot `3.5.14`                 |
| Dependency Management | Spring Dependency Management `1.1.7` |
| Web                   | Spring Web                           |
| Security              | Spring Security                      |
| Authentication        | JWT                                  |
| JWT Library           | JJWT `0.12.6`                        |
| ORM                   | Spring Data JPA                      |
| Validation            | Spring Validation                    |
| Database Driver       | Oracle JDBC `23.3.0.23.09`           |
| Oracle Security       | Oracle PKI `23.3.0.23.09`            |
| API Documentation     | springdoc-openapi `2.8.17`           |
| Excel                 | Apache POI `5.2.5`                   |
| Utility               | Apache Commons Lang `3.12.0`         |
| Build Tool            | Gradle                               |
| Docker Build Image    | Eclipse Temurin 17 JDK               |
| Docker Runtime Image  | Eclipse Temurin 17 JRE               |

## 5.3 Database

| 구분              | 기술                                     |
| ----------------- | ---------------------------------------- |
| DBMS              | Oracle Autonomous Database               |
| Connection        | Oracle Wallet                            |
| ORM Dialect       | Hibernate OracleDialect                  |
| Schema Validation | `spring.jpa.hibernate.ddl-auto=validate` |
| SQL 기준 파일     | `BuyFlow.sql`                            |

## 5.4 DevOps 및 Infra

| 구분                 | 기술                        |
| -------------------- | --------------------------- |
| Container            | Docker                      |
| Multi-platform Build | Docker Buildx               |
| Build Platform       | `linux/amd64`               |
| Container Registry   | GitHub Container Registry   |
| Orchestration        | Oracle Kubernetes Engine    |
| Cloud                | Oracle Cloud Infrastructure |
| Ingress              | NGINX Ingress Controller    |
| TLS                  | cert-manager                |
| Certificate          | Let’s Encrypt               |
| CI/CD                | GitHub Actions              |
| Domain               | nip.io                      |
| Kubernetes Namespace | `buyflow`                   |

---

## 6. 시스템 아키텍처

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
  └── ghcr-secret imagePullSecret
        ↓
Oracle Autonomous Database
```

---

## 7. Frontend 화면 및 Route 구조

Next.js의 `(auth)`와 `(dashboard)`는 Route Group이므로 실제 URL에는 포함되지 않습니다.

| 구분       | 화면                | URL                                    | 파일                                                               |
| ---------- | ------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| 공통       | Root Redirect       | `/`                                    | `src/app/page.js`                                                  |
| 인증       | 로그인              | `/login`                               | `src/app/(auth)/login/page.jsx`                                    |
| 인증       | 회원가입            | `/signup`                              | `src/app/(auth)/signup/page.jsx`                                   |
| 인증       | 아이디 찾기         | `/find-id`                             | `src/app/(auth)/find-id/page.jsx`                                  |
| 인증       | 비밀번호 재설정     | `/reset-password`                      | `src/app/(auth)/reset-password/page.jsx`                           |
| 대시보드   | 업무 현황           | `/dashboard`                           | `src/app/(dashboard)/dashboard/page.jsx`                           |
| 마이페이지 | 사용자 정보         | `/mypage`                              | `src/app/(dashboard)/mypage/page.jsx`                              |
| 품목       | 품목 목록           | `/products`                            | `src/app/(dashboard)/products/page.jsx`                            |
| 품목       | 품목 등록           | `/products/new`                        | `src/app/(dashboard)/products/new/page.jsx`                        |
| 품목       | 품목 수정           | `/products/[productId]/edit`           | `src/app/(dashboard)/products/[productId]/edit/page.jsx`           |
| 공급업체   | 공급업체 목록       | `/suppliers`                           | `src/app/(dashboard)/suppliers/page.jsx`                           |
| 공급업체   | 공급업체 등록       | `/suppliers/new`                       | `src/app/(dashboard)/suppliers/new/page.jsx`                       |
| 공급업체   | 공급업체 수정       | `/suppliers/[supplierId]/edit`         | `src/app/(dashboard)/suppliers/[supplierId]/edit/page.jsx`         |
| 창고       | 창고 관리           | `/warehouses`                          | `src/app/(dashboard)/warehouses/page.jsx`                          |
| 구매 요청  | 구매 요청 목록      | `/purchase-requests`                   | `src/app/(dashboard)/purchase-requests/page.jsx`                   |
| 구매 요청  | 구매 요청 등록      | `/purchase-requests/new`               | `src/app/(dashboard)/purchase-requests/new/page.jsx`               |
| 구매 요청  | 구매 요청 상세      | `/purchase-requests/[requestId]`       | `src/app/(dashboard)/purchase-requests/[requestId]/page.jsx`       |
| 구매 요청  | 구매 요청 수정      | `/purchase-requests/[requestId]/edit`  | `src/app/(dashboard)/purchase-requests/[requestId]/edit/page.jsx`  |
| 승인       | 승인 목록           | `/approvals`                           | `src/app/(dashboard)/approvals/page.jsx`                           |
| 승인       | 승인 상세           | `/approvals/[approvalId]`              | `src/app/(dashboard)/approvals/[approvalId]/page.jsx`              |
| 발주       | 발주 목록           | `/purchase-orders`                     | `src/app/(dashboard)/purchase-orders/page.jsx`                     |
| 발주       | 발주 등록           | `/purchase-orders/new`                 | `src/app/(dashboard)/purchase-orders/new/page.jsx`                 |
| 발주       | 발주 수정           | `/purchase-orders/[orderId]/edit`      | `src/app/(dashboard)/purchase-orders/[orderId]/edit/page.jsx`      |
| 입고       | 입고 목록           | `/receipts`                            | `src/app/(dashboard)/receipts/page.jsx`                            |
| 입고       | 입고 등록           | `/receipts/new`                        | `src/app/(dashboard)/receipts/new/page.jsx`                        |
| 입고       | 입고 상세           | `/receipts/[receiptId]`                | `src/app/(dashboard)/receipts/[receiptId]/page.jsx`                |
| 입고       | 발주 기반 입고      | `/receipts/order/[orderId]`            | `src/app/(dashboard)/receipts/order/[orderId]/page.jsx`            |
| 검수       | 검수 목록           | `/inspections`                         | `src/app/(dashboard)/inspections/page.jsx`                         |
| 검수       | 검수 상세           | `/inspections/[inspectionId]`          | `src/app/(dashboard)/inspections/[inspectionId]/page.jsx`          |
| 검수       | 검수 등록           | `/inspections/[inspectionId]/register` | `src/app/(dashboard)/inspections/[inspectionId]/register/page.jsx` |
| 검수       | 검수 완료 목록      | `/inspections/completed`               | `src/app/(dashboard)/inspections/completed/page.jsx`               |
| 재고       | 재고 현황           | `/stock`                               | `src/app/(dashboard)/stock/page.jsx`                               |
| 재고       | 재고 이력           | `/stock/history`                       | `src/app/(dashboard)/stock/history/page.jsx`                       |
| 시스템     | 사용자 및 권한 관리 | `/system`                              | `src/app/(dashboard)/system/page.jsx`                              |

Root URL인 `/`로 접근하면 `/login`으로 이동합니다.

---

## 8. Frontend 전체 디렉터리 구조

현재 Frontend ZIP에 존재하는 소스 구조를 기준으로 작성했습니다.

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
│   │   │   │   └── page.jsx
│   │   │   ├── login
│   │   │   │   └── page.jsx
│   │   │   ├── reset-password
│   │   │   │   └── page.jsx
│   │   │   └── signup
│   │   │       └── page.jsx
│   │   ├── (dashboard)
│   │   │   ├── approvals
│   │   │   │   ├── [approvalId]
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── dashboard
│   │   │   │   ├── loading.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── inspections
│   │   │   │   ├── [inspectionId]
│   │   │   │   │   ├── register
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── completed
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── mypage
│   │   │   │   └── page.jsx
│   │   │   ├── products
│   │   │   │   ├── [productId]
│   │   │   │   │   └── edit
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── purchase-orders
│   │   │   │   ├── [orderId]
│   │   │   │   │   └── edit
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── purchase-requests
│   │   │   │   ├── [requestId]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── receipts
│   │   │   │   ├── [receiptId]
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── order
│   │   │   │   │   └── [orderId]
│   │   │   │   │       └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── stock
│   │   │   │   ├── history
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── suppliers
│   │   │   │   ├── [supplierId]
│   │   │   │   │   └── edit
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── system
│   │   │   │   └── page.jsx
│   │   │   ├── warehouses
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── favicon.ico
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
│   │   │   ├── api
│   │   │   │   └── approvalApi.js
│   │   │   ├── components
│   │   │   │   ├── ApprovalListManagement.jsx
│   │   │   │   ├── ApprovalManagement.jsx
│   │   │   │   └── ApprovalSummaryCards.jsx
│   │   │   ├── data
│   │   │   │   └── mockApprovalData.js
│   │   │   ├── hooks
│   │   │   │   ├── useApprovalListManagement.js
│   │   │   │   └── useApprovalManagement.js
│   │   │   └── utils
│   │   │       └── approvalUtils.js
│   │   ├── auth
│   │   │   ├── api
│   │   │   │   └── authApi.js
│   │   │   ├── components
│   │   │   │   ├── AuthFormPage.jsx
│   │   │   │   ├── AuthInput.jsx
│   │   │   │   ├── AuthShell.jsx
│   │   │   │   ├── RequireAuth.jsx
│   │   │   │   ├── SidebarAccount.jsx
│   │   │   │   └── UserInfoModal.jsx
│   │   │   └── context
│   │   │       └── AuthContext.jsx
│   │   ├── dashboard
│   │   │   ├── api
│   │   │   │   └── dashboardApi.js
│   │   │   ├── components
│   │   │   │   ├── DashboardCharts.jsx
│   │   │   │   ├── DashboardSummaryCards.jsx
│   │   │   │   └── DashboardTables.jsx
│   │   │   └── data
│   │   │       └── mockDashboardData.js
│   │   ├── inspection
│   │   │   ├── api
│   │   │   │   └── inspectionApi.js
│   │   │   ├── components
│   │   │   │   ├── CompletedInspectionManagement.jsx
│   │   │   │   ├── CompletedInspectionSummaryCards.jsx
│   │   │   │   ├── CompletedInspectionTable.jsx
│   │   │   │   ├── InspectionDetail.jsx
│   │   │   │   ├── InspectionManagement.jsx
│   │   │   │   ├── InspectionPagination.jsx
│   │   │   │   ├── InspectionRegister.jsx
│   │   │   │   ├── InspectionSearchForm.jsx
│   │   │   │   ├── InspectionSummaryCards.jsx
│   │   │   │   └── InspectionTable.jsx
│   │   │   ├── data
│   │   │   │   ├── mockInspectionData.js
│   │   │   │   └── mockInspectionDetailData.js
│   │   │   ├── hooks
│   │   │   │   ├── useCompletedInspectionManagement.js
│   │   │   │   ├── useInspectionDetail.js
│   │   │   │   ├── useInspectionManagement.js
│   │   │   │   └── useInspectionRegister.js
│   │   │   └── utils
│   │   │       └── inspectionManagementUtils.js
│   │   ├── mypage
│   │   │   └── components
│   │   │       └── MyPageManagement.jsx
│   │   ├── product
│   │   │   ├── api
│   │   │   │   └── productApi.js
│   │   │   ├── components
│   │   │   │   ├── ProductBasicForm.jsx
│   │   │   │   ├── ProductCreate.jsx
│   │   │   │   ├── ProductDetailModal.jsx
│   │   │   │   ├── ProductManagement.jsx
│   │   │   │   ├── ProductPagination.jsx
│   │   │   │   ├── ProductSearchForm.jsx
│   │   │   │   ├── ProductTable.jsx
│   │   │   │   └── ProductWarehouseSettingSection.jsx
│   │   │   ├── data
│   │   │   │   ├── mockProductData.js
│   │   │   │   └── productCreateOptions.js
│   │   │   ├── hooks
│   │   │   │   ├── useProductCreate.js
│   │   │   │   └── useProductManagement.js
│   │   │   └── utils
│   │   │       └── productManagementUtils.js
│   │   ├── purchase-order
│   │   │   ├── api
│   │   │   │   └── purchaseOrderApi.js
│   │   │   ├── components
│   │   │   │   ├── PurchaseOrderCancelModal.jsx
│   │   │   │   ├── PurchaseOrderCreate.jsx
│   │   │   │   ├── PurchaseOrderDetailModal.jsx
│   │   │   │   ├── PurchaseOrderEdit.jsx
│   │   │   │   ├── PurchaseOrderForm.jsx
│   │   │   │   ├── PurchaseOrderItemSelectModal.jsx
│   │   │   │   └── PurchaseOrderManagement.jsx
│   │   │   ├── data
│   │   │   │   └── mockPurchaseOrderData.js
│   │   │   ├── hooks
│   │   │   │   ├── usePurchaseOrderCreate.js
│   │   │   │   ├── usePurchaseOrderDetail.js
│   │   │   │   ├── usePurchaseOrderEdit.js
│   │   │   │   └── usePurchaseOrderManagement.js
│   │   │   └── utils
│   │   │       └── purchaseOrderUtils.js
│   │   ├── purchase-request
│   │   │   ├── api
│   │   │   │   └── purchaseRequestApi.js
│   │   │   ├── components
│   │   │   │   ├── PurchaseItemSelectModal.jsx
│   │   │   │   ├── PurchaseRequestBasicForm.jsx
│   │   │   │   ├── PurchaseRequestCreate.jsx
│   │   │   │   ├── PurchaseRequestDetail.jsx
│   │   │   │   ├── PurchaseRequestEdit.jsx
│   │   │   │   ├── PurchaseRequestItemSection.jsx
│   │   │   │   ├── PurchaseRequestManagement.jsx
│   │   │   │   ├── PurchaseRequestPagination.jsx
│   │   │   │   ├── PurchaseRequestSearchForm.jsx
│   │   │   │   ├── PurchaseRequestSummaryCards.jsx
│   │   │   │   └── PurchaseRequestTable.jsx
│   │   │   ├── config
│   │   │   │   └── purchaseRequestFormConfig.js
│   │   │   ├── data
│   │   │   │   ├── mockPurchaseRequestData.js
│   │   │   │   ├── mockPurchaseRequestDetailData.js
│   │   │   │   └── mockPurchaseRequestListData.js
│   │   │   ├── hooks
│   │   │   │   ├── usePurchaseRequestCreate.js
│   │   │   │   ├── usePurchaseRequestDetail.js
│   │   │   │   ├── usePurchaseRequestEdit.js
│   │   │   │   └── usePurchaseRequestManagement.js
│   │   │   └── utils
│   │   │       ├── purchaseRequestFormUtils.js
│   │   │       ├── purchaseRequestManagementUtils.js
│   │   │       └── purchaseRequestUtils.js
│   │   ├── receipt
│   │   │   ├── api
│   │   │   │   └── ReceiptApi.js
│   │   │   ├── components
│   │   │   │   ├── ReceiptCreate.jsx
│   │   │   │   ├── ReceiptDetail.jsx
│   │   │   │   ├── ReceiptForm.jsx
│   │   │   │   └── ReceiptManagement.jsx
│   │   │   ├── data
│   │   │   │   └── mockReceiptData.js
│   │   │   ├── hooks
│   │   │   │   ├── useReceiptCreate.js
│   │   │   │   ├── useReceiptDetail.js
│   │   │   │   └── useReceiptManagement.js
│   │   │   └── utils
│   │   │       └── ReceiptUtils.js
│   │   ├── stock
│   │   │   ├── api
│   │   │   │   └── stockApi.js
│   │   │   ├── components
│   │   │   │   ├── StockAdjustmentModal.jsx
│   │   │   │   ├── StockHistoryManagement.jsx
│   │   │   │   ├── StockPagination.jsx
│   │   │   │   ├── StockStatusManagement.jsx
│   │   │   │   └── StockSummaryCards.jsx
│   │   │   ├── data
│   │   │   │   └── mockStockData.js
│   │   │   ├── hooks
│   │   │   │   ├── useStockHistoryManagement.js
│   │   │   │   └── useStockStatusManagement.js
│   │   │   └── utils
│   │   │       └── stockManagementUtils.js
│   │   ├── supplier
│   │   │   ├── api
│   │   │   │   └── supplierApi.js
│   │   │   ├── components
│   │   │   │   ├── SupplierDetailModal.jsx
│   │   │   │   ├── SupplierForm.jsx
│   │   │   │   ├── SupplierManagement.jsx
│   │   │   │   ├── SupplierPagination.jsx
│   │   │   │   ├── SupplierSearchForm.jsx
│   │   │   │   └── SupplierTable.jsx
│   │   │   ├── data
│   │   │   │   └── mockSupplierData.js
│   │   │   ├── hooks
│   │   │   │   └── useSupplierManagement.js
│   │   │   └── utils
│   │   │       └── supplierManagementUtils.js
│   │   ├── system
│   │   │   ├── api
│   │   │   │   └── systemApi.js
│   │   │   ├── components
│   │   │   │   ├── RolePermissionPanel.jsx
│   │   │   │   ├── System.jsx
│   │   │   │   ├── SystemPagination.jsx
│   │   │   │   ├── UserFormModal.jsx
│   │   │   │   ├── UserSearchForm.jsx
│   │   │   │   └── UserTable.jsx
│   │   │   ├── data
│   │   │   │   └── mockSystemData.js
│   │   │   ├── hooks
│   │   │   │   └── useSystem.js
│   │   │   └── utils
│   │   │       ├── recommendRole.js
│   │   │       └── systemUtils.js
│   │   └── warehouse
│   │       ├── api
│   │       │   └── warehouseApi.js
│   │       ├── components
│   │       │   ├── WarehouseDetailModal.jsx
│   │       │   ├── WarehouseFormModal.jsx
│   │       │   ├── WarehouseManagement.jsx
│   │       │   ├── WarehousePagination.jsx
│   │       │   ├── WarehouseSearchForm.jsx
│   │       │   └── WarehouseTable.jsx
│   │       ├── data
│   │       │   └── mockWarehouseData.js
│   │       ├── hooks
│   │       │   └── useWarehouseManagement.js
│   │       └── utils
│   │           └── warehouseManagementUtils.js
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
├── AGENTS.md
├── CLAUDE.md
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

`.env.local`, `.git`, `node_modules`, `.next`는 로컬 환경에서 생성될 수 있지만 Repository 구조에는 포함하지 않는 것이 원칙입니다.

---

## 9. Frontend 주요 디렉터리 역할

| 경로                        | 역할                               |
| --------------------------- | ---------------------------------- |
| `src/app`                   | Next.js App Router 화면 및 Layout  |
| `src/app/(auth)`            | 인증 화면 Route Group              |
| `src/app/(dashboard)`       | 로그인 이후 업무 화면 Route Group  |
| `src/components/common`     | 여러 기능에서 사용하는 공통 UI     |
| `src/components/layout`     | Header, Sidebar 등 전체 Layout     |
| `src/constants`             | 공통 상태, 필터, 페이지네이션 상수 |
| `src/features`              | 업무 기능별 독립 모듈              |
| `src/features/*/api`        | 기능별 Backend API 요청            |
| `src/features/*/components` | 기능별 화면 및 UI 컴포넌트         |
| `src/features/*/hooks`      | 기능별 상태 및 비즈니스 로직       |
| `src/features/*/data`       | Mock 데이터 및 화면 옵션           |
| `src/features/*/utils`      | 기능별 변환 및 계산 함수           |
| `src/features/*/config`     | 기능별 설정값                      |
| `src/lib/api`               | 공통 API Client                    |
| `src/lib/env`               | 환경변수 및 Mock 활성화 처리       |
| `src/lib/file`              | Blob, CSV, 파일명 처리             |
| `src/utils`                 | 인증 저장소 및 권한 공통 함수      |
| `public/images`             | 정적 이미지                        |
| `.github/workflows`         | Frontend push 기반 배포 Trigger    |

---

## 10. Frontend 구조 설계 방식

Frontend는 기능별로 다음 구조를 사용합니다.

```text
src/features/<feature>
├── api
├── components
├── data
├── hooks
├── utils
└── config
```

모든 기능이 동일한 하위 폴더를 반드시 가지는 것은 아닙니다.

### Page

`src/app`의 `page.jsx`는 URL 진입점 역할을 담당합니다.

Page에서는 주로 Feature Component를 호출하고, Dynamic Route Parameter 또는 Search Parameter를 전달합니다.

### Component

화면 출력과 사용자 이벤트 연결을 담당합니다.

예:

```text
PurchaseRequestCreate.jsx
PurchaseRequestEdit.jsx
PurchaseRequestTable.jsx
PurchaseItemSelectModal.jsx
```

### Hook

조회, 등록, 수정, 삭제, 검색, 페이지네이션과 같은 상태 및 비즈니스 로직을 담당합니다.

예:

```text
usePurchaseRequestCreate.js
usePurchaseRequestEdit.js
usePurchaseRequestManagement.js
```

### API

Backend REST API와 통신합니다.

공통 요청은 다음 파일을 사용합니다.

```text
src/lib/api/fetchClient.js
```

### Data

Mock 데이터와 화면 초기 옵션을 관리합니다.

### Utils

금액 계산, 상태 변환, 검색 조건 생성, Payload 변환 등의 순수 함수를 관리합니다.

### Config

기능 내부에서 공통으로 사용하는 제한값 및 설정을 관리합니다.

구매 요청 기능에서는 다음 파일을 사용합니다.

```text
src/features/purchase-request/config/purchaseRequestFormConfig.js
```

---

## 11. 최근 추가 및 수정된 Frontend 파일

현재 Frontend의 최신 구조에서 구매 요청 로딩 오버레이와 관련하여 다음 파일이 수정되어 있습니다.

### 11.1 `src/app/(dashboard)/dashboard/loading.jsx`

Route Loading UI에서 `LoadingOverlay`에 `show` 값을 전달하도록 수정되었습니다.

```jsx
<LoadingOverlay show minDuration={1000} />
```

현재 Export 함수 이름은 `PurchaseRequestsLoading`으로 되어 있지만 파일 위치가 Dashboard이므로 다음 이름이 구조상 더 적절합니다.

```jsx
export default function DashboardLoading() {
  return <LoadingOverlay show minDuration={1000} />
}
```

함수 이름은 Next.js Route 동작에는 직접적인 영향을 주지 않지만 유지보수를 위해 이름을 맞추는 것을 권장합니다.

### 11.2 `src/features/purchase-request/components/PurchaseItemSelectModal.jsx`

다음 기능이 추가되었습니다.

- `isLoading` Prop 추가
- 품목 조회 중 안내 문구 표시
- 품목 조회 중 선택 완료 버튼 비활성화
- 품목 조회 중 버튼 문구 변경

```text
선택 완료
    ↓
불러오는 중...
```

### 11.3 `src/features/purchase-request/components/PurchaseRequestCreate.jsx`

다음 세 가지 상태를 통합하여 로딩 오버레이를 표시합니다.

```js
const showLoadingOverlay = isInitializing || isProductLoading || isSubmitting
```

로딩 대상은 다음과 같습니다.

- 인증 사용자 초기화
- 품목 목록 조회
- 구매 요청 등록 제출

### 11.4 `src/features/purchase-request/components/PurchaseRequestEdit.jsx`

다음 상태를 통합하여 로딩 오버레이를 표시합니다.

```js
const showLoadingOverlay = loading || isProductLoading || isSubmitting
```

로딩 대상은 다음과 같습니다.

- 구매 요청 수정 데이터 조회
- 품목 목록 조회
- 구매 요청 수정 제출

### 11.5 `src/features/purchase-request/hooks/usePurchaseRequestCreate.js`

다음 구조가 추가 또는 수정되었습니다.

- `isInitializing` 상태 추가
- 인증 Context 준비 여부와 초기 화면 로딩 연결
- 화면 진입 시 전체 품목을 즉시 조회하던 방식 제거
- 품목 선택 Modal을 열 때 최초 한 번 품목 조회
- `productLoadingRef`를 이용한 중복 요청 방지
- API 응답의 `items`, `content`, 배열 형식을 모두 처리
- 품목 조회 실패 메시지 처리

품목 데이터는 구매 요청 등록 화면 진입 시 즉시 조회하지 않고, 사용자가 품목 선택 Modal을 열 때 조회합니다.

### 11.6 `src/features/purchase-request/hooks/usePurchaseRequestEdit.js`

`isProductLoading` 상태 선언 위치가 구매 요청 수정 화면의 다른 Loading State와 함께 정리되었습니다.

---

## 12. Frontend 공통화 파일

## 12.1 `src/constants/pagination.js`

다음 값을 공통 관리합니다.

```text
DEFAULT_PAGE_SIZE = 15
APPROVAL_DEFAULT_PAGE_SIZE = 10
MAX_SELECT_OPTION_SIZE = 20000
```

다음 공통 함수도 포함합니다.

```text
createPageNumbers()
```

## 12.2 `src/constants/productStatus.js`

품목 사용 여부를 관리합니다.

```text
사용
미사용
전체
```

Backend의 `Y`, `N` 값과 Frontend Label을 상호 변환합니다.

## 12.3 `src/constants/purchaseRequestStatus.js`

구매 요청 상태 및 우선순위를 공통 관리합니다.

### 상태

```text
PENDING_APPROVAL → 승인 대기
APPROVED         → 승인 완료
REJECTED         → 반려
ORDERED          → 발주 완료
CANCELED         → 요청 취소
```

다음과 같이 띄어쓰기 없는 이전 Label도 Alias로 처리합니다.

```text
승인대기
승인완료
발주완료
요청취소
```

### 우선순위

```text
NORMAL → 일반
URGENT → 긴급
```

## 12.4 `src/lib/api/fetchClient.js`

다음 공통 기능을 담당합니다.

- API Base URL 생성
- JWT Authorization Header 자동 설정
- JSON Body Content-Type 설정
- FormData 전송 처리
- 응답 JSON Parsing
- 공통 오류 메시지 처리
- `ApiError` 생성
- HTTP 401 발생 시 인증 정보 제거
- HTTP 401 발생 시 `/login` 이동

Frontend API 경로에 `/api`가 포함되어 있으므로 Base URL에는 일반적으로 `/api`를 붙이지 않습니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 12.5 `src/lib/env/isMockEnabled.js`

개발 환경에서만 Mock을 활성화하기 위한 Helper입니다.

```js
export function isMockEnabled(envValue) {
  return process.env.NODE_ENV !== "production" && envValue === "true"
}
```

이 Helper에는 환경변수 이름 문자열이 아니라 실제 환경변수 값을 전달해야 합니다.

올바른 예:

```js
isMockEnabled(process.env.NEXT_PUBLIC_USE_PRODUCT_MOCK)
```

## 12.6 `src/lib/file/downloadFile.js`

다음 파일 처리 함수를 제공합니다.

```text
getFileNameFromDisposition()
downloadBlob()
downloadCsvFile()
```

- Content-Disposition Header에서 파일명 추출
- Blob 객체 다운로드
- CSV 생성 및 UTF-8 BOM 적용
- CSV 내부 큰따옴표 Escape 처리

## 12.7 `src/features/purchase-request/config/purchaseRequestFormConfig.js`

다음 구매 요청 Form 설정을 관리합니다.

```text
첨부파일 최대 크기: 10MB
품목 기본 비고: 빈 문자열
전체 카테고리 Label
수정 불가능한 기본 필드
```

수정 불가능한 기본 필드는 다음과 같습니다.

```text
requestNumber
requester
department
requestDate
```

---

## 13. Backend 디렉터리 구조

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
│   │       │   ├── auth-verification-oracle.sql
│   │       │   ├── department-permissions-oracle.sql
│   │       │   ├── rbac-link-repair-oracle.sql
│   │       │   ├── rbac-seed-oracle.sql
│   │       │   ├── supplier-seed-oracle.sql
│   │       │   ├── team-manager-rbac-oracle.sql
│   │       │   └── user-profile-migration-oracle.sql
│   │       ├── application-local.properties
│   │       ├── application-prod.properties
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── buyflow
│                   └── erp
│                       └── BuyflowErpApplicationTests.java
├── Dockerfile
├── build.gradle
├── gradlew
├── gradlew.bat
└── settings.gradle
```

---

## 14. Backend 주요 Package 역할

| Package      | 역할                                          |
| ------------ | --------------------------------------------- |
| `Common`     | 공통 응답, 예외, 오류 코드, 상태 및 권한 상수 |
| `Config`     | Security, Swagger, Web 및 CORS 설정           |
| `Controller` | REST API Endpoint                             |
| `Dto`        | API 요청 및 응답 객체                         |
| `Entity`     | Oracle Table과 JPA Entity 매핑                |
| `Exception`  | 기능별 예외                                   |
| `Repository` | Spring Data JPA Repository                    |
| `Security`   | JWT Token 생성 및 인증 Filter                 |
| `Service`    | 업무 로직                                     |
| `Util`       | 공통 Utility                                  |

---

## 15. Backend 주요 Controller

현재 Backend에는 다음 Controller가 존재합니다.

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

Backend의 공통 Context Path는 다음과 같습니다.

```properties
server.servlet.context-path=/api
```

따라서 실제 API URL은 다음 형태입니다.

```text
http://localhost:8080/api/auth/login
http://localhost:8080/api/products
http://localhost:8080/api/purchase-requests
http://localhost:8080/api/approvals
```

---

## 16. 최근 추가 및 수정된 Backend 파일

Backend의 최근 Refactoring에서 다음 공통 상수 클래스가 추가되었습니다.

### 16.1 추가된 파일

```text
src/main/java/com/buyflow/erp/Common/FilterCodes.java
src/main/java/com/buyflow/erp/Common/PermissionCodes.java
src/main/java/com/buyflow/erp/Common/PurchaseRequestStatusCodes.java
src/main/java/com/buyflow/erp/Common/RoleCodes.java
```

### `FilterCodes.java`

검색 필터의 전체 값을 공통 관리합니다.

```java
public static final String ALL = "전체";
```

### `PermissionCodes.java`

승인 관련 권한 코드를 공통 관리합니다.

```text
approvals.read
approvals.process
```

### `PurchaseRequestStatusCodes.java`

구매 요청 상태 코드를 공통 관리합니다.

```text
DRAFT
PENDING_APPROVAL
APPROVED
REJECTED
ORDERED
CANCELED
CANCEL_REQUESTED
```

### `RoleCodes.java`

승인 및 관리자 관련 역할 코드를 공통 관리합니다.

```text
ADMIN
MANAGER
APPROVER
TEAM_MANAGER
```

### 16.2 수정된 파일

```text
src/main/java/com/buyflow/erp/Service/ApprovalServiceImpl.java
src/main/java/com/buyflow/erp/Service/DashboardServiceImpl.java
```

위 Service에서는 문자열로 직접 사용되던 상태, 역할, 권한, 필터 값을 `Common` 상수로 교체하는 Refactoring이 반영되어 있습니다.

---

## 17. Database 구조

업로드된 Oracle SQL 파일에는 총 28개의 `CREATE TABLE` 구문이 포함되어 있습니다.

이 중 업무 및 인증에 사용되는 핵심 Table은 25개이며, 나머지 3개는 SQL Developer 실행 이력 또는 Backup Table입니다.

## 17.1 핵심 업무 Table

| Table                            | 역할                       |
| -------------------------------- | -------------------------- |
| `USERS`                          | 사용자 정보                |
| `ROLES`                          | 역할 정보                  |
| `PERMISSIONS`                    | 권한 정보                  |
| `USER_ROLES`                     | 사용자와 역할 연결         |
| `ROLE_PERMISSIONS`               | 역할과 권한 연결           |
| `DEPARTMENT_PERMISSIONS`         | 부서별 권한                |
| `DEPARTMENT_ROLE_ASSIGN_RULES`   | 부서별 역할 자동 부여 규칙 |
| `USER_DEPARTMENT_AUTHORIZATIONS` | 사용자별 부서 접근 권한    |
| `EMAIL_VERIFICATION_CODES`       | 이메일 인증 코드           |
| `PASSWORD_RESET_TOKENS`          | 비밀번호 재설정 Token      |
| `PRODUCTS`                       | 품목 기준정보              |
| `SUPPLIER`                       | 공급업체 기준정보          |
| `WAREHOUSE`                      | 창고 기준정보              |
| `PURCHASE_REQUESTS`              | 구매 요청 Header           |
| `PURCHASE_REQUEST_ITEM`          | 구매 요청 품목             |
| `APPROVAL_HISTORY`               | 승인 및 반려 이력          |
| `PURCHASE_ORDER`                 | 발주 Header                |
| `PURCHASE_ORDER_ITEM`            | 발주 품목                  |
| `RECEIPT`                        | 입고 Header                |
| `RECEIPT_ITEM`                   | 입고 품목                  |
| `INSPECTION`                     | 검수 정보                  |
| `STOCK`                          | 현재 재고                  |
| `STOCK_HISTORY`                  | 재고 변동 이력             |
| `ATTACHMENT`                     | 첨부파일 Metadata          |
| `EXCEL_EXPORT_HISTORY`           | 엑셀 다운로드 이력         |

## 17.2 보조 및 Backup Table

| Table                       | 설명                           |
| --------------------------- | ------------------------------ |
| `DBTOOLS$EXECUTION_HISTORY` | Oracle SQL Developer 실행 이력 |
| `RECEIPT_BACKUP`            | 입고 Backup                    |
| `USERS_BACKUP_20260618`     | 사용자 Backup                  |

Backup Table은 운영 Entity 및 Repository의 핵심 업무 Table과 구분하여 관리해야 합니다.

## 17.3 Sequence

SQL 파일에는 총 26개의 Sequence 생성 구문이 포함되어 있습니다.

대표 Sequence는 다음과 같습니다.

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

## 17.4 핵심 데이터 흐름

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

---

## 18. 로컬 실행 환경

## 18.1 필수 설치 항목

### Frontend

```text
Node.js 22 권장
npm
```

### Backend

```text
Java 17
Oracle Wallet
Oracle Database 접속 정보
```

---

## 19. Frontend 로컬 실행 방법

### 19.1 Repository Clone

```bash
git clone https://github.com/BuyFlow-ERP/frontend-buyflow.git
cd frontend-buyflow
```

### 19.2 Package 설치

`package-lock.json` 기준으로 동일한 의존성을 설치하려면 다음 명령어를 권장합니다.

```bash
npm ci
```

일반 설치는 다음 명령어를 사용할 수 있습니다.

```bash
npm install
```

### 19.3 환경변수 파일 생성

프로젝트 Root에 `.env.local`을 생성합니다.

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

### 19.4 개발 서버 실행

```bash
npm run dev
```

접속 주소:

```text
http://localhost:3000
```

### 19.5 Lint 실행

```bash
npm run lint
```

### 19.6 Production Build

```bash
npm run build
```

### 19.7 Production Server 실행

```bash
npm run start
```

---

## 20. Backend 로컬 실행 방법

## 20.1 Repository Clone

```bash
git clone https://github.com/BuyFlow-ERP/backend-buyflow.git
cd backend-buyflow
```

## 20.2 Local Profile

Backend의 기본 Profile은 `local`입니다.

```properties
spring.profiles.default=local
```

Local 환경에서는 다음 환경변수를 사용합니다.

```text
LOCAL_DB_URL
LOCAL_DB_USERNAME
LOCAL_DB_PASSWORD
LOCAL_JWT_SECRET
```

예시:

```env
LOCAL_DB_URL=jdbc:oracle:thin:@<SERVICE_NAME>?TNS_ADMIN=C:/oracle/Wallet_Ventureworld/
LOCAL_DB_USERNAME=<DB_USERNAME>
LOCAL_DB_PASSWORD=<DB_PASSWORD>
LOCAL_JWT_SECRET=<LOCAL_JWT_SECRET>
```

`.env` 파일은 Spring Boot에서 기본적으로 자동 로드되지 않습니다.

환경변수는 다음 방법 중 하나로 설정해야 합니다.

- 운영체제 환경변수
- IntelliJ Run Configuration
- VS Code Launch Configuration
- 명령 실행 전 Shell 환경변수
- 별도 환경변수 로더

## 20.3 Windows 실행

```powershell
gradlew.bat clean bootRun
```

## 20.4 macOS 또는 Linux 실행

```bash
chmod +x gradlew
./gradlew clean bootRun
```

## 20.5 Backend 주소

```text
http://localhost:8080
```

API Base URL:

```text
http://localhost:8080/api
```

---

## 21. Frontend 환경변수

| 환경변수                                | 역할                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`              | Browser에서 사용하는 Backend 주소                                                         |
| `API_INTERNAL_BASE_URL`                 | Container 내부 Backend 주소로 정의되어 있으나 현재 Frontend Source에서 직접 사용하지 않음 |
| `NEXT_PUBLIC_USE_DASHBOARD_MOCK`        | Dashboard Mock 사용 여부                                                                  |
| `NEXT_PUBLIC_USE_PRODUCT_MOCK`          | Product Mock 사용 여부                                                                    |
| `NEXT_PUBLIC_USE_PURCHASE_REQUEST_MOCK` | Purchase Request Mock 사용 여부                                                           |
| `NEXT_PUBLIC_USE_APPROVAL_MOCK`         | Approval Mock 사용 여부                                                                   |
| `NEXT_PUBLIC_USE_SUPPLIER_MOCK`         | Supplier Mock 사용 여부                                                                   |
| `NEXT_PUBLIC_USE_WAREHOUSE_MOCK`        | Warehouse Mock 사용 여부                                                                  |
| `NEXT_PUBLIC_USE_PURCHASE_ORDER_MOCK`   | Purchase Order Mock 사용 여부                                                             |
| `NEXT_PUBLIC_USE_RECEIPT_MOCK`          | Receipt Mock 사용 여부                                                                    |
| `NEXT_PUBLIC_USE_INSPECTION_MOCK`       | Inspection Mock 사용 여부                                                                 |
| `NEXT_PUBLIC_USE_STOCK_MOCK`            | Stock Mock 사용 여부                                                                      |
| `NEXT_PUBLIC_USE_SYSTEM_MOCK`           | System Mock Write 사용 여부                                                               |

운영 환경의 API Base URL은 다음 값을 사용합니다.

```text
https://buyflow-system.168-110-117-4.nip.io
```

각 API 함수에서 `/api` 경로를 추가하므로 다음과 같이 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=https://buyflow-system.168-110-117-4.nip.io
```

다음과 같이 `/api`를 중복하여 설정하지 않도록 주의합니다.

```env
# 잘못된 예시
NEXT_PUBLIC_API_BASE_URL=https://buyflow-system.168-110-117-4.nip.io/api
```

---

## 22. Backend 환경변수

## 22.1 Local Profile

| 환경변수            | 역할                  |
| ------------------- | --------------------- |
| `LOCAL_DB_URL`      | Local Oracle JDBC URL |
| `LOCAL_DB_USERNAME` | Local DB 사용자       |
| `LOCAL_DB_PASSWORD` | Local DB 비밀번호     |
| `LOCAL_JWT_SECRET`  | Local JWT Secret      |

## 22.2 Production Profile

| 환경변수                          | 역할                       |
| --------------------------------- | -------------------------- |
| `DB_URL`                          | 운영 Oracle JDBC URL       |
| `DB_USERNAME`                     | 운영 DB 사용자             |
| `DB_PASSWORD`                     | 운영 DB 비밀번호           |
| `JWT_SECRET`                      | 운영 JWT Secret            |
| `UPLOAD_DIR`                      | 첨부파일 저장 경로         |
| `DB_POOL_SIZE`                    | HikariCP 최대 Pool 크기    |
| `JPA_DDL_AUTO`                    | Hibernate Schema 처리 방식 |
| `JPA_SHOW_SQL`                    | SQL 출력 여부              |
| `JPA_FORMAT_SQL`                  | SQL Formatting 여부        |
| `CORS_ALLOWED_ORIGIN`             | 허용 Frontend Origin       |
| `JWT_EXPIRATION_MINUTES`          | JWT 만료 시간              |
| `REQUEST_MAPPING_LOG_LEVEL`       | Request Mapping Log Level  |
| `SERVER_FORWARD_HEADERS_STRATEGY` | Proxy Forward Header 처리  |

Production Profile은 다음 환경변수를 요구합니다.

```env
DB_URL=<ORACLE_JDBC_URL>
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
JWT_SECRET=<JWT_SECRET>
```

---

## 23. Docker 구조

## 23.1 Frontend Dockerfile

Frontend는 Multi-stage Build를 사용합니다.

```text
deps
  ↓
npm ci
  ↓
builder
  ↓
npm run build
  ↓
runner
  ↓
node server.js
```

주요 설정:

```text
Base Image: node:22-alpine
Build Output: standalone
Port: 3000
NODE_ENV: production
HOSTNAME: 0.0.0.0
```

Next.js 설정:

```js
const nextConfig = {
  output: "standalone",
}
```

## 23.2 Backend Dockerfile

Backend도 Multi-stage Build를 사용합니다.

```text
eclipse-temurin:17-jdk
        ↓
./gradlew clean bootJar -x test
        ↓
eclipse-temurin:17-jre
        ↓
java -jar app.jar
```

주요 설정:

```text
SPRING_PROFILES_ACTIVE=prod
TZ=Asia/Seoul
Port=8080
```

---

## 24. CI/CD 배포 구조

최종 배포 흐름은 다음과 같습니다.

```text
frontend-buyflow/master push
또는
backend-buyflow/main push
        ↓
각 Repository의 trigger-deploy.yml 실행
        ↓
GitHub API를 통해 buyflow-deploy/deploy.yml 호출
        ↓
buyflow-deploy Repository Checkout
        ↓
frontend-buyflow/master Checkout
        ↓
backend-buyflow/main Checkout
        ↓
OCI CLI 설치 및 인증
        ↓
Docker Buildx 설정
        ↓
GHCR 로그인
        ↓
Frontend Docker Image Build 및 Push
        ↓
Backend Docker Image Build 및 Push
        ↓
OKE Kubeconfig 생성
        ↓
Kubernetes Secret 생성 또는 갱신
        ↓
Oracle Wallet Secret 생성 또는 갱신
        ↓
GHCR imagePullSecret 생성 또는 갱신
        ↓
ConfigMap 및 Service 적용
        ↓
Deployment Image Tag 변경
        ↓
Deployment 적용
        ↓
Ingress 적용
        ↓
Rollout 확인
        ↓
실제 배포 Image 확인
        ↓
비정상 Pod 확인
```

## 24.1 Docker Image Tag

배포 Workflow는 실행 시간을 기준으로 Tag를 생성합니다.

```text
YYYYMMDDHHMMSS
```

예시:

```text
ghcr.io/<owner>/buyflow-frontend:20260713135721
ghcr.io/<owner>/buyflow-backend:20260713135721
```

## 24.2 Build Platform

현재 배포 Workflow는 다음 Platform을 사용합니다.

```text
linux/amd64
```

```bash
docker buildx build --platform linux/amd64
```

## 24.3 Workflow 파일

| Repository | 파일                                   | 실행 조건           |
| ---------- | -------------------------------------- | ------------------- |
| Frontend   | `.github/workflows/trigger-deploy.yml` | `master` push       |
| Backend    | `.github/workflows/trigger-deploy.yml` | `main` push         |
| Deployment | `.github/workflows/deploy.yml`         | `workflow_dispatch` |

---

## 25. Deployment Repository 구조

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

최근 배포 Repository에서는 운영 Secret 및 Oracle Wallet 자료가 포함될 가능성이 있는 `backup-oke` 폴더가 제거되었습니다.

다음 파일이 보안 관리 목적으로 추가되어 있습니다.

```text
.gitignore
SECURITY-NOTES.md
```

Kubernetes Secret의 Base64 값은 암호화가 아니므로 Git에 Commit해서는 안 됩니다.

---

## 26. Kubernetes 배포 구성

## 26.1 Namespace

```text
buyflow
```

## 26.2 Frontend Deployment

| 항목              | 값                         |
| ----------------- | -------------------------- |
| Deployment        | `buyflow-frontend`         |
| Replicas          | `2`                        |
| Container Port    | `3000`                     |
| Image Pull Policy | `Always`                   |
| Service           | `buyflow-frontend-service` |
| Service Type      | `ClusterIP`                |
| Request CPU       | `100m`                     |
| Request Memory    | `256Mi`                    |
| Limit CPU         | `500m`                     |
| Limit Memory      | `512Mi`                    |

Frontend에는 다음 Probe가 구성되어 있습니다.

```text
Readiness Probe
Liveness Probe
```

Probe 경로:

```text
/
```

## 26.3 Backend Deployment

| 항목              | 값                        |
| ----------------- | ------------------------- |
| Deployment        | `buyflow-backend`         |
| Replicas          | `1`                       |
| Container Port    | `8080`                    |
| Image Pull Policy | `Always`                  |
| Service           | `buyflow-backend-service` |
| Service Type      | `ClusterIP`               |
| Request CPU       | `250m`                    |
| Request Memory    | `512Mi`                   |
| Limit CPU         | `1000m`                   |
| Limit Memory      | `1Gi`                     |

Oracle Wallet Secret은 다음 경로에 Mount됩니다.

```text
/app/wallet
```

## 26.4 ConfigMap

ConfigMap 이름:

```text
buyflow-config
```

주요 설정:

```text
SPRING_PROFILES_ACTIVE=prod
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
JPA_FORMAT_SQL=false
DB_POOL_SIZE=5
UPLOAD_DIR=/app/uploads
JWT_EXPIRATION_MINUTES=120
TZ=Asia/Seoul
SERVER_FORWARD_HEADERS_STRATEGY=framework
```

## 26.5 Ingress

Ingress 이름:

```text
buyflow-ingress
```

Routing:

```text
/api → buyflow-backend-service:8080
/    → buyflow-frontend-service:3000
```

TLS Secret:

```text
buyflow-tls
```

ClusterIssuer:

```text
letsencrypt-prod
```

---

## 27. GitHub Actions Secrets

## 27.1 `buyflow-deploy` Repository

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

## 27.2 Frontend 및 Backend Repository

```text
DEPLOY_PAT
```

`DEPLOY_PAT`는 Frontend 또는 Backend Repository에서 `buyflow-deploy` Repository의 `deploy.yml` Workflow를 호출할 때 사용합니다.

## 27.3 Secret 관리 원칙

다음 정보는 Source Code와 Git Repository에 직접 저장하지 않습니다.

```text
DB 비밀번호
JWT Secret
OCI Private Key
Oracle Wallet
GHCR Personal Access Token
Kubernetes Secret Manifest
.env.local
```

---

## 28. 배포 결과 확인 명령어

## 28.1 Pod 확인

```bash
kubectl get pods -n buyflow
```

## 28.2 Service 확인

```bash
kubectl get svc -n buyflow
```

## 28.3 Ingress 확인

```bash
kubectl get ingress -n buyflow
```

## 28.4 Deployment 확인

```bash
kubectl get deployment -n buyflow
```

## 28.5 Frontend Rollout 확인

```bash
kubectl rollout status deployment/buyflow-frontend -n buyflow
```

## 28.6 Backend Rollout 확인

```bash
kubectl rollout status deployment/buyflow-backend -n buyflow
```

## 28.7 Frontend 배포 Image 확인

```bash
kubectl get deployment buyflow-frontend \
  -n buyflow \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

## 28.8 Backend 배포 Image 확인

```bash
kubectl get deployment buyflow-backend \
  -n buyflow \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

## 28.9 Application Log 확인

Frontend:

```bash
kubectl logs deployment/buyflow-frontend -n buyflow
```

Backend:

```bash
kubectl logs deployment/buyflow-backend -n buyflow
```

---

## 29. 현재 Source 기준 주의사항

## 29.1 `isMockEnabled` 전달값 불일치

현재 Helper는 환경변수 값을 받도록 구현되어 있습니다.

```js
export function isMockEnabled(envValue) {
  return process.env.NODE_ENV !== "production" && envValue === "true"
}
```

하지만 일부 API는 환경변수 값이 아니라 환경변수 이름 문자열을 전달합니다.

현재 형태:

```js
isMockEnabled("NEXT_PUBLIC_USE_PRODUCT_MOCK")
```

권장 형태:

```js
isMockEnabled(process.env.NEXT_PUBLIC_USE_PRODUCT_MOCK)
```

확인 대상:

```text
src/features/dashboard/api/dashboardApi.js
src/features/product/api/productApi.js
src/features/purchase-request/api/purchaseRequestApi.js
src/features/approval/api/approvalApi.js
```

## 29.2 Mock 기본값 처리 방식 불일치

일부 API는 다음 방식을 사용합니다.

```js
process.env.NEXT_PUBLIC_USE_RECEIPT_MOCK !== "false"
```

이 방식은 환경변수가 설정되지 않은 경우에도 Mock이 활성화됩니다.

확인 대상:

```text
src/features/receipt/api/ReceiptApi.js
src/features/stock/api/stockApi.js
src/features/supplier/api/supplierApi.js
src/features/warehouse/api/warehouseApi.js
src/features/system/api/systemApi.js
```

운영 안정성을 위해 다음 방식으로 통일하는 것을 권장합니다.

```js
process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_RECEIPT_MOCK === "true"
```

## 29.3 System Mock Docker Build Argument 누락

Frontend Source에서는 다음 환경변수를 사용합니다.

```text
NEXT_PUBLIC_USE_SYSTEM_MOCK
```

하지만 현재 Frontend Dockerfile과 `buyflow-deploy/.github/workflows/deploy.yml`에는 해당 Build Argument가 포함되어 있지 않습니다.

Frontend Dockerfile에 다음 항목을 추가하는 것을 권장합니다.

```dockerfile
ARG NEXT_PUBLIC_USE_SYSTEM_MOCK=false
ENV NEXT_PUBLIC_USE_SYSTEM_MOCK=$NEXT_PUBLIC_USE_SYSTEM_MOCK
```

배포 Workflow에도 다음 항목을 추가해야 합니다.

```bash
--build-arg NEXT_PUBLIC_USE_SYSTEM_MOCK=false
```

## 29.4 `API_INTERNAL_BASE_URL`

다음 값은 Dockerfile과 배포 Workflow에 정의되어 있습니다.

```text
API_INTERNAL_BASE_URL
```

하지만 현재 Frontend Source에서는 직접 사용하지 않습니다.

현재 모든 Browser API 요청은 `NEXT_PUBLIC_API_BASE_URL`을 사용합니다.

## 29.5 `env.example` 내부 주소 오타

현재 `env.example`의 내부 Backend 주소에는 잘못된 문자열이 포함되어 있습니다.

올바른 주소는 다음과 같습니다.

```env
API_INTERNAL_BASE_URL=http://buyflow-backend-service.buyflow.svc.cluster.local:8080
```

## 29.6 Dashboard Loading Component 이름

다음 파일의 Export 함수 이름이 경로와 일치하지 않습니다.

```text
src/app/(dashboard)/dashboard/loading.jsx
```

현재 이름:

```text
PurchaseRequestsLoading
```

권장 이름:

```text
DashboardLoading
```

## 29.7 입고 파일명 대소문자

입고 기능의 일부 파일은 대문자로 시작합니다.

```text
src/features/receipt/api/ReceiptApi.js
src/features/receipt/utils/ReceiptUtils.js
```

Linux 환경은 파일명 대소문자를 구분하므로 Import 경로도 실제 파일명과 정확히 일치해야 합니다.

장기적으로는 다른 기능과 동일하게 다음 형태로 통일하는 것을 권장합니다.

```text
receiptApi.js
receiptUtils.js
```

## 29.8 Backend Entity 중복 가능성

현재 Backend Entity에는 다음 두 파일이 함께 존재합니다.

```text
Entity/User.java
Entity/Users.java
```

실제 사용 Entity와 이전 Entity가 중복되어 있는지 확인하고, 사용하지 않는 파일은 제거하는 것이 좋습니다.

## 29.9 Example 파일 정리

현재 Backend에는 다음 Example 파일이 남아 있습니다.

```text
Dto/ExampleDto.java
Entity/ExampleEntity.java
Repository/ExampleRepository.java
Util/UtilExample.java
```

운영 기능에서 사용하지 않는 파일이라면 제거하는 것을 권장합니다.

## 29.10 첨부파일 영속 저장소

현재 Backend Deployment의 첨부파일 경로는 다음과 같습니다.

```text
/app/uploads
```

하지만 현재 Kubernetes manifest에는 PersistentVolume 또는 PersistentVolumeClaim이 연결되어 있지 않습니다.

Pod가 재생성되면 Container 내부 첨부파일이 사라질 수 있으므로 운영 환경에서는 다음 중 하나를 사용해야 합니다.

```text
PersistentVolume
OCI Object Storage
외부 File Storage
```

## 29.11 빈 배포 Script

현재 다음 파일은 존재하지만 내용이 없습니다.

```text
buyflow-deploy/scripts/deploy.sh
buyflow-deploy/scripts/delete.sh
```

사용하지 않을 경우 제거하거나, 수동 배포 및 삭제 절차를 구현해야 합니다.

## 29.12 ZIP 공유 시 제외 대상

현재 개발용 ZIP에는 다음 파일 또는 폴더가 포함될 수 있습니다.

```text
.git
.env.local
node_modules
.next
build
.gradle
```

공유 및 제출용 ZIP에서는 위 항목을 제외하는 것이 좋습니다.

특히 `.env.local`과 Kubernetes Secret Backup은 외부에 공유하지 않습니다.

## 29.13 ZIP 한글 폴더명 Encoding

Windows에서 생성한 ZIP을 Linux에서 해제할 경우 한글 폴더명이 다음과 같이 깨질 수 있습니다.

```text
frontend-buyflow - #Ubcf5#Uc0ac#Ubcf8
```

Build 또는 Script 경로 문제를 방지하기 위해 압축 해제 후 최상위 폴더명을 다음과 같이 변경하는 것을 권장합니다.

```text
frontend-buyflow
```

---

## 30. Git 작업 기준

개인 Branch에서 작업한 후 운영 Branch에 반영하는 기본 흐름입니다.

### Frontend

```bash
git checkout hohyeon
git add .
git commit -m "fix: purchase request loading overlay"
git push origin hohyeon

git checkout master
git pull origin master
git merge hohyeon
git push origin master
```

### Backend

```bash
git checkout hohyeon
git add .
git commit -m "refactor: centralize request status and permission codes"
git push origin hohyeon

git checkout main
git pull origin main
git merge hohyeon
git push origin main
```

Merge 전에는 운영 Branch의 최신 내용을 개인 Branch에 먼저 반영하는 것을 권장합니다.

```bash
git checkout hohyeon
git merge master
```

또는 Backend에서는 다음과 같이 사용합니다.

```bash
git checkout hohyeon
git merge main
```

---

## 31. 팀 정보

## 31.1 김호현

- 역할: 팀장
- 담당 영역:
  - 대시보드
  - 품목 관리
  - 구매 요청
  - 승인 관리
  - DevOps

- 구현 내용:
  - 대시보드 화면 및 데이터 연동
  - 품목 관리 기능
  - 구매 요청 등록, 목록, 상세, 수정 및 삭제
  - 승인 및 반려 처리
  - 구매 요청 상태 관리
  - 공통 상태 및 페이지네이션 Refactoring
  - Docker 및 Kubernetes 구성
  - OKE 배포
  - GHCR Image 관리
  - GitHub Actions CI/CD 구성

## 31.2 하지수

- 역할: 팀원
- 담당 영역:
  - 창고
  - 발주
  - 검수
  - 첨부파일
  - 엑셀 다운로드

- 구현 내용:
  - 발주 등록, 목록 및 상세 기능
  - 발주 상태 변경
  - 검수 등록 및 결과 처리
  - 창고 관리
  - 첨부파일 처리
  - 엑셀 다운로드

## 31.3 배승훈

- 역할: 팀원
- 담당 영역:
  - 회원
  - 권한
  - 공통 기능
  - 공급업체 관리

- 구현 내용:
  - 공급업체 관리
  - 로그인 및 회원가입
  - 직원 등록
  - 사용자 권한 관리
  - 관리자, 요청자, 구매담당자 역할 구분
  - 공통 Layout
  - 권한 기반 메뉴 접근 제어

## 31.4 김연준

- 역할: 팀원
- 담당 영역:
  - 입고
  - 재고

- 구현 내용:
  - 입고 처리
  - 입고 처리에 따른 재고 증가
  - 재고 현황 조회
  - 재고 이력 조회
  - 재고 조정

---

## 32. 구현 및 배포 구성 현황

Repository 구조 기준으로 다음 항목이 구성되어 있습니다.

```text
Frontend 화면 구현
Backend REST API 구현
Oracle Database Schema
Oracle Wallet 연결 설정
JWT 인증 및 권한 처리
Docker Multi-stage Build
GHCR Image Push
Kubernetes Manifest
OKE 배포 Workflow
NGINX Ingress
TLS 인증서 발급 설정
GitHub Actions 자동 배포
```

실제 운영 상태는 다음 명령어와 GitHub Actions 실행 결과를 통해 별도로 확인해야 합니다.

```bash
kubectl get pods -n buyflow
kubectl get ingress -n buyflow
kubectl rollout status deployment/buyflow-frontend -n buyflow
kubectl rollout status deployment/buyflow-backend -n buyflow
```

---

## 33. 향후 개선 사항

- Mock 활성화 로직 공통화
- `NEXT_PUBLIC_USE_SYSTEM_MOCK` Docker Build Argument 추가
- `API_INTERNAL_BASE_URL` 사용 여부 정리
- 기능별 파일명 대소문자 규칙 통일
- 사용하지 않는 Example 파일 제거
- 중복 가능성이 있는 User Entity 정리
- Backend Service 클래스 기능 단위 분리
- API 응답 Format 표준화
- Frontend Error Boundary 적용
- Route별 `loading.jsx` 적용 범위 확대
- Unit Test 및 Integration Test 보강
- Backend Health Probe 추가
- 첨부파일 PersistentVolume 또는 Object Storage 적용
- Docker Build Cache 적용
- GitHub Actions 배포 실패 알림 구성
- Kubernetes Secret을 OCI Vault 또는 External Secrets로 전환
- 운영 Log 수집 및 Monitoring 구성
- Prometheus 및 Grafana 적용
- 배포 Image Tag와 Release Note 연결
- E2E Test 자동화

---

## 34. 보안 주의사항

다음 파일과 값은 Git에 Commit하지 않습니다.

```text
.env
.env.local
*.pem
Oracle Wallet
Kubernetes Secret
OCI Private Key
DB Password
JWT Secret
GHCR PAT
```

Kubernetes Secret은 Base64 Encoding만 적용되며 암호화된 값이 아닙니다.

Secret 자료가 과거 Git History에 포함된 적이 있다면 파일 삭제만으로 충분하지 않으며 다음 정보를 교체해야 합니다.

```text
DB 계정 비밀번호
JWT Secret
Oracle Wallet
GHCR Token
OCI API Key
```

---

## 35. License

본 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다.
