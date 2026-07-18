package com.example.backend.config;

import com.example.backend.entity.Customer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl") // 這個註解會讓 Spring 自動掃描並註冊這個類為一個 Bean，名稱為 "auditorAwareImpl"
@Slf4j
public class AuditorAwareImpl implements AuditorAware<String> {
    // AuditorAware 「現在是誰在操作資料」提供「目前操作使用者是誰」專給 JPA auditing，用來自動填 createdBy / updatedBy

    // 實作 getCurrentAuditor() 方法，回傳目前登入使用者的 username
    @Override
    public Optional<String> getCurrentAuditor() {

        // 1. 從 Spring Security 取得目前登入資訊：SecurityContextHolder 裡面會存放目前 request 的登入使用者。
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. 如果沒有登入，或是 anonymousUser (Spring Security by default)，就回傳 "SYSTEM"；所以 createdBy 或 updatedBy 會被填成 "SYSTEM"
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            log.info("AuditorAwareImpl 目前稽核操作者：SYSTEM");
            return Optional.of("SYSTEM");
        }

        // 3. 如果有登入，就取得目前使用者身份：
        Object principal = authentication.getPrincipal();
        String username;

        // 4. 如果是 Customer 類型，就取 email 當 user
        //  name；否則就用 toString() 當 username ( MyAuthenticationProvider.java 是把整個 Customer 放進 Authentication 裡面  )
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

        log.info("AuditorAwareImpl 目前稽核操作者：{}", username);

        // 2. 回傳 username
        return Optional.of(username);
    }
}
