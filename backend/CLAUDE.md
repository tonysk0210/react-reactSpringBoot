# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Spring Boot backend.

## 常用指令

```bash
# 啟動（預設 H2，自動執行 schema.sql + data.sql）
mvn spring-boot:run

# 指定 profile
mvn spring-boot:run -Dspring-boot.run.profiles=qa
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# 執行所有測試
mvn test

# 執行單一測試類別
mvn test -Dtest=BackendApplicationTests

# 打包（略過測試）
mvn package -DskipTests

# 清除並重建
mvn clean package
```

## 專案結構

```
src/main/java/com/example/backend/
├── BackendApplication.java
├── config/
│   ├── AuditorAwareImpl.java     # JPA Auditing，從 SecurityContext 取得當前使用者
│   ├── CaffeineCacheConfig.java  # products 快取（30 分鐘）、roles 快取（1 天）
│   ├── CorsConfig.java           # 允許 http://localhost:5173，允許 credentials
│   └── StripeConfig.java
├── constant/
│   └── ApplicationConstants.java # JWT 預設密鑰、公開路徑清單
├── controller/                   # REST 控制器，全部掛在 /api/v1/
├── dto/                          # Response 物件（多數為 Java records）
├── entity/                       # JPA 實體，繼承 BaseEntity
├── exception/
│   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
│   └── ResourceNotFoundException.java
├── payload/                      # Request 物件（使用 @Valid）
├── repository/                   # Spring Data JPA Repository
├── scope/                        # Bean scope 示範，非業務邏輯
├── security/
│   ├── MySecurityConfig.java         # FilterChain、路徑權限設定
│   ├── JWTTokenValidatorFilter.java  # OncePerRequestFilter，驗證 Bearer token
│   ├── MyAuthenticationProvider.java # 自訂 AuthenticationProvider，查資料庫
│   └── PublicPathConfig.java         # 公開路徑常數
├── service/
│   ├── XxxService.java           # 介面
│   └── impl/XxxServiceImpl.java  # 實作
└── util/
    └── JwtUtil.java              # 產生與解析 JWT
```

```
src/main/resources/
├── application.properties        # 預設（H2、INFO log）
├── application-qa.properties     # H2、WARN log
├── application-prod.properties   # MySQL、ERROR log
└── sql/
    ├── schema.sql                # DDL（H2 啟動時執行）
    └── data.sql                  # 26 筆商品種子資料
```

## 安全性架構

### JWT 流程
1. `POST /api/v1/auth/login`（email + password）
2. `MyAuthenticationProvider` 查 DB，BCrypt 比對密碼
3. 成功 → `JwtUtil.generateJwtToken()` 簽發 token（1 小時、HMAC-SHA256）
4. Token payload 包含：issuer、subject、username、email、mobileNumber、roles
5. 後續請求帶 `Authorization: Bearer <token>`
6. `JWTTokenValidatorFilter` 驗證 → 設定 `SecurityContextHolder`
7. Token 過期（`ExpiredJwtException`）或格式錯誤（`MalformedJwtException`）→ 直接在 Filter 寫入 401 JSON（不走 GlobalExceptionHandler）

### 路徑存取控制
| 路徑 | 權限 |
|------|------|
| `/api/v1/products/**`、`/api/v1/contacts/**`、`/api/v1/auth/**`、`/api/v1/csrf-token`、`/error`、`/actuator/health/**` | 公開 |
| `/api/v1/orders/**`、`/api/v1/payment/**`、`/api/v1/profile/**` | USER 或 ADMIN |
| `/api/v1/admin/**`、`/actuator/**`、`/swagger-ui/**` | ADMIN only |

### CSRF
- Cookie-based（`CookieCsrfTokenRepository`），cookie 名稱：`XSRF-TOKEN`（`httpOnly=false`）
- 前端 POST/PUT/DELETE 需帶 `X-XSRF-TOKEN` header

## API 回應格式

**成功**：由各 DTO 定義（多為 Java records）

**錯誤**（`ExceptionResponseDto`）：
```json
{ "uri": "/api/v1/...", "status": 400, "message": "...", "timestamp": "..." }
```

**例外對應**：
| 例外 | HTTP |
|------|------|
| `Exception`（未捕獲） | 500 |
| `MethodArgumentNotValidException`（@Valid） | 400（含欄位錯誤） |
| `ConstraintViolationException`（@RequestParam） | 400 |
| `ResourceNotFoundException` | 404 |
| JWT 相關（Filter 層） | 401（JSON，繞過 GlobalExceptionHandler） |

## 資料庫 Schema

- `CUSTOMERS`（PK: customer_id，UNIQUE: email、mobile_number）
  - M2M `ROLES`（via `customer_roles` junction table）
  - 1:1 `ADDRESS`（FK 在 ADDRESS 側，CASCADE delete）
- `PRODUCTS`（product_id、name、description、price、popularity、imageUrl）
- `ORDERS`（FK: customer_id）→ 1:M `ORDER_ITEMS`（FK: order_id、product_id）
- `CONTACTS`（status: OPEN / CLOSED）
- 所有 Entity 繼承 `BaseEntity`：`createdAt`、`updatedAt`、`createdBy`、`updatedBy`（JPA Auditing 自動填入）

## Environment Variables

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `JWT_SECRET` | `jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4` | JWT 簽名密鑰，production 必須換掉 |
| `LOG_LEVEL` | `INFO` | Root logger level |
| `JPA_SHOW_SQL` | `true` | 顯示 SQL |
| `HIBERNATE_FORMAT_SQL` | `true` | 格式化 SQL |
| `DATABASE_HOST` | — | prod MySQL host |
| `DATABASE_PORT` | — | prod MySQL port |
| `DATABASE_NAME` | — | prod MySQL schema |
| `DATABASE_USERNAME` | — | prod MySQL 帳號 |
| `DATABASE_PASSWORD` | — | prod MySQL 密碼 |

## 開發規範

- **Service 層**：一律 interface（`service/`）+ implementation（`service/impl/`）
- **依賴注入**：`@RequiredArgsConstructor`（Constructor Injection），不用 `@Autowired`
- **Entity → DTO 轉換**：`BeanUtils.copyProperties(source, target)`
- **驗證**：Request payload 用 `@Valid`；`@RequestParam`/`@PathVariable` 用 `@Validated` + JSR-303
- **快取**：`@Cacheable("products")` 標在 ServiceImpl，不在 Controller
- **審計**：`AuditorAwareImpl` 從 `SecurityContextHolder` 取 email，未登入時回傳 `"ANONYMOUS"`
- **認證使用 email**：`CustomerId` 存在 JWT subject，email 存在 claims，`MyAuthenticationProvider` 以 email 查詢使用者
