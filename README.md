# StickerStore — 生產級全端電商系統

> **React 19 × Spring Boot 3** 打造的完整電商解決方案 — 從前端互動體驗、Stripe 金流整合，到後端安全架構與多環境部署，每一層都按業界標準設計。

不是 CRUD 練習，而是一套從零架構、可直接上線的電商系統。本專案貫穿全端工程的核心議題：**JWT 無狀態認證**、**Cookie-based CSRF 雙重防護**、**React Router Data API 資料流設計**、**Redux 與 Context 的狀態管理分工**，以及針對生產環境的多 Profile 配置與快取策略。

---

## 目錄

1. [功能總覽](#功能總覽)
2. [技術棧與選型理由](#技術棧與選型理由)
3. [系統架構](#系統架構)
4. [安全性設計](#安全性設計)
5. [前端架構深度說明](#前端架構深度說明)
6. [後端架構深度說明](#後端架構深度說明)
7. [資料庫設計](#資料庫設計)
8. [API 文件](#api-文件)
9. [環境變數與多環境配置](#環境變數與多環境配置)
10. [如何啟動](#如何啟動)
11. [可用指令](#可用指令)

---

## 功能總覽

### 購物體驗
- 30 款商品即時瀏覽，支援關鍵字搜尋與多維排序
- 購物車跨頁共享、頁面刷新零狀態遺失（Redux + localStorage 持久化）
- Stripe 嵌入式結帳，卡號格式即時驗證、支付錯誤即時回饋
- 個人訂單歷史完整追蹤，含付款狀態與出貨進度
- 個人資料與送貨地址一站管理

### 管理後台
- 全訂單看板，一鍵確認或取消，狀態即時同步
- 客服留言集中處理，可批次標記關閉
- 完整 REST API 透過 Swagger UI 可視化管理（ADMIN 限定）

### 平台安全與性能
- **JWT 無狀態認證**：1 小時 token，401 自動清除憑證並導回登入頁
- **雙重 CSRF 防護**：Cookie Token + Request Header 交叉驗證，攻擊面覆蓋全面
- **Caffeine 本地快取**：商品列表 TTL 30 分鐘、角色清單 TTL 1 天，大幅降低 DB 查詢壓力
- **JPA Auditing**：所有資料表自動追蹤建立者、修改者及時間戳，稽核零成本

---

## 技術棧與選型理由

### 前端

| 技術 | 版本 | 用途 | 選用理由 |
|------|------|------|----------|
| **React** | 19.2.4 | UI 框架 | Concurrent features、函數元件 + Hooks 為主流，生態系豐富 |
| **React Router DOM** | 7.14.1 | 用戶端路由 | Data API（loader / action）將資料獲取與元件渲染解耦，取代 useEffect 拉資料的舊模式 |
| **Redux Toolkit** | 2.12.0 | 購物車狀態管理 | 購物車需跨多個頁面共享並持久化，RTK 的 `createSlice` 大幅減少樣板程式碼 |
| **React Context** | 內建 | 登入狀態管理 | 身份驗證狀態（token、user）更新頻率低，不需 Redux 的效能優化，Context 已足夠 |
| **Axios** | 1.15.0 | HTTP 客戶端 | 攔截器（Interceptors）機制讓 JWT 注入與 CSRF token 處理集中在單一位置，避免重複程式碼 |
| **Stripe JS / React Stripe** | 9.4.0 / 6.3.0 | 付款 UI | PCI-DSS 合規的嵌入式表單元件，卡號資料直接傳至 Stripe，後端不經手敏感資訊 |
| **Tailwind CSS** | 4.2.2 | 原子化樣式 | Utility-first 策略提升開發速度，搭配 Vite 插件支援最新 v4 語法 |
| **Bootstrap** | 5.3.8 | UI 元件補充 | 快速建構表格、Modal 等標準元件，與 Tailwind 並存互補 |
| **React Toastify** | 11.1.0 | 通知提示 | API 操作回饋的輕量解決方案，可自訂位置與樣式 |
| **Vite** | 最新 | 建構工具 | 基於 ESM 的開發伺服器，HMR 速度遠優於 Webpack；多環境 `.env` 分檔管理 |

### 後端

| 技術 | 版本 | 用途 | 選用理由 |
|------|------|------|----------|
| **Spring Boot** | 3.5.14 | 應用框架 | 自動配置降低設定成本，與 Spring 生態系深度整合（Security、Data JPA、Actuator） |
| **Java** | 25 | 執行環境 | 採用最新 LTS 語法特性，Record class 用於 DTO 大幅簡化程式碼 |
| **Spring Security 6** | 6 | 認證與授權 | Filter Chain 架構提供細粒度的安全控制，與 Spring Boot 整合零配置 |
| **JJWT** | 0.13.0 | JWT 處理 | 業界標準 JWT 函式庫，支援 HMAC-SHA256 簽名與 Claims 解析 |
| **Spring Data JPA** | — | ORM | Repository 介面自動生成 CRUD，搭配 JPA Auditing 實現稽核紀錄 |
| **H2** | — | 開發資料庫 | 嵌入式記憶體（本專案用 file-based）資料庫，無需安裝即可啟動，並附帶 Web Console |
| **MySQL** | — | 生產資料庫 | Production profile 切換至 MySQL，透過環境變數注入連線設定 |
| **Caffeine Cache** | — | 記憶體快取 | JVM 本地快取，商品列表 TTL 30 分鐘，角色清單 TTL 1 天，避免頻繁查詢 DB |
| **Stripe Java SDK** | 32.1.0 | 支付處理 | 官方 SDK，後端僅建立 PaymentIntent 並回傳 clientSecret，不接觸卡號資料 |
| **SpringDoc OpenAPI** | 2.8.17 | API 文件 | 自動從 Controller 程式碼產生 Swagger UI，ADMIN 角色限制存取 |
| **Lombok** | — | 樣板碼消除 | `@RequiredArgsConstructor` 產生建構子注入，`@Data`、`@Builder` 等減少重複程式碼 |
| **Spring Boot Actuator** | — | 健康檢查 | `/actuator/health` 公開，`/actuator/**` 其他路徑限 ADMIN，適用於 K8s liveness probe |
| **Maven** | 3.9+ | 建構工具 | 成熟穩定的依賴管理，profile 機制支援多環境建構 |

---

## 系統架構

```
瀏覽器 (React 19 + Vite)
   │
   │  HTTP/HTTPS  (Authorization: Bearer JWT, X-XSRF-TOKEN)
   ▼
Spring Boot 後端  :8080
   │
   ├── SecurityFilterChain
   │     ├── JWTTokenValidatorFilter (OncePerRequestFilter)
   │     ├── CSRF Token Repository (CookieCsrfTokenRepository)
   │     └── 路徑授權規則 (permitAll / hasRole)
   │
   ├── Controller Layer  (/api/v1/*)
   │     └── @Valid 驗證 Payload → Service
   │
   ├── Service Layer  (interface + impl)
   │     ├── @Cacheable("products")  →  Caffeine Cache
   │     └── 業務邏輯 → Repository
   │
   ├── Repository Layer  (Spring Data JPA)
   │     └── SQL → H2 (dev) / MySQL (prod)
   │
   └── 外部服務
         └── Stripe API  (PaymentIntent)
```

### 前後端分離設計

- 後端為純 REST API，以 JSON 通訊，不渲染任何 HTML 頁面
- CORS 僅允許 `http://localhost:5173`（dev）及 CloudFront 域名（prod）
- 前端以 Vite 多環境 `.env` 檔管理 `VITE_API_BASE_URL`，不硬編碼 API 位址

---

## 安全性設計

### JWT 認證流程

```
1. POST /api/v1/auth/login
       ↓ email + password
2. MyAuthenticationProvider
       ↓ 查詢 CUSTOMERS 資料表 → BCrypt.matches() 驗證密碼
3. JwtUtil.generateJwtToken()
       ↓ HMAC-SHA256 簽名，1 小時效期
         Claims: customerId、username、email、mobileNumber、roles
4. 回傳 { jwtToken, user } → 前端存入 localStorage
5. 後續請求 Header: Authorization: Bearer <token>
6. JWTTokenValidatorFilter (OncePerRequestFilter)
       ↓ 驗證簽名 + 檢查效期 → 設定 SecurityContext
7. 驗證失敗 → Filter 直接寫入 401 JSON（繞過 GlobalExceptionHandler）
8. 前端 Axios Response Interceptor
       ↓ 捕捉 401 → 清除 localStorage → 導向 /login
```

**設計要點**：JWT 為無狀態（Stateless），後端不需維護 Session，適合水平擴展。Token payload 內嵌 roles，省去每次請求查詢資料庫的開銷。

### CSRF 防護機制

雙重機制（JWT + CSRF）對應不同攻擊面：

| 攻擊類型 | 防護機制 |
|----------|----------|
| 未授權存取 API | JWT Bearer token 驗證 |
| 跨站請求偽造（CSRF） | Cookie + Header 雙重確認 |

實作細節：
- 後端設定 `CookieCsrfTokenRepository`，在每個回應中附上 `XSRF-TOKEN` cookie（`httpOnly=false`，JavaScript 可讀）
- 前端 Axios Request Interceptor 在 POST / PUT / PATCH / DELETE 自動從 cookie 讀取 token，加入 `X-XSRF-TOKEN` header
- 若 cookie 不存在（初次載入），先呼叫 `GET /api/v1/csrf-token` 取得 token 後再重試原請求
- 唯一例外：`/api/v1/contacts/**` 為公開聯絡表單，免除 CSRF 驗證

### 密碼安全

- 註冊時以 `BCryptPasswordEncoder` 雜湊後儲存，不存明文
- 登入時 `BCrypt.matches()` 比對，不可逆推原始密碼

### 存取控制（RBAC）

```
公開路徑             → permitAll()
/api/v1/admin/**     → hasRole("ADMIN")
/swagger-ui/**       → hasRole("ADMIN")
/actuator/**         → hasRole("ADMIN")  （health 除外）
其餘所有路徑          → hasAnyRole("USER", "ADMIN")
```

公開路徑定義在 `PublicPathConfig.java` bean，集中管理避免分散於多個設定類別。

---

## 前端架構深度說明

### 狀態管理策略

本專案刻意採用**兩種不同的狀態管理方案**，分別針對不同的使用情境：

**Redux Toolkit — 購物車**

選用 RTK 的原因：
- 購物車狀態需跨多個頁面共享（首頁、商品頁、購物車頁、結帳頁）
- 需要複雜的 Reducer 邏輯（加入相同商品時累加數量而非新增條目）
- `store.subscribe()` 在每次狀態變更後自動同步至 `localStorage["cart"]`，刷新頁面不遺失
- RTK 的 `createSlice` + Immer（內建）允許直接「修改」state，無需手寫展開運算子

```js
// cartSlice 核心邏輯示意
addToCart: (state, action) => {
  const existing = state.items.find(i => i.productId === action.payload.productId);
  existing ? existing.quantity++ : state.items.push({ ...action.payload, quantity: 1 });
}
```

**React Context — 身份驗證**

選用 Context 的原因：
- 認證狀態（token、user）更新頻率極低（僅登入/登出時變動）
- 不需要 Redux DevTools 調試認證流程
- 避免過度工程化：Context 對於低頻更新的全局狀態已完全足夠
- `localStorage` 持久化讓頁面刷新後自動恢復登入狀態

### React Router 7 Data API

放棄傳統 `useEffect` 在元件內拉資料的方式，改用 React Router Data API：

| 模式 | 說明 | 優點 |
|------|------|------|
| `loader` | 路由匹配時即執行資料獲取 | 元件掛載時資料已就位，無 Loading 狀態閃爍 |
| `action` | 表單提交時執行副作用（POST / PUT） | 提交邏輯與元件渲染解耦，複用性高 |
| `shouldRevalidate` | 控制 loader 是否重新執行 | 精細控制重新取資料的時機，避免不必要的 API 呼叫 |
| `throw new Response()` | 在 loader/action 中丟出錯誤 | 由 `ErrorPage.jsx` 統一捕捉，不需每個元件個別處理錯誤 |

路由結構：

```
/                 Home          productsLoader
/about            About
/contact          Contact       contactLoader + contactAction
/login            Login         loginAction
/register         Register      registerAction
/cart             Cart
/products/:id     ProductDetail
─────────────────────────── ProtectedRoute ──────────────────────────
/checkout         CheckoutForm
/order-success    OrderSuccess
/orders           Orders        ordersLoader
/profile          Profile       profileLoader + profileAction + shouldRevalidate
─────────────────────────── ADMIN only ─────────────────────────────
/admin/orderManage  OrderManage  orderManageLoader
/admin/messages     Message      messagesLoader
```

### Axios 攔截器設計

`apiClient.js` 作為唯一的 HTTP 通訊入口，透過攔截器集中處理橫切關注點（Cross-cutting Concerns）：

```
Request Interceptor
  ├── 從 localStorage 讀取 jwtToken
  ├── 自動補上 Authorization: Bearer <token>
  ├── 若為非安全方法（POST/PUT/PATCH/DELETE）
  │     ├── 從 cookie 讀取 XSRF-TOKEN
  │     ├── 若無 cookie → GET /api/v1/csrf-token（首次載入）
  │     └── 補上 X-XSRF-TOKEN header
  └── 發送請求

Response Interceptor
  ├── 2xx → 正常回傳資料
  └── 401 → 清除 localStorage token + user → 導向 /login
```

### Stripe 付款流程（前端）

```
1. 使用者填寫信用卡資料
      ↓  CardNumberElement / CardExpiryElement / CardCvcElement
      （卡號資料只在 Stripe iframe 內，不進入 React state）
2. POST /api/v1/payment/create-payment-intent
      ↓  { amount, currency }
      後端建立 PaymentIntent → 回傳 clientSecret
3. stripe.confirmCardPayment(clientSecret, { payment_method: { card } })
      ↓  Stripe 直接與 Stripe 伺服器通訊確認付款
4. 付款成功 → POST /api/v1/orders → 建立訂單紀錄 → 跳轉 /order-success
```

---

## 後端架構深度說明

### 分層架構

```
backend/src/main/java/com/example/backend/
├── config/
│   ├── CaffeineCacheConfig.java     products TTL 30min；roles TTL 1 day
│   ├── AuditorAwareImpl.java        從 SecurityContext 取 email 作為 auditor
│   ├── CorsConfig.java              allowedOrigins 由 application.properties 注入
│   └── StripeConfig.java            @PostConstruct 初始化 Stripe.apiKey
├── constant/
│   └── ApplicationConstants.java    JWT_SECRET、ORDER_STATUS_* 等常數集中定義
├── controller/                      @RestController，@RequestMapping("/api/v1/...")
│   ├── AuthController               登入、註冊
│   ├── ProductController            商品列表
│   ├── ContactController            聯絡表單（含 @ConfigurationProperties 聯絡資訊）
│   ├── ProfileController            個人資料 GET / PUT
│   ├── OrderController              訂單 GET / POST
│   ├── PaymentController            Stripe PaymentIntent
│   ├── AdminController              訂單管理、留言管理
│   └── CsrfController               CSRF token 端點
├── dto/                             Response 物件（大量使用 Java Record）
├── entity/                          JPA 實體，繼承 BaseEntity
├── exception/
│   ├── GlobalExceptionHandler.java  @RestControllerAdvice 統一錯誤處理
│   ├── ResourceNotFoundException
│   └── DuplicateFieldException
├── payload/                         Request 物件（@Valid + Bean Validation）
├── repository/                      Spring Data JPA（無需實作，介面自動生成）
├── security/
│   ├── MySecurityConfig.java        SecurityFilterChain 定義
│   ├── JWTTokenValidatorFilter.java OncePerRequestFilter，解析 Bearer token
│   ├── MyAuthenticationProvider.java 自訂認證邏輯（查 DB + BCrypt）
│   ├── JwtUtil.java                 generateJwtToken / 解析 Claims
│   └── PublicPathConfig.java        公開路徑 bean，集中管理
└── service/
    ├── *Service.java                介面定義（依賴倒置原則）
    └── impl/*ServiceImpl.java       業務邏輯實作
```

### 設計模式與原則

**Interface + Impl 分離**

Service 層一律定義介面，再由 `impl/` 提供實作，遵循依賴倒置原則（DIP）：

```java
// Service 介面（定義契約）
public interface ProductService {
    List<ProductDto> getAllProducts();
}

// 實作（可替換，不影響 Controller）
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepo productRepo;

    @Cacheable("products")
    @Override
    public List<ProductDto> getAllProducts() { ... }
}
```

**Constructor Injection（建構子注入）**

所有 Bean 使用 `@RequiredArgsConstructor`（Lombok）產生建構子注入，而非 `@Autowired` 欄位注入：
- 便於單元測試（可直接傳入 Mock 物件）
- 依賴關係在物件建立時即確立，不可為 null
- final 欄位確保不可變性

**Java Record 作為 DTO**

Response DTO 大量使用 Java Record，天生不可變、自帶 equals / hashCode / toString：

```java
public record LoginResponseDto(String jwtToken, UserDto user) {}
public record PaymentResponseDto(String clientSecret) {}
```

**DTO 轉換策略**

Entity → DTO 使用 `BeanUtils.copyProperties()`，對欄位名稱相同的屬性直接複製，省去手寫 setter 的樣板程式碼。

**統一錯誤回應**

`GlobalExceptionHandler` 以 `@RestControllerAdvice` 攔截所有例外，依例外類型回傳不同格式：

| 例外 | HTTP | 回應格式 |
|------|------|---------|
| `Exception`（未捕獲）| 500 | `ExceptionResponseDto` |
| `ResourceNotFoundException` | 404 | `ExceptionResponseDto` |
| `MethodArgumentNotValidException`（`@Valid @RequestBody`）| 400 | `Map<String, List<String>>` |
| `ConstraintViolationException`（`@RequestParam` / `@PathVariable`）| 400 | `Map<String, String>` |
| `DuplicateFieldException` | 400 | `Map<String, List<String>>` |

`ExceptionResponseDto` 實際欄位（對應 `Exception` 與 `ResourceNotFoundException`）：

```json
{
  "apiPath": "uri=/api/v1/profile",
  "errorCode": "NOT_FOUND",
  "errorMessage": "Customer not found with id: 42",
  "errorTime": "2026-06-20T10:30:00"
}
```

`@Valid` DTO 驗證失敗（`MethodArgumentNotValidException`）：

```json
{
  "name": ["名字是必填的", "名字必須在 2 到 30 個字符之間"],
  "email": ["無效的電子郵件地址"]
}
```

`@RequestParam` / `@PathVariable` 驗證失敗（`ConstraintViolationException`）：

```json
{
  "param.p": "p 長度必須介於 5 到 30 個字元"
}
```

`PUT /api/v1/profile` 更新時 email / 手機號碼與其他帳號重複（`DuplicateFieldException`）：

```json
{
  "email": ["此 Email： john@gmail.com 已被其他帳號使用"],
  "mobileNumber": ["此手機號碼： 0912345678 已被其他帳號使用"]
}
```

### Caffeine 快取策略

| 快取名稱 | TTL | 觸發條件 | 失效時機 |
|---------|-----|---------|---------|
| `products` | 30 分鐘 | `GET /api/v1/products` | TTL 到期後下次請求時重建 |
| `roles` | 1 天 | 角色查詢 | TTL 到期後下次請求時重建 |

商品資料為唯讀且更新頻率極低，快取可大幅減少 DB 查詢。角色資料幾乎不變，適合較長的 TTL。

### Spring Profiles 多環境管理

| Profile | 資料庫 | SQL 初始化 | Log Level | SQL 輸出 |
|---------|--------|-----------|-----------|---------|
| `default` | H2 file-based (`./h2db/myDb`) | 自動執行 schema.sql + data.sql | INFO | 顯示並格式化 |
| `qa` | H2 | 自動執行 | WARN | 關閉 |
| `prod` | MySQL（環境變數注入） | `never`（不執行） | ERROR | 關閉 |

生產環境的敏感資訊（DB 連線、JWT Secret、Stripe Key）全部透過環境變數注入，不存在於程式碼中。

### JPA Auditing

`BaseEntity` 搭配 `@EnableJpaAuditing` 自動填入稽核欄位：

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @CreatedDate   LocalDateTime createdAt;
    @LastModifiedDate LocalDateTime updatedAt;
    @CreatedBy     String createdBy;    // email，由 AuditorAwareImpl 提供
    @LastModifiedBy String updatedBy;
}
```

所有業務資料表皆繼承 `BaseEntity`，系統可追蹤任何記錄的建立者與修改者。

---

## 資料庫設計

### ER 圖（文字版）

```
CUSTOMERS (1) ──── (M) CUSTOMER_ROLES (M) ──── (1) ROLES
    │
    │ (1:1, cascade delete)
    └──── ADDRESS

CUSTOMERS (1) ──── (M) ORDERS (1) ──── (M) ORDER_ITEMS (M) ──── (1) PRODUCTS

CONTACTS  （獨立資料表）
```

### 資料表說明

| 資料表 | 主鍵 | 關鍵欄位 | 說明 |
|-------|------|---------|------|
| `CUSTOMERS` | customer_id | email UNIQUE, mobile_number UNIQUE, password_hash | 客戶主表，密碼以 BCrypt 雜湊儲存 |
| `ROLES` | role_id | name UNIQUE | ROLE_USER、ROLE_ADMIN |
| `CUSTOMER_ROLES` | (customer_id, role_id) | CASCADE DELETE | 多對多關聯的 Junction Table |
| `ADDRESS` | address_id | customer_id UNIQUE FK | 每位客戶最多一個地址，隨客戶刪除而刪除 |
| `PRODUCTS` | product_id | name, price DECIMAL(10,2), popularity, image_url | 30 筆種子資料，存 popularity 欄位供前端排序 |
| `ORDERS` | order_id | customer_id FK, total_price, payment_id, payment_status, order_status | payment_id 為 Stripe PaymentIntent ID |
| `ORDER_ITEMS` | order_item_id | order_id FK, product_id FK, quantity, price | 快照當下商品價格，與 PRODUCTS 解耦 |
| `CONTACTS` | contact_id | status (OPEN/CLOSED) | 聯絡表單，管理員可標記為 CLOSED |

所有資料表均繼承 `BaseEntity` 的四個稽核欄位：`created_at`、`updated_at`、`created_by`、`updated_by`。

---

## API 文件

所有端點前綴為 `/api/v1`。後端啟動後可透過以下兩種方式查閱完整 API（均需 ADMIN 身份登入）：

| 用途 | URL |
|------|-----|
| 互動式文件（Swagger UI） | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON Spec（可匯入 Postman / Insomnia）| `http://localhost:8080/v3/api-docs` |

### 認證（公開）

| 方法 | 路徑 | 請求 Body | 回應 |
|------|------|----------|------|
| POST | `/auth/login` | `{ email, password }` | `{ jwtToken, user }` |
| POST | `/auth/register` | `{ name, email, mobileNumber, password }` | 201 Created |

### 商品（公開）

| 方法 | 路徑 | 回應 |
|------|------|------|
| GET | `/products` | `[{ productId, name, description, price, popularity, imageUrl }]` |

### 聯絡表單（公開，免 CSRF）

| 方法 | 路徑 | 請求 Body | 回應 |
|------|------|----------|------|
| POST | `/contacts` | `{ name, email, mobileNumber, message }` | 201 Created |
| GET | `/contacts` | — | 聯絡資訊（從 application.properties 綁定） |

### 個人資料（USER / ADMIN）

| 方法 | 路徑 | 請求 Body | 回應 |
|------|------|----------|------|
| GET | `/profile` | — | `{ name, email, mobileNumber, address }` |
| PUT | `/profile` | `{ name, mobileNumber, street, city, state, postalCode, country }` | 更新後的個人資料 |

### 訂單（USER / ADMIN）

| 方法 | 路徑 | 請求 Body | 回應 |
|------|------|----------|------|
| POST | `/orders` | `{ orderItems: [{ productId, quantity }] }` | 201 Created |
| GET | `/orders` | — | `[{ orderId, totalPrice, orderStatus, paymentStatus, items }]` |

### 支付（USER / ADMIN）

| 方法 | 路徑 | 請求 Body | 回應 |
|------|------|----------|------|
| POST | `/payment/create-payment-intent` | `{ amount, currency }` | `{ clientSecret }` |

### 管理功能（ADMIN only）

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/admin/orderManage` | 所有 status=CREATED 的待處理訂單 |
| PATCH | `/admin/orderManage/{orderId}/confirm` | 訂單狀態改為 CONFIRMED |
| PATCH | `/admin/orderManage/{orderId}/cancel` | 訂單狀態改為 CANCELLED |
| GET | `/admin/messages` | 所有 status=OPEN 的未處理留言 |
| PATCH | `/admin/messages/{contactId}/close` | 留言狀態改為 CLOSED |

### 系統端點

| 方法 | 路徑 | 存取限制 | 說明 |
|------|------|---------|------|
| GET | `/csrf-token` | 公開 | 取得 CSRF token |
| GET | `/actuator/health` | 公開 | 健康檢查（適用 K8s probe） |
| GET | `/swagger-ui/index.html` | ADMIN | Swagger UI 互動式文件 |
| GET | `/v3/api-docs` | ADMIN | OpenAPI JSON Spec（可匯入 Postman）|

**錯誤回應格式**

一般錯誤（`ExceptionResponseDto`，用於 4xx / 5xx）：

```json
{
  "apiPath": "uri=/api/v1/orders",
  "errorCode": "FORBIDDEN",
  "errorMessage": "Access Denied",
  "errorTime": "2026-06-20T10:30:00"
}
```

欄位驗證失敗（`@Valid @RequestBody`，`MethodArgumentNotValidException`）：

```json
{
  "email": ["無效的電子郵件地址"],
  "password": ["密碼不得為空"]
}
```

---

## 環境變數與多環境配置

### 後端環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `JWT_SECRET` | `jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4` | JWT 簽名密鑰，**生產環境必須替換** |
| `STRIPE_API_KEY` | 已內建測試金鑰於 `stripe.properties` | 正式環境替換為 live key |
| `LOG_LEVEL` | `INFO` | Root logger 等級 |
| `JPA_SHOW_SQL` | `true` | 是否輸出 SQL 至日誌 |
| `HIBERNATE_FORMAT_SQL` | `true` | SQL 是否格式化輸出 |
| `DATABASE_HOST` | — | MySQL 主機（prod only） |
| `DATABASE_PORT` | — | MySQL 連接埠（prod only） |
| `DATABASE_NAME` | — | MySQL 資料庫名稱（prod only） |
| `DATABASE_USERNAME` | — | MySQL 帳號（prod only） |
| `DATABASE_PASSWORD` | — | MySQL 密碼（prod only） |

### 前端環境變數

| 檔案 | `VITE_API_BASE_URL` | 用途 |
|------|---------------------|------|
| `.env` | `http://localhost:8080/api/v1` | 本機開發 |
| `.env.dev` | `https://dev.stickerstore.com/api/v1` | Dev 測試環境 |
| `.env.production` | `https://d1llf3j3ji3al9.cloudfront.net/api/v1` | CloudFront 生產環境 |

---

## 如何啟動

### 環境需求

- Node.js 18+、npm
- Java 25+
- Maven 3.9+
- Stripe 帳號（使用測試模式 key 即可）

### 步驟

**1. 複製專案**

```bash
git clone <repo-url>
cd reactSpringBoot
```

**2. 啟動後端**

```bash
cd backend
mvn spring-boot:run
```

伺服器啟動於 `http://localhost:8080`。首次啟動自動：
- 從 `schema.sql` 建立所有資料表
- 從 `data.sql` 植入 30 筆商品及預設角色與帳號
- H2 Web Console：`http://localhost:8080/h2-console`（JDBC URL：`jdbc:h2:file:./h2db/myDb`）

**4. 啟動前端**

```bash
cd frontend
npm install
npm run dev
```

應用程式啟動於 `http://localhost:5173`。

### 預設帳號

| 角色 | Email | 密碼 | 說明 |
|------|-------|------|------|
| ADMIN | admin@gmail.com | 1234 | Demo 帳號，可存取管理後台與 Swagger |

### H2 Console 登入資訊

H2 Web Console 網址：`http://localhost:8080/h2-console`

| 欄位 | 值 |
|------|----|
| JDBC URL | `jdbc:h2:file:./h2db/myDb` |
| 帳號（Username） | `sa` |
| 密碼（Password） | （空白，不填）|

### Stripe 測試刷卡資訊

結帳頁面使用 Stripe 測試模式，請輸入以下測試卡號：

| 欄位 | 值 |
|------|----|
| 卡號 | `4242 4242 4242 4242` |
| 到期日 | 任意未來日期（例如 `12/34`）|
| CVC | 任意三位數（例如 `123`）|

---

## 可用指令

### 前端

```bash
npm run dev             # 開發伺服器（localhost:5173，支援 HMR）
npm run build           # 生產建構（使用 .env.production）
npm run build:localhost # 指向本機後端的建構
npm run build:dev       # 指向 dev 環境的建構
npm run preview         # 本機預覽生產建構結果
npm run lint            # ESLint 檢查
```

### 後端

```bash
mvn spring-boot:run                                     # 以 H2 啟動（預設）
mvn spring-boot:run -Dspring-boot.run.profiles=qa      # QA profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod    # Production profile（需 MySQL）
mvn test                                                # 執行所有測試
mvn test -Dtest=BackendApplicationTests                 # 執行單一測試類別
mvn package -DskipTests                                 # 打包為 JAR
```
