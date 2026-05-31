package com.example.backend;

import com.example.backend.dto.ContactInfoDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// 全域啟用 Spring Data JPA auditing 功能。請啟用 @CreatedDate、@CreatedBy、@LastModifiedDate、@LastModifiedBy 這些功能。
// 如果需要知道目前操作者是誰，請使用 auditorAwareImpl 這個 bean。
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")

// 啟用 Spring 優化功能 caching，讓我們可以在方法上使用 @Cacheable、@CachePut、@CacheEvict 等註解來實現快取功能，提高應用程式的效能。
@EnableCaching

// 把 ContactInfoDto 當成一個 Configuration Properties Bean 啟用 (註冊到 Spring Context 且可被注入)，並從 application.properties 或 application.yml 自動綁定設定值。
@EnableConfigurationProperties(value = {ContactInfoDto.class})
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
