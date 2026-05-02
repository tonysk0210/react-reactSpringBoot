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
                "/api/v1/contacts/**"
        );
    }
}
