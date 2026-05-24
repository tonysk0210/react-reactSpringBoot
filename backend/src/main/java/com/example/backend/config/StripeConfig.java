package com.example.backend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:stripe.properties") // 指定 properties 檔案路徑
public class StripeConfig {

    @Value("${stripe.apiKey}") // 從application.properties檔案中取得 Stripe API 金鑰
    private String apiKey;

    @PostConstruct // 初始化方法，在 Spring 容器初始化 Bean 時執行，建立 Stripe 金鑰
    public void init() {
        Stripe.apiKey = apiKey;
    }
}
