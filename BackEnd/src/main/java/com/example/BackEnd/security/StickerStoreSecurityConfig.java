package com.example.BackEnd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // 「我要開始用 Spring Security 保護我的 Web 應用」optional
public class StickerStoreSecurityConfig {

    private final List<String> publicPaths;

    @Autowired
    public StickerStoreSecurityConfig(@Qualifier("publicPaths") List<String> publicPaths) {
        this.publicPaths = publicPaths;
    }

    // Filter = 可以攔截 HTTP request / response 並做前後處理的元件
    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrfConfig -> csrfConfig.disable()); // 把 Spring Security 的 CSRF 保護關掉。

        // 在 Spring Security 中開啟 CORS，並指定它使用 corsConfigurationSource() 這份跨域設定。
        http.cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()));

        http.authorizeHttpRequests((requests) -> {
            publicPaths.forEach(path ->
                    requests.requestMatchers(path).permitAll()); // publicPaths 裡面的路徑，全部公開
            requests.anyRequest().authenticated(); // 其他所有 request，都要登入
        });

        http.formLogin(withDefaults()); // 瀏覽器表單登入
        http.httpBasic(withDefaults()); // Client 在 HTTP request header 裡直接帶帳號密碼
        return http.build();
    }

    // CorsConfigurationSource = 提供「規則」（configuration provider 推薦搭配 Security）
    // 後端用來決定「要不要允許這個跨域請求」以及「要回哪些 CORS response headers」的規則
    // Browser（帶 Origin） → Server（判斷） → Server 回 CORS headers
    // 這些設定 = 後端告訴瀏覽器「哪些跨域請求是被允許的」
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("*")); // 允許哪些 HTTP method（GET / POST / PUT / DELETE）
        config.setAllowedHeaders(List.of("*")); // 允許前端 request 可以帶哪些 header
        config.setAllowCredentials(true); // 允許攜帶憑證（如 cookie / session）
        config.setMaxAge(3600L); // 瀏覽器對這個跨域授權檢查結果，可以記 1 小時。(CORS preflight（OPTIONS）結果可以被瀏覽器快取多久。)
        // OPTIONS預檢 = 瀏覽器在真正請求前，先問 server「這樣的 request 可以嗎？」

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
