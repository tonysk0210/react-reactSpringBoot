package com.example.backend;

import com.example.backend.dto.ContactInfoDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// 啟用 JPA 審計功能，並指定 auditorAwareRef 為 "auditorAwareImpl"，讓 Spring 知道要使用哪個 Bean 來提供當前操作使用者的資訊，以便在資料庫中自動填充 createdBy、lastModifiedBy 等審計欄位的值。
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")

// 啟用 Spring 優化功能 caching，讓我們可以在方法上使用 @Cacheable、@CachePut、@CacheEvict 等註解來實現快取功能，提高應用程式的效能。
@EnableCaching

// 把 ContactInfoDto 當成一個 Configuration Properties Bean 啟用，並從 application.properties 或 application.yml 自動綁定設定值。
@EnableConfigurationProperties(value = {ContactInfoDto.class})
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
