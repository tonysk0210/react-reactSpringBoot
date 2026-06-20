package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/csrf-token")
public class CsrfController {

    // Spring Security 在這次 request 中準備好 CsrfToken，
    // 並透過 CsrfTokenRequestAttributeHandler 放到 request attribute。
    // Controller 再從 request attribute 取出該 token，作為 response body 回傳給前端。
    @GetMapping
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        // 1. 從 Spring Security CSRF filter 放在 request attribute 裡的 CsrfToken 取出 token，並回傳給前端。
        return (CsrfToken) request.getAttribute(CsrfToken.class.getName()); // 所以這才會拿得到。
    }
    /**
     * 前端發現自己沒有 CSRF token
     * ↓
     * 呼叫後端 /api/v1/csrf-token
     * ↓
     * Spring Security 產生/取得 CsrfToken
     * ↓
     * 後端把 token 回給前端，並透過 CookieCsrfTokenRepository 設定 XSRF-TOKEN cookie
     * ↓
     * 前端之後從 cookie 讀 XSRF-TOKEN
     * ↓
     * 非 GET/HEAD/OPTIONS request 加上 X-XSRF-TOKEN header
     * ↓
     * 後端驗證 cookie token 和 header token 是否一致
     */
}
