# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 語言偏好

請使用**繁體中文**回應。

## 專案簡介

這是一個貼紙電商（StickerStore）全端專案，React 前端 + Spring Boot 後端。

## 技術棧

### 前端 (frontend/)
- React 19.2.4 + Vite
- React Router DOM 7.14.1（Data API：loader、action、createBrowserRouter）
- Redux Toolkit 2.12.0 + React Redux 9.3.0（購物車狀態管理）
- React Context（AuthContext：JWT / 登入狀態）
- Axios 1.15.0（`apiClient.js` 統一處理，含 JWT 與 CSRF token）
- Tailwind CSS 4.2.2（Vite 插件）+ Bootstrap 5.3.8 + Sass 1.99.0
- React Toastify 11.1.0
- Stripe JS 9.4.0 + @stripe/react-stripe-js 6.3.0
- FontAwesome SVG Icons（Solid、Regular、Brands）+ React component 3.3.0
- js-cookie 3.0.5

### 後端 (backend/)
- Spring Boot 3.5.14、Java 25、Maven
- Spring Security 6 + JWT（JJWT 0.13.0，HMAC-SHA256，1 小時效期）
- 預設 H2 file-based（`./h2db/myDb`）；production 切換 MySQL
- Lombok、Caffeine Cache、SpringDoc OpenAPI 2.8.17、Stripe Java SDK 32.1.0
- Spring Boot Actuator

## 常用指令

```bash
# 前端
cd frontend && npm install && npm run dev
npm run build              # 生產構建（production 環境）
npm run build:localhost    # localhost 模式
npm run build:dev          # dev 環境構建
npm run lint
npm run preview            # 預覽生產構建

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

## 前端架構

### 路由結構 (frontend/src/main.jsx)

| 路徑 | 元件 | 備註 |
|------|------|------|
| `/` 或 `/home` | Home | productsLoader |
| `/about` | About | 公開 |
| `/contact` | Contact | contactAction, contactLoader |
| `/login` | Login | loginAction |
| `/register` | Register | registerAction |
| `/cart` | Cart | 公開 |
| `/products/:productId` | ProductDetail | 公開 |
| `/checkout` | CheckoutForm | 需登入（ProtectedRoute）|
| `/order-success` | OrderSuccess | 需登入 |
| `/orders` | Orders | ordersLoader，需登入 |
| `/profile` | Profile | profileLoader、profileAction、shouldRevalidate |
| `/admin/orderManage` | OrderManage | orderManageLoader，需 ADMIN |
| `/admin/messages` | Message | messagesLoader，需 ADMIN |

### 元件結構 (frontend/src/components/)

```
components/
├── about/               About.jsx
├── cart/                Cart.jsx, CartTable.jsx, CheckoutForm.jsx, OrderSuccess.jsx
├── contact/             Contact.jsx
├── footer/              Footer.jsx (footer.module.css)
├── header/              Header.jsx
├── home/                Home.jsx, PageHeading.jsx, PageTitle.jsx
│   └── product/         ProductCard.jsx, ProductDetail.jsx, ProductListing.jsx,
│                        Price.jsx, DropDown.jsx, SearchBox.jsx
├── login/               Login.jsx, Register.jsx, Profile.jsx, Orders.jsx, ProtectedRoute.jsx
│   └── admin/           OrderManage.jsx, Message.jsx
└── ErrorPage.jsx
```

### 狀態管理

**Redux Toolkit** (frontend/src/store/store.js)
- `cartSliceReducer` 管理購物車
- Actions: `addToCart`, `removeFromCart`, `clearCart`
- Selectors: `selectCartItems`, `selectTotalQuantity`, `selectTotalPrice`
- `store.subscribe()` 自動同步到 localStorage (`cart` key)

**React Context** (frontend/src/store/auth-context.jsx)
- AuthContext 管理登入狀態（jwtToken、user、isAuthenticated）
- `loginSuccess()`, `logout()` 方法
- 從 localStorage 恢復（`jwtToken`, `user` keys）

### API 客戶端 (frontend/src/api/apiClient.js)

- baseURL 由 `VITE_API_BASE_URL` 環境變數決定
- **Request Interceptor**：自動補 JWT Bearer token；非 GET/HEAD/OPTIONS 補 `X-XSRF-TOKEN`（先讀 cookie，缺少則呼叫 `/api/v1/csrf-token`）
- **Response Interceptor**：401 → 清除 token、導向 `/login`

### 路由守衛 (frontend/src/utils/authRouteGuards.js)

- `ProtectedRoute` 元件：未登入時重導向 `/login`

### 前端環境變數 (frontend/.env*)

| 檔案 | VITE_API_BASE_URL |
|------|-------------------|
| `.env` | `http://localhost:8080/api/v1` |
| `.env.dev` | `https://dev.stickerstore.com/api/v1` |
| `.env.production` | `https://d1llf3j3ji3al9.cloudfront.net/api/v1` |

