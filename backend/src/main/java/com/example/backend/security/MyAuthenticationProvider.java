package com.example.backend.security;

import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import com.example.backend.repository.CustomerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class MyAuthenticationProvider implements AuthenticationProvider {

    private final CustomerRepo customerRepo;
    private final PasswordEncoder passwordEncoder;

    // 驗證使用者帳號密碼
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        // 1. 這 Authentication 是來自 UserNamePasswordAuthenticationToken : 從前端取得的帳號密碼
        String username = authentication.getName(); // 取得帳號
        String password = authentication.getCredentials().toString(); // 取得密碼

        // 2. 根據帳號從資料庫查詢使用者物件(email)，如果找不到就丟出 UsernameNotFoundException
        Customer customer = customerRepo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("無法找到該使用者: " + username)); // AuthenticationException

        Set<Role> roles = customer.getRoles();
        // 3. 將角色名稱轉換成 SimpleGrantedAuthority 並包裝成 List
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();

        // 4. 如果使用者輸入的密碼與存在資料庫中的密碼相符
        if (passwordEncoder.matches(password, customer.getPasswordHash())) {
            // 則回傳一個已通過驗證的 Authentication 物件 (三個參數版本代表「已驗證」)
            return new UsernamePasswordAuthenticationToken(
                    customer,
                    null,
                    authorities);
            // 代表密碼不重要，因為我們已經驗證過了
        } else {
            // 如果密碼錯誤，則丟出 BadCredentialsException
            throw new BadCredentialsException("密碼錯誤");
        }
    }

    // 這個 MyAuthenticationProvider 支援處理 UsernamePasswordAuthenticationToken 這種類型的 Authentication。
    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
