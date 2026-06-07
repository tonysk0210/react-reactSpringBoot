package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class PublicPathConfig {

    // 定義需要放行的路徑
    @Bean(name = "publicPaths")
    public List<String> publicPaths() {
        return List.of(
                "/error", // Spring Boot BasicErrorController 的預設錯誤處理路徑，需放行避免錯誤轉發再次被 Security 攔截
                "/api/v1/products/**",
                "/api/v1/contacts/**",
                "/api/v1/auth/**",
                "/api/v1/csrf-token",
                "/actuator/health/**"
        );
    }
}
