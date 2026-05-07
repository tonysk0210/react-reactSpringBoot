package com.example.BackEnd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.password.HaveIBeenPwnedRestApiPasswordChecker;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // 「我要開始用 Spring Security 保護我的 Web 應用」optional
public class MySecurityConfig {

    private final List<String> publicPaths;

    @Autowired
    public MySecurityConfig(@Qualifier("publicPaths") List<String> publicPaths) {
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

    // 有哪些使用者可以登入，以及他們的帳號、密碼和角色是什麼。
    // 自己定義的 UserDetailsService 通常會讓 (application.properties) spring.security.user.* 那組預設帳號設定失效。所以不是兩套一起並存，而是你手寫的那套會優先生效。
    // {noop} 這個密碼是明文，不做編碼。
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder().username("user")
                .password(passwordEncoder.encode("user")).roles("USER").build(); // 把原始密碼 user 先經過 passwordEncoder 編碼後再保存。
        UserDetails admin = User.builder().username("admin")
                .password("$2a$12$L51S8Z2JvzSN.pKQSXOgBOa6Iol5R5.dlOpFEkYO8i/J6UufT4TAa").roles("USER", "ADMIN").build(); // 把一串已經編碼好的 BCrypt 密碼寫進去。
        return new InMemoryUserDetailsManager(user, admin); // 使用者資料只存在記憶體裡
    }

    // 當 Spring Security 系統需要 PasswordEncoder 時，請使用 BCryptPasswordEncoder (會直接影響{noop}造成衝突: Encoded password does not look like BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // authenticationManager 這個 Bean 是在告訴 Spring Security：登入時，請用我的 UserDetailsService 找使用者，再用 BCryptPasswordEncoder 檢查密碼。
    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        var daoAuthenticationProvider = new DaoAuthenticationProvider(); // 負責驗證帳號密碼
        daoAuthenticationProvider.setUserDetailsService(userDetailsService); // 去哪裡找使用者資料
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder); // 怎麼比對密碼
        // 建立一個 AuthenticationManager，裡面使用剛剛設定好的 DaoAuthenticationProvider 來驗證登入。
        var providerManager = new ProviderManager(daoAuthenticationProvider);
        return providerManager;

        /**
         * •
         * AuthenticationManager = 驗證系統的總入口
         * •
         * ProviderManager = 調度員
         * •
         * DaoAuthenticationProvider = 專門處理帳密登入的驗證員
         * •
         * UserDetailsService = 去資料庫查使用者資料的人
         */
    }

    // 檢查密碼是否在「被竊取的密碼清單」裡面
    @Bean
    public CompromisedPasswordChecker compromisedPasswordChecker() {
        return new HaveIBeenPwnedRestApiPasswordChecker();
    }

}
