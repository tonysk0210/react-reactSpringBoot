package com.example.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
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
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // 「我要開始用 Spring Security 保護我的 Web 應用」optional
public class MySecurityConfig {

    private final List<String> publicPaths;

    @Value("${stickerstore.cors.allowed-origins}") // 從 application.properties 檔案中取得跨域設定
    private String allowedOrigins;

    @Autowired
    public MySecurityConfig(@Qualifier("publicPaths") List<String> publicPaths) {
        this.publicPaths = publicPaths;
    }

    // SecurityFilterChain = 建立一條自訂的 Spring Security 過濾鏈，告訴 Spring Security 每個 HTTP request 要經過哪些安全檢查。
    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        //http.csrf(csrfConfig -> csrfConfig.disable()); // 把 Spring Security 的 CSRF 保護關掉。

        // 將 CSRF Token 存到 Cookie，Cookie 名稱預設是 XSRF-TOKEN。
        // withHttpOnlyFalse() 代表允許前端 JavaScript 讀取這個 Cookie。
        // 前端在送 POST / PUT / DELETE 等非安全請求時，
        // 需要把這個 token 放到 request header：X-XSRF-TOKEN。
        // Spring Security 會比對 header 裡的 token 是否正確，正確才放行。CSRF：確認發出請求的人真的是已登入使用者本人，而不是惡意網站代發。
        http.csrf(csrfConfig ->
                csrfConfig.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // 儲存/取得 token
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()) // 將 CSRF Token 放進 request attribute（例如 _csrf）， 方便讓 Controller、Filter、Thymeleaf、JSP 等可以透過 request 取得 token。
                        .ignoringRequestMatchers("/api/v1/contacts", "/api/v1/contacts/**"));


        // 2. 在 Spring Security 中開啟 CORS，並指定它使用 corsConfigurationSource() 這份跨域設定。CORS：限制哪些網站可以存取我的 API。
        http.cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()));

        // 3. 設定哪些路徑不需要驗證；越具體、越嚴格的規則放前面；越籠統、fallback 的規則放後面；anyRequest() 永遠放最後
        http.authorizeHttpRequests((request) -> {
            // 公開路徑
            publicPaths.forEach(path ->
                    request.requestMatchers(path).permitAll());
            // 限制路徑：需要 ADMIN 角色
            request.requestMatchers(
                    "/api/v1/admin/**",
                    "/actuator/**",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**").hasRole("ADMIN");
            // 其他路徑：需要 USER 或 ADMIN 角色
            request.anyRequest().hasAnyRole("USER", "ADMIN");
        });

        // 把自訂 JWT 驗證 Filter 插入到 Spring Security filter chain 中， 並且在 BasicAuthenticationFilter 前執行。
        http.addFilterBefore(new JWTTokenValidatorFilter(publicPaths), BasicAuthenticationFilter.class);

        http.formLogin(withDefaults()); // 瀏覽器表單登入
        http.httpBasic(withDefaults()); // Client 在 HTTP request header 裡直接帶帳號密碼
        return http.build();
    }

    // CorsConfigurationSource = 提供 CORS 規則給 Spring Security 使用。
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // 1. 創建一個 CorsConfiguration 物件，用於配置 CORS 設置
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(","))); // 允許哪些來源的請求，例如 http://localhost:5173。
        config.setAllowedMethods(List.of("*")); // 允許哪些 HTTP method，例如 GET / POST / PUT / DELETE / OPTIONS。
        config.setAllowedHeaders(List.of("*")); // 允許前端 request 可以帶哪些 header
        config.setAllowCredentials(true); // 允許瀏覽器在跨來源 request 攜帶 credentials，例如 cookies、HTTP auth。這需要前端也設定 axios withCredentials: true，否則瀏覽器仍不會送 cookies。
        config.setMaxAge(3600L); // preflight OPTIONS 檢查結果可被瀏覽器快取 3600 秒，減少重複預檢請求。

        // 2. 創建一個 UrlBasedCorsConfigurationSource 物件，用於註冊 CORS 設置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 將這組 CORS 規則套用到所有後端路徑。
        return source;
    }

    // UserDetailsService = 用於從資料庫或記憶體中取得使用者資料。注意：目前專案的實際登入流程是走 MyAuthenticationProvider，這個 bean 不參與現行登入驗證。
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder.encode("user"))
                .roles("USER").build(); // 把原始密碼 user 先經過 passwordEncoder 編碼後再保存。
        UserDetails admin = User.builder()
                .username("admin")
                .password("$2a$12$L51S8Z2JvzSN.pKQSXOgBOa6Iol5R5.dlOpFEkYO8i/J6UufT4TAa") // 把一串已經編碼好的 BCrypt 密碼寫進去。original t ext: admin
                .roles("USER", "ADMIN").build();
        return new InMemoryUserDetailsManager(user, admin); // 使用者資料只存在記憶體裡
    }

    // PasswordEncoder = 當 Spring Security 系統需要 PasswordEncoder 時，請使用 BCryptPasswordEncoder (會直接影響{noop}造成衝突: Encoded password does not look like BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // authenticationManager 這個 Bean 是在告訴 Spring Security：登入時，請用我的 UserDetailsService 找使用者，再用 BCryptPasswordEncoder 檢查密碼。
    // #2. 自定義 AuthenticationManager 作為 Spring Security 的驗證系統
    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, MyAuthenticationProvider authenticationProvider) {

        /*// 1. 提供一個 DaoAuthenticationProvider 來處理帳密登入的驗證流程
        var daoAuthenticationProvider = new DaoAuthenticationProvider(); // 1. 負責 username/password 登入驗證流程
        daoAuthenticationProvider.setUserDetailsService(userDetailsService); // 2. 指定它要透過哪個 UserDetailsService 取得使用者資料
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder); // 3. 指定它要用哪個 PasswordEncoder 比對密碼*/

        // 2. 建立一個 AuthenticationManager，套用剛剛設定好的 MyAuthenticationProvider 來管理驗證提供者
        var providerManager = new ProviderManager(authenticationProvider); // 這個 AuthenticationManager 調度員 會使用 DaoAuthenticationProvider 來驗證登入
        return providerManager;
    }

    // 檢查密碼是否在「被竊取的密碼清單」裡面
    @Bean
    public CompromisedPasswordChecker compromisedPasswordChecker() {
        return new HaveIBeenPwnedRestApiPasswordChecker();
    }

}
