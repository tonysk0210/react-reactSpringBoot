package com.example.BackEnd.util;

import com.example.BackEnd.constant.ApplicationConstants;
import com.example.BackEnd.entity.Customer;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    // Environment 是 Spring 裡面已經內建好的 Bean / infrastructure object，可以被自動注入。
    private final Environment env;

    public String generateJwtToken(Authentication authentication) {
        String jwt = "";

        // 1. 先去設定檔 / 環境變數裡找 JWT_SECRET_KEY 這個設定值。如果找不到，就使用 JWT_SECRET_DEFAULT_VALUE 當預設值。
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE); //

        // 2. 這行是在把「字串形式的 secret」轉成 JWT 簽章真正需要的 SecretKey 物件：
        // 後端可以確認這個 token 是不是自己簽出來的 後端可以確認 token 有沒有被人改過
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        // 3. 這行是在從已驗證成功的 Authentication 裡面，拿出目前登入的使用者物件：
        Customer fetchedCustomer = (Customer) authentication.getPrincipal();
        /**
         * return new UsernamePasswordAuthenticationToken(
         *                     customer,
         *                     null,
         *                     Collections.emptyList());
         */

        // 4. 建立並簽發一個 JWT token 字串
        jwt = Jwts.builder().issuer("StickerStore") // 設定 JWT 的簽發者
                .subject("JWT Token") // 設定 JWT 的主題
                .claim("username", fetchedCustomer.getName()) // 加入一個自訂 claim。JWT payload 裡會有："username": "admin"
                .claim("email", fetchedCustomer.getEmail()) // 加入一個自訂 claim。JWT payload 裡會有："email": "admin@example.com"
                .claim("mobileNumber", fetchedCustomer.getMobileNumber()) // 加入一個自訂 claim。JWT payload 裡會有："mobileNumber": "0912345678"
                .issuedAt(new java.util.Date())
                .expiration(new java.util.Date((new java.util.Date()).getTime() + 60 * 60 * 1000)) // JWT 裡的欄位名稱通常是 exp; JWT 會在現在時間 + 1 小時後過期
                .signWith(secretKey).compact(); // 使用剛剛建立的 secretKey 對 JWT 簽章。這一步會產生 JWT 的 signature，用來防止 token 被竄改。
        return jwt;
    }
}

/*
=== JWT Header
{
  "alg": "HS256",
  "typ": "JWT"
}

=== JWT Payload
{
  "iss": "Eazy Store",
  "sub": "JWT Token",
  "username": "user",
  "iat": 1710000000,
  "exp": 1710003600
}
*/