## 後端架構

### 分層結構

```
backend/src/main/java/com/example/backend/
├── BackendApplication.java
├── config/         # CaffeineCacheConfig、AuditorAwareImpl、CorsConfig、StripeConfig
├── constant/       # ApplicationConstants（JWT_SECRET 預設值、ORDER_STATUS_* 常數等）
├── controller/     # REST 控制器（/api/v1/ 前綴）
├── dto/            # Response 物件（多數為 Java records）
├── entity/         # JPA 實體，繼承 BaseEntity（createdAt/updatedAt/createdBy/updatedBy）
├── exception/      # GlobalExceptionHandler (@RestControllerAdvice)、ResourceNotFoundException、DuplicateFieldException
├── payload/        # Request 物件（@Valid 驗證）
├── repository/     # Spring Data JPA Repository
├── scope/          # Bean scope 示範（Application/Request/Session）
├── security/       # MySecurityConfig、JWTTokenValidatorFilter、MyAuthenticationProvider、JwtUtil、PublicPathConfig
├── service/        # 介面 + impl/ 實作（interface + implementation 模式）
└── util/           # JwtUtil
```

### API 端點完整清單

**認證** (`/api/v1/auth` - 公開)

| 方法 | 路徑 | 回應 | 說明 |
|------|------|------|------|
| POST | `/api/v1/auth/login` | LoginResponseDto（jwtToken + UserDto）| 登入 |
| POST | `/api/v1/auth/register` | 201 Created | 建立新帳號 |

**商品** (`/api/v1/products` - 公開)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/v1/products` | 商品列表（Caffeine 快取 30 分鐘） |

**聯絡表單** (`/api/v1/contacts` - 公開，且免 CSRF)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/v1/contacts` | 新增聯絡留言 |
| GET | `/api/v1/contacts` | ContactInfoDto（從 application.properties 綁定） |

**CSRF Token** (`/api/v1/csrf-token` - 公開)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/v1/csrf-token` | 取得 CSRF token |

**個人檔案** (`/api/v1/profile` - USER/ADMIN)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/v1/profile` | 取得個人資料 |
| PUT | `/api/v1/profile` | 更新名稱、手機、地址 |

**訂單** (`/api/v1/orders` - USER/ADMIN)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/v1/orders` | 建立訂單 |
| GET | `/api/v1/orders` | 取得該客戶的訂單列表 |

**支付** (`/api/v1/payment` - USER/ADMIN)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/v1/payment/create-payment-intent` | 建立 Stripe PaymentIntent，回傳 clientSecret |

