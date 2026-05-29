# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 語言偏好

請使用**繁體中文**回應。

## 專案簡介

這是一個貼紙電商（StickerStore）全端專案，React 前端 + Spring Boot 後端。

## 技術棧

### 前端 (frontend/)
- React 18 + Vite
- React Router v6（Data API：loader、action）
- Axios（`apiClient.js` 統一處理，含 JWT 與 CSRF token）
- Tailwind CSS + React Toastify

### 後端 (backend/)
- Spring Boot 3.5.14、Java 25、Maven
- Spring Security 6 + JWT（JJWT 0.13.0）
- 預設 H2（開發）；production 切換 MySQL
- Lombok、Caffeine Cache、SpringDoc OpenAPI、Stripe SDK

## 常用指令

```bash
# 前端
cd frontend && npm install && npm run dev

# 後端（預設 H2，自動執行 schema.sql + data.sql）
cd backend && mvn spring-boot:run

# 後端指定 profile
mvn spring-boot:run -Dspring-boot.run.profiles=qa
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# 執行測試
cd backend && mvn test

# 執行單一測試類別
mvn test -Dtest=BackendApplicationTests

# 打包
mvn package -DskipTests
```

## 後端架構

### 分層結構

```
backend/src/main/java/com/example/backend/
├── config/         # CaffeineCacheConfig、AuditorAwareImpl、CorsConfig、StripeConfig
├── constant/       # ApplicationConstants（JWT_SECRET 預設值、公開路徑等）
├── controller/     # REST 控制器（/api/v1/ 前綴）
├── dto/            # Response 物件（多數為 Java records）
├── entity/         # JPA 實體，繼承 BaseEntity（createdAt/updatedAt/createdBy/updatedBy）
├── exception/      # GlobalExceptionHandler (@RestControllerAdvice)、ResourceNotFoundException
├── payload/        # Request 物件（@Valid 驗證）
├── repository/     # Spring Data JPA Repository
├── scope/          # Bean scope 示範（Application/Request/Session）
├── security/       # MySecurityConfig、JWTTokenValidatorFilter、MyAuthenticationProvider、PublicPathConfig
├── service/        # 介面 + impl/ 實作（interface + implementation 模式）
└── util/           # JwtUtil
```

### API 端點

| 路徑 | 存取 | 說明 |
|------|------|------|
| `POST /api/v1/auth/login` | 公開 | 回傳 JWT + UserDto |
| `POST /api/v1/auth/register` | 公開 | 建立新帳號 |
| `GET /api/v1/products` | 公開 | 取得商品列表（Caffeine 快取 30 分鐘） |
| `POST /api/v1/contacts` | 公開 | 聯絡表單 |
| `GET /api/v1/csrf-token` | 公開 | 取得 CSRF token |
| `GET/PUT /api/v1/profile` | USER/ADMIN | 個人資料 |
| `GET/POST /api/v1/orders` | USER/ADMIN | 訂單 |
| `POST /api/v1/payment/create-payment-intent` | USER/ADMIN | Stripe 付款 |
| `/api/v1/admin/**` | ADMIN only | 管理功能 |
| `/swagger-ui/index.html` | ADMIN only | OpenAPI 文件 |

### 安全性架構（JWT 流程）

1. 客戶端 `POST /api/v1/auth/login`（email + password）
2. `MyAuthenticationProvider` 查詢資料庫，BCrypt 驗證密碼
3. 成功後 `JwtUtil.generateJwtToken()` 產生 token（1 小時效期，HMAC-SHA256）
4. 後續請求帶 `Authorization: Bearer <token>` header
5. `JWTTokenValidatorFilter`（OncePerRequestFilter）驗證 token，設定 SecurityContext
6. Token 過期 → 401；格式錯誤 → 401（JSON 回應）

**CSRF**：啟用 Cookie-based CSRF（`XSRF-TOKEN` cookie，JavaScript 可讀）。前端 POST/PUT/DELETE 需帶 `X-XSRF-TOKEN` header。

**CORS**：只允許 `http://localhost:5173`，允許 credentials。

### 資料庫 Schema

- `CUSTOMERS`（PK: customer_id，UNIQUE: email、mobile_number）↔ M2M `ROLES`
- `ADDRESS`（PK: address_id，FK: customer_id UNIQUE，CASCADE delete）
- `PRODUCTS`（26 筆種子資料）
- `ORDERS`（FK: customer_id）→ 1:M `ORDER_ITEMS`（FK: order_id、product_id）
- `CONTACTS`（status: OPEN/CLOSED）

### Environment Variables（後端）

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `JWT_SECRET` | `jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4` | JWT 簽名密鑰 |
| `LOG_LEVEL` | `INFO` | Root logger level |
| `JPA_SHOW_SQL` | `true` | 顯示 SQL |
| `HIBERNATE_FORMAT_SQL` | `true` | 格式化 SQL |
| `DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD` | — | prod MySQL 設定 |

### Profile 對應

| Profile | 資料庫 | Log Level |
|---------|--------|-----------|
| default | H2（嵌入式） | INFO |
| qa | H2 | WARN |
| prod | MySQL | ERROR |

## 開發規範

- 後端 API 錯誤回應格式：`{ uri, status, message, timestamp }`（`ExceptionResponseDto`）
- Entity 對 DTO 轉換：使用 `BeanUtils.copyProperties()`
- 所有 Entity 繼承 `BaseEntity`（JPA Auditing 自動填入稽核欄位）
- Service 層一律 interface + impl 分離；依賴注入用 `@RequiredArgsConstructor`（Constructor Injection）
- 前端使用 `apiClient.js` 統一處理請求，含 JWT 與 CSRF token
- React Router 的 loader/action 使用 `throw new Response()` 處理錯誤，由 `ErrorPage.jsx` 顯示
