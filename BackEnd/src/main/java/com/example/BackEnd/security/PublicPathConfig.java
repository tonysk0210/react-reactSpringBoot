package com.example.BackEnd.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class PublicPathConfig {

    @Bean(name = "publicPaths")
    // 這是 is used to define the public paths
    public List<String> publicPaths() {
        return List.of(
                "/api/v1/products/**",
                "/api/v1/contacts/**",
                "/api/v1/contacts",
                "/api/v1/auth/**",
                "/error", // Spring Boot 發生錯誤時，常會內部轉發到：/error 才能看到 status 403
                "/api/v1/csrf-token"
        );
        /**
         * GET /api/v1/profile
         *         |
         *         v
         * Spring Security 檢查權限
         *         |
         *         v
         * 沒有 DUMMY role
         *         |
         *         v
         * 產生 403 Forbidden
         *         |
         *         v
         * Spring Boot 轉發到 /error 產生錯誤 response body
         *         |
         *         v
         * /error 又被 Spring Security 攔截
         */
    }
}
