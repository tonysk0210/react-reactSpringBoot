package com.example.backend.service.impl;

import com.example.backend.dto.PaymentResponseDto;
import com.example.backend.payload.PaymentRequestPayload;
import com.example.backend.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    @Override
    public PaymentResponseDto createPaymentIntent(PaymentRequestPayload paymentRequestPayload) {
        try {
            // 1. 建立付款意圖 PaymentIntent 時要傳給 Stripe 的參數
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequestPayload.amount())
                    .setCurrency(paymentRequestPayload.currency())
                    .addPaymentMethodType("card")
                    .build();

            // 2. 呼叫 Stripe API 建立付款意圖
            PaymentIntent paymentIntent = PaymentIntent.create(params); // 這行會向 Stripe 建立一筆付款意圖，所以需要 secret key 驗證身份。

            // 3. 回傳付款意圖的客戶端密鑰 ( Stripe 伺服器產生 -> 回傳給你的 Spring Boot 後端 -> 前端使用 )
            return new PaymentResponseDto(paymentIntent.getClientSecret()); // paymentIntent.getClientSecret() 是付款意圖的客戶端密鑰
        } catch (StripeException e) {
            log.error("建立 Stripe PaymentIntent 失敗: statusCode={}, code={}, message={}",
                    e.getStatusCode(),
                    e.getCode(),
                    e.getMessage());
            throw new RuntimeException("建立付款意圖失敗", e);
        }
    }
}