**管理功能** (`/api/v1/admin/**` - ADMIN only)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/v1/admin/orderManage` | 所有 status=CREATED 的待確認訂單 |
| PATCH | `/api/v1/admin/orderManage/{orderId}/confirm` | 訂單狀態改為 CONFIRMED |
| PATCH | `/api/v1/admin/orderManage/{orderId}/cancel` | 訂單狀態改為 CANCELLED |
| GET | `/api/v1/admin/messages` | 所有 status=OPEN 的留言 |
| PATCH | `/api/v1/admin/messages/{contactId}/close` | 留言狀態改為 CLOSED |

**其他** (公開，示範/教學用)

| 路徑 | 說明 |
|------|------|
| `/api/v1/dummy/**` | DummyController：示範 query param、path variable、headers |
| `/api/v1/scope/**` | ScopeController：示範 Request/Session/Application Bean scope |
| `/swagger-ui/index.html` + `/v3/api-docs/**` | ADMIN only，SpringDoc OpenAPI |
| `/actuator/health/**` | 公開；`/actuator/**` 其餘需 ADMIN |

### 安全性架構

**JWT 流程**
1. 客戶端 `POST /api/v1/auth/login`（email + password）
2. `MyAuthenticationProvider` 查詢資料庫，BCrypt 驗證密碼
3. 成功後 `JwtUtil.generateJwtToken()` 產生 token（1 小時效期，HMAC-SHA256）
4. Token payload 含：issuer、subject（customerId）、username、email、mobileNumber、roles
5. 後續請求帶 `Authorization: Bearer <token>` header
6. `JWTTokenValidatorFilter`（OncePerRequestFilter）驗證 token，設定 SecurityContext
7. Token 過期或格式錯誤 → Filter 直接寫入 401 JSON（不經 GlobalExceptionHandler）

**CSRF**
- Cookie-based CSRF（`XSRF-TOKEN` cookie，`httpOnly=false`，JavaScript 可讀）
- 前端 POST/PUT/DELETE 需帶 `X-XSRF-TOKEN` header
- 例外：`/api/v1/contacts/**` 免除 CSRF 驗證（`ignoringRequestMatchers`）

**CORS**
- 允許來源：`stickerstore.cors.allowed-origins` 屬性（預設 `http://localhost:5173,http://localhost:8080`）
- 允許所有 HTTP 方法與 headers；`allowCredentials: true`；preflight 快取 3600 秒

**路徑授權規則**（優先順序）
1. `publicPaths` bean 列表 → `permitAll()`（公開路徑）
2. `/api/v1/admin/**`、`/actuator/**`、`/swagger-ui/**`、`/v3/api-docs/**` → `hasRole("ADMIN")`
3. 其他 → `hasAnyRole("USER", "ADMIN")`

**公開路徑**（PublicPathConfig.java）
- `/error`、`/api/v1/products/**`、`/api/v1/contacts/**`、`/api/v1/auth/**`、`/api/v1/csrf-token`、`/actuator/health/**`

### 快取配置 (CaffeineCacheConfig.java)

| 快取名稱 | TTL | 用途 |
|---------|-----|------|
| `products` | 30 分鐘 | 商品列表（`@Cacheable("products")`）|
| `roles` | 1 天 | 角色清單 |

### Stripe 整合

- `StripeConfig.java` 讀取 `stripe.properties` 中的 `stripe.apiKey`（`${STRIPE_API_KEY:sk_test_...}`），`@PostConstruct` 初始化 SDK
- `PaymentServiceImpl` 使用 Stripe Java SDK 建立 PaymentIntent，回傳 `clientSecret`
- 前端 `CheckoutForm.jsx` 使用 `useStripe()`、`useElements()` 搭配 `CardNumberElement`、`CardExpiryElement`、`CardCvcElement`

### JPA Auditing

- `BaseEntity`：自動填入 `createdAt`、`updatedAt`、`createdBy`（email）、`updatedBy`（email）
- `AuditorAwareImpl`：從 `SecurityContext` 取得當前使用者 email

### 資料庫 Schema

| 資料表 | 說明 |
|-------|------|
| `CUSTOMERS` | PK: customer_id，UNIQUE: email、mobile_number，M2M → ROLES |
| `ROLES` | ROLE_USER、ROLE_ADMIN |
| `CUSTOMER_ROLES` | Junction table，CASCADE delete |
| `ADDRESS` | PK: address_id，FK: customer_id（UNIQUE），CASCADE delete |
| `PRODUCTS` | 30 筆種子資料 |
| `ORDERS` | FK: customer_id，含 payment_id、payment_status、order_status |
| `ORDER_ITEMS` | FK: order_id、product_id |
| `CONTACTS` | 聯絡表單，status: OPEN/CLOSED |

### Environment Variables（後端）

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `JWT_SECRET` | `jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4` | JWT 簽名密鑰 |
| `LOG_LEVEL` | `INFO` | Root logger level |
| `JPA_SHOW_SQL` | `true` | 顯示 SQL |
| `HIBERNATE_FORMAT_SQL` | `true` | 格式化 SQL |
| `STRIPE_API_KEY` | `sk_test_...`（測試金鑰）| Stripe API 金鑰 |
| `DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD` | — | prod MySQL 設定 |

### Profile 對應

| Profile | 資料庫 | Log Level | SQL Init |
|---------|--------|-----------|----------|
| default | H2 file-based (`./h2db/myDb`) | INFO | 自動執行 |
| qa | H2 | WARN | 自動執行 |
| prod | MySQL | ERROR | `never` |

## 開發規範

- 後端 API 錯誤回應格式（`ExceptionResponseDto`）：`{ apiPath, errorCode, errorMessage, errorTime }`；`@Valid` 驗證失敗回傳 `Map<String, List<String>>`（欄位名 → 錯誤訊息列表）
- Entity 對 DTO 轉換：使用 `BeanUtils.copyProperties()`
- 所有 Entity 繼承 `BaseEntity`（JPA Auditing 自動填入稽核欄位）
- Service 層一律 interface + impl 分離；依賴注入用 `@RequiredArgsConstructor`（Constructor Injection）
- 前端使用 `apiClient.js` 統一處理請求，含 JWT 與 CSRF token
- React Router 的 loader/action 使用 `throw new Response()` 處理錯誤，由 `ErrorPage.jsx` 顯示
- 新增 Exception 類型需在 `GlobalExceptionHandler` 補上對應 `@ExceptionHandler`
