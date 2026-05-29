package com.example.backend.dto;

import org.springframework.boot.context.properties.ConfigurationProperties;

// 把 application.properties 設定檔中 contact 開頭的設定，自動綁定 (bind) 到這個 Java class 的欄位上，讓我們可以在程式中直接使用這些設定值。
@ConfigurationProperties("contact")
public record ContactInfoDto(
        String phone,
        String email,
        String address
) {
}
