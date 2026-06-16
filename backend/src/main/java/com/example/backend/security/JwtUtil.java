package com.example.backend.security;

import com.example.backend.constant.ApplicationConstants;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    // Environment 是 Spring Framework 內建的 infrastructure bean，Spring 容器啟動時就會提供它
    private final Environment env;

    /**
     * 登入成功後產生 JWT token 的方法
     */
    public String generateJwtToken(Authentication authentication) {
        String jwt = "";

        // 1. 從設定檔或環境變數讀取 JWT_SECRET_KEY 對應的密鑰字串；如果找不到，就使用 JWT_SECRET_DEFAULT_VALUE。
        // 例如 secret = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4"
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);

        // 2. 把「普通字串密鑰」轉成 JWT 函式庫可以拿來簽章的 SecretKey 物件。
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        // 3. 從「已登入成功的驗證結果」裡，取出目前登入的使用者資料。
        Customer fetchedCustomer = (Customer) authentication.getPrincipal();
        /**
         * AuthController.login
         * return new UsernamePasswordAuthenticationToken(
         *                     customer,
         *                     null,
         *                     Collections.emptyList());
         */

        // 4. 這段是在「建立 JWT 內容、設定過期時間、用 secretKey 簽章，最後轉成字串」。
        jwt = Jwts.builder().issuer("StickerStore") // 設定 JWT 的簽發者
                .subject("JWT Token") // 設定 JWT 的主題
                .claim("username", fetchedCustomer.getName())
                .claim("email", fetchedCustomer.getEmail())
                .claim("mobileNumber", fetchedCustomer.getMobileNumber())
                .claim("roles", fetchedCustomer.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.joining(",")))
                .issuedAt(new java.util.Date())
                .expiration(new java.util.Date(System.currentTimeMillis() + 1000L * 60 * 20)) // JWT 會在現在時間 + 10 分鐘後過期
                .signWith(secretKey).compact(); // 使用剛剛建立的 secretKey 對 JWT 簽章。這一步會產生 JWT 的 signature，用來防止 token 被竄改。
        return jwt;
    }
}

/**
 * JWT 構造
 * {
 * "header": {
 * "alg": "HS256"
 * },
 * "payload": {
 * "iss": "StickerStore",
 * "sub": "JWT Token",
 * "username": "John",
 * "email": "john@example.com",
 * "mobileNumber": "0912345678",
 * "roles": "USER",
 * "iat": 1710000000,
 * "exp": 1710003600
 * },
 * "signature": "用 secretKey 對 header + payload 算出來的簽章"
 * }
 */
