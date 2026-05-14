package com.example.BackEnd.controller;

import com.example.BackEnd.dto.PaymentResponseDto;
import com.example.BackEnd.payload.PaymentRequestPayload;
import com.example.BackEnd.service.PaymentService;
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

