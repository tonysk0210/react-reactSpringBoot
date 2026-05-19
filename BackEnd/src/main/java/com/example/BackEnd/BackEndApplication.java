package com.example.BackEnd;

import com.example.BackEnd.dto.ContactInfoDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl") // 啟用 JPA 審計功能，並指定 auditorAwareRef 為 "auditorAwareImpl"，讓 Spring 知道要使用哪個 Bean 來提供當前操作使用者的資訊
@EnableCaching // 啟用 Spring 優化功能 caching
@EnableConfigurationProperties(value = {ContactInfoDto.class}) // 啟用配置屬性，將 ContactInfoDto 類註冊為配置屬性
public class BackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }

}
