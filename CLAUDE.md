# CLAUDE.md

## 語言偏好

請使用**繁體中文**回應。

## 專案簡介

這是一個 React + Spring Boot 全端電商專案。

## 技術棧

### 前端 (frontEnd/)
- React 18 + Vite
- React Router v6 (Data API: loader, action)
- Axios (API 請求)
- Tailwind CSS
- React Toastify (通知)

### 後端 (backend/)
- Spring Boot 3
- Spring Security + JWT 認證
- MySQL 資料庫
- Lombok
- Maven

## 常用指令

```bash
# 前端
cd frontEnd
npm install
npm run dev

# 後端
cd backend
mvn spring-boot:run
```

## 專案結構

```
reactSpringBoot/
├── frontEnd/
│   └── src/
│       ├── api/           # Axios client
│       ├── components/    # React 元件
│       └── store/         # Context (auth-context)
└── backend/
    └── src/main/java/com/example/backend/
        ├── controller/    # REST API
        ├── service/       # 業務邏輯
        ├── repository/    # JPA Repository
        ├── entity/        # 資料庫實體
        ├── security/      # JWT, Spring Security
        └── exception/     # 全域例外處理
```

## 開發規範

- 後端 API 回傳 JSON 格式，錯誤訊息使用 `errorMessage` 欄位
- 前端使用 `apiClient.js` 統一處理請求，包含 JWT 和 CSRF token
- React Router 的 loader/action 使用 `throw new Response()` 處理錯誤，由 `ErrorPage.jsx` 顯示
