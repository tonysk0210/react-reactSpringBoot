package com.example.BackEnd.config;

import com.example.BackEnd.entity.Customer;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl") // 這個註解會讓 Spring 自動掃描並註冊這個類為一個 Bean，名稱為 "auditorAwareImpl"
public class AuditorAwareImpl implements AuditorAware<String> {
    // AuditorAware 「現在是誰在操作資料」
    // 提供「目前操作使用者是誰」給 JPA auditing，用來自動填 createdBy / updatedBy

    @Override
    public Optional<String> getCurrentAuditor() {
        // return Optional.of("Anonymous User"); // 「目前一定有一個使用者，只是是預設的 Anonymous」

        // 1. 從 Spring Security 取得目前登入資訊：SecurityContextHolder 裡面會存放目前 request 的登入使用者。
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. 檢查是否有/authentication，如果沒有登入，或是 anonymous user，就回傳 "Anonymous user"；所以 createdBy 或 updatedBy 會被填成 "Anonymous user"
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.of("SYSTEM");
        }

        // 3. 如果有登入，就取得目前使用者身份：
        Object principal = authentication.getPrincipal();
        String username;

        // 4. 如果是 Customer 類型，就取 email 當 username；否則就用 toString() 當 username ( MyAuthenticationProvider.java 是把整個 Customer 放進 Authentication 裡面  )
        if (principal instanceof Customer customer) {
            username = customer.getEmail(); // 只有 login 的 principal 才是 Customer
            /**
             * return new UsernamePasswordAuthenticationToken(
             *                     customer,
             *                     null,
             *                     Collections.emptyList());
             */
        } else {
            username = principal.toString(); // Protected Route 的 principal 都是 String (username = email)
            /**
             *Authentication authentication = new UsernamePasswordAuthenticationToken(
             *                         username,
             *                         null,
             *                         Collections.emptyList());
             */
        }

        return Optional.of(username);
    }
}
