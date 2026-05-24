package com.example.backend.service;

import com.example.backend.dto.PaymentResponseDto;
import com.example.backend.payload.PaymentRequestPayload;

public interface PaymentService {
    PaymentResponseDto createPaymentIntent(PaymentRequestPayload paymentRequestPayload);
}
