package com.example.backend.dto;

import org.springframework.boot.context.properties.ConfigurationProperties;

// 將設定檔中 contact.* 開頭的屬性綁定到這個 record。
// 此類別需透過 @EnableConfigurationProperties(ContactInfoDto.class) 註冊後，才能被 Spring 建立並注入使用。
// 或 @ConfigurationPropertiesScan 註冊後，才能被 Spring 建立並注入使用。
@ConfigurationProperties("contact")
public record ContactInfoDto(
        String phone,
        String email,
        String address
) {
}
