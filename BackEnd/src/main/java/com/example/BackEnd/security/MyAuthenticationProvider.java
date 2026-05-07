package com.example.BackEnd.security;

import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.repository.CustomerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MyAuthenticationProvider implements AuthenticationProvider {

    private final CustomerRepo customerRepo;
    private final PasswordEncoder passwordEncoder;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        // 1. 從 Authentication (尚未通過驗證) 物件中　取得使用者輸入的帳號密碼
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        // 2. 根據帳號從資料庫查詢使用者物件，如果找不到就丟出 UsernameNotFoundException
        Customer customer = customerRepo.findByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException(
                        "無法找到該使用者: " + username));



        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return false;
    }
}
