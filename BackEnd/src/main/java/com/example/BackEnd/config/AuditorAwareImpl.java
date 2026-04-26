package com.example.BackEnd.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl") // 這個註解會讓 Spring 自動掃描並註冊這個類為一個 Bean，名稱為 "auditorAwareImpl"
public class AuditorAwareImpl implements AuditorAware<String> {
    // AuditorAware 「現在是誰在操作資料」
    // 提供「目前操作使用者是誰」給 JPA auditing，用來自動填 createdBy / updatedBy

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of("Anonymous User"); // 「目前一定有一個使用者，只是是預設的 Anonymous」
    }
}
