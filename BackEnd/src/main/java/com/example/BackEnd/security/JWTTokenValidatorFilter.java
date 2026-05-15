package com.example.BackEnd.security;

import com.example.BackEnd.constant.ApplicationConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RequiredArgsConstructor
public class JWTTokenValidatorFilter extends OncePerRequestFilter { // extends OncePerRequestFilter 代表「同一個 request dispatch 過程中，只執行一次」
    private final AntPathMatcher pathMatcher = new AntPathMatcher(); // Spring Framework 提供的：路徑比對工具
    private final List<String> publicPaths;

    // 告訴 Spring Security：這個 request 已經通過身份驗證了。
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. 從 HTTP request 的 header 中，取得 JWT token 所在的 Authorization header。
        String authHeader = request.getHeader(ApplicationConstants.JWT_HEADER);

        if (null != authHeader) {
            try {
                // 2. 取得 前端 JWT token
                String jwt = authHeader.substring(7); // 移除 'Bearer ' 前綴

                // 3. 取得後端 JWT secret，準備驗證 token 簽章
                Environment env = getEnvironment();
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                        ApplicationConstants.JWT_SECRET_DEFAULT_VALUE); // 取得 JWT_SECRET_KEY 的環境變數值，如果不存在則使用預設值
                // 這行是在把「字串形式的 secret」轉成 JWT 簽章真正需要的 SecretKey 物件：後端可以確認這個 token 是不是自己簽出來的 後端可以確認 token 有沒有被人改過
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

                // 4. 解析 JWT token
                Claims claims = Jwts.parser().verifyWith(secretKey) // 用這個 secret 驗證 JWT signature
                        .build().parseSignedClaims(jwt) // 是不是 backend 自己簽的/payload 是否遭竄改/token expired ?
                        .getPayload(); // 取得 JWT payload

                /**
                 * {
                 *   "iss": "StickerStore",
                 *   "sub": "JWT Token",
                 *   "username": "Tony",
                 *   "email": "tony@example.com",
                 *   "mobileNumber": "0912345678",
                 *   "iat": 1710000000,
                 *   "exp": 1710003600
                 * }
                 */

                // 5. 取得 username 從 JWT payload
                String username = String.valueOf(claims.get("email"));
                String roles = String.valueOf(claims.get("roles"));

                // 6. 建立 Authentication 物件
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        AuthorityUtils.commaSeparatedStringToAuthorityList(roles)); // 逗號分隔的字串轉成權限清單

                // 7. 設定 Authentication 物件到 Security Context，告訴 Spring Security：這個 request 已經通過身份驗證了。
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (ExpiredJwtException exception) {
                // JWT Token 已過期
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"JWT Token 已過期！\"}");
                return; // 終止方法執行
            } catch (BadCredentialsException exception) {
                // 無效的 Token - 直接在 filter 處理，因為 @RestControllerAdvice 無法捕獲 filter 層的異常
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"這是無效的 Token！\"}");
                return; // 終止方法執行
            }
        }
        filterChain.doFilter(request, response); // 繼續處理其他 filter: BasicAuthenticationFilter

    }

    @Override
    // 告訴 Spring Security：這個 request 不需要通過身份驗證。
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        String path = request.getRequestURI(); // 取得 request 的路徑

        // 檢查 request 的路徑是否在 publicPaths 清單中: 如果目前 request path 符合任何 public path pattern → return true 不做 JWT 驗證
        return publicPaths.stream()
                .anyMatch(publicPath ->
                        pathMatcher.match(publicPath, path));
    }
}

