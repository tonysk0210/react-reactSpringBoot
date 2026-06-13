package com.example.backend.security;

import com.example.backend.constant.ApplicationConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
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

/**
 * 這支 JWTTokenValidatorFilter.java 的核心用途是：
 * 每次 protected API request 進來時，檢查 Authorization header 裡的 JWT 是否有效；
 * 如果有效，就建立 Authentication 並放進 SecurityContextHolder，讓 Spring Security 後續可以判斷這個 request 是否已登入、有沒有角色權限。
 */
@Slf4j
@RequiredArgsConstructor
public class JWTTokenValidatorFilter extends OncePerRequestFilter { // extends OncePerRequestFilter 代表「同一個 request dispatch 過程中，只執行一次」

    private final AntPathMatcher pathMatcher = new AntPathMatcher(); // Spring Framework 提供的：路徑比對工具
    private final List<String> publicPaths; // 公開路徑清單

    // 檢查 JWT Token 並建立 Authentication 物件
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. 從 HTTP request 的 header 中，取得 JWT token 所在的 Authorization header。
        String authHeader = request.getHeader(ApplicationConstants.JWT_HEADER); // 取得 Bearer xxx.yyy.zzz

        if (null != authHeader) {
            try {
                // 2. 取得 前端 JWT token：xxx.yyy.zzz
                String jwt = authHeader.substring(7); // 移除 'Bearer ' 前綴

                // 3. 取得後端 JWT secret，準備驗證 token 簽章
                Environment env = getEnvironment();
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                        ApplicationConstants.JWT_SECRET_DEFAULT_VALUE); // 取得 JWT_SECRET_KEY 的環境變數值，如果不存在則使用預設值
                // 這行是在把「字串形式的 secret」轉成 JWT 簽章真正需要的 SecretKey 物件：後端可以確認這個 token 是不是自己簽出來的 後端可以確認 token 有沒有被人改過
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

                // 4. 驗證 & 解析 JWT token 並取得 JWT payload；如果驗證失敗，會進這些 catch：
                Claims claims = Jwts.parser().verifyWith(secretKey) // 用這個 secret 驗證 JWT signature
                        .build().parseSignedClaims(jwt) // 是不是 backend 自己簽的/payload 是否遭竄改/token expired ?
                        .getPayload(); // 取得 JWT payload

                /**
                 * {
                 *   "iss": "StickerStore",
                 *   "sub": "JWT Token",
                 *   "username": "Admin",
                 *   "email": "admin@gmail.com",
                 *   "mobileNumber": "0912345678",
                 *   "iat": 1710000000,
                 *   "exp": 1710003600
                 * }
                 */

                // 5. 取得 username 從 JWT payload
                String username = String.valueOf(claims.get("email"));
                String roles = String.valueOf(claims.get("roles"));

                // 6. 建立驗證過的 Authentication 物件
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        AuthorityUtils.commaSeparatedStringToAuthorityList(roles)); // 逗號分隔的字串轉成權限清單

                // 7. 設定 Authentication 物件到 Security Context，告訴 Spring Security：這個 request 已經通過身份驗證了。
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 兩個異常處理：直接在 filter 處理，因為 @RestControllerAdvice 無法捕獲 filter 層的異常，ErrorPage.jsx 會顯示
            } catch (ExpiredJwtException exception) {
                // JWT Token 已過期
                log.warn("JWT Token 已過期: {}", exception.getMessage());

                // 回應 401 狀態碼及 JSON 格式的錯誤訊息
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"errorMessage\": \"JWT Token 已過期！\"}");
                return; // 終止方法執行

            } catch (Exception exception) {
                // 無效的 Token (MalformedJwtException, SignatureException, etc.)
                log.warn("無效的 Token: {}", exception.getMessage());

                // 回應 401 狀態碼及 JSON 格式的錯誤訊息
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"errorMessage\": \"這是無效的 Token！\"}");
                return; // 終止方法執行
            }
        }
        filterChain.doFilter(request, response); // 繼續處理其他 filter: BasicAuthenticationFilter

    }

    @Override
    // 是否跳過 JWT 驗證 filter
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        // 1. 取得目前 request 要存取的 API 路徑，例如 /api/v1/auth/login
        String path = request.getRequestURI();

        // 2. 檢查 request 的路徑是否在 publicPaths 清單中: 如果 request path 是 public path，就跳過 JWT 驗證 filter，不跑 doFilterInternal()。
        return publicPaths.stream()
                .anyMatch(publicPath ->
                        pathMatcher.match(publicPath, path));
    }
}

