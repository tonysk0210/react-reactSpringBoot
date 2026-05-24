package com.example.backend.controller;

import com.example.backend.dto.PaymentResponseDto;
import com.example.backend.payload.PaymentRequestPayload;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponseDto> createPaymentIntent(@RequestBody PaymentRequestPayload paymentRequest) {
        PaymentResponseDto response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }
}

