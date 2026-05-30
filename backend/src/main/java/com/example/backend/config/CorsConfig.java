package com.example.backend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class CorsConfig {

    /**
     * CorsFilter 是 Spring Framework 提供的一個過濾器，用於處理跨域請求（CORS）。
     * 它會根據配置的 CORS 設置來攔截跨域請求，並在響應（Response）中添加相應的 CORS 標頭資訊。
     * 這些 Headers 就是由 CorsFilter 自動加上去的，用來告訴瀏覽器：「允許來自 http://localhost:5173 的前端讀取或發送此請求」。
     * 實際產生的 Response Header 範例：
     * Access-Control-Allow-Origin: http://localhost:5173
     */
    /*@Bean
    public CorsFilter getCorsFilter() {
        // 1. 創建一個 CorsConfiguration 物件，用於配置 CORS 設置
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173")); // 允許來自 http://localhost:5173/ 的跨域請求
        corsConfiguration.setAllowedMethods(List.of("*"));                     // 允許的 HTTP 方法，這裡使用 "*" 代表允許所有方法
        corsConfiguration.setAllowedHeaders(List.of("*"));                     // 允許的 HTTP 頭部
        corsConfiguration.setAllowCredentials(true);                           // 允許攜帶憑證（如 cookie / session）

        // 2. 創建一個 UrlBasedCorsConfigurationSource 物件，用於註冊 CORS 設置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);            // 所有 API 路徑都套用這個 CORS 設定

        // 3. 創建一個 CorsFilter 物件，用於處理 CORS 請求
        return new CorsFilter(source);                                          // 返回一個新的 CorsFilter 實例，在 request / response 階段自動處理 CORS
    }*/
}
