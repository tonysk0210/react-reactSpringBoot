package com.example.backend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


/**
 * @Configuration 確實包含 @Component 的效果，所以它會讓 class 被 Spring 掃描並註冊成 Bean。
 * 但 @Configuration 還有額外語意：它表示這是一個 Spring 設定類別，特別是用來宣告 @Bean 方法。
 */
@Configuration
@PropertySource("classpath:stripe.properties") // 指定 properties 檔案路徑：stripe.properties 中取
public class StripeConfig {

    // @Value 綁定需要這個 StripeConfig 是 Spring Bean 才會生效。
    @Value("${stripe.apiKey}") // 從 stripe.properties 檔案中取得 Stripe API secret key 金鑰 (stripe.apikey)
    private String apiKey;

    @PostConstruct // Bean 建立並完成 @Value 注入後執行，設定 Stripe SDK 的 API key
    public void init() {
        Stripe.apiKey = apiKey;
    }
}
