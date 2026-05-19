package com.example.BackEnd.dto;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("contact") // 指定配置屬性前綴為 "contact"
public record ContactInfoDto(
        String phone,
        String email,
        String address
) {
}
