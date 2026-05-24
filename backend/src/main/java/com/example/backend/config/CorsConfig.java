/*
package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    // WebMvcConfigurer 是 Spring MVC 提供的一個接口，用於配置 Spring MVC 的相關設置。
    // 通過實現 WebMvcConfigurer 接口，可以自定義 Spring MVC 的行為，例如添加攔截器、配置視圖解析器、設置 CORS 等等。
    // 在這裡，我們實現了 WebMvcConfigurer 接口，並且定義了一個 CorsFilter 的 Bean 來配置 CORS 設置。


    // CorsFilter 是 Spring Framework 提供的一個過濾器，用於處理跨域請求（CORS）。
    // 它會根據配置的 CORS 設置來處理跨域請求，並且添加相應的 CORS 頭部信息到響應中。
    // 這些 headers 就是 CorsFilter 加上去的，告訴瀏覽器：「localhost:5173 可以讀取這個回應」。
    // Response headers : Access-Control-Allow-Origin: http://localhost:5173
    @Bean
    public CorsFilter getCorsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173")); // 允許來自 http://localhost:5173/ 的跨域請求
        corsConfiguration.setAllowedMethods(List.of("*")); // 允許的 HTTP 方法，這裡使用 "*" 代表允許所有方法
        corsConfiguration.setAllowedHeaders(List.of("*")); // 允許的 HTTP 頭部
        corsConfiguration.setAllowCredentials(true); // 允許攜帶憑證（如 cookie / session）

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // 所有 API 路徑都套用這個 CORS 設定
        return new CorsFilter(source); // 返回一個新的 CorsFilter 實例，在 request / response 階段自動處理 CORS
    }
}
*/
