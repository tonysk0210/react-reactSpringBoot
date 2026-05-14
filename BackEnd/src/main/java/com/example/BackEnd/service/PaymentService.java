package com.example.BackEnd.service;

import com.example.BackEnd.dto.PaymentResponseDto;
import com.example.BackEnd.payload.PaymentRequestPayload;

public interface PaymentService {
    PaymentResponseDto createPaymentIntent(PaymentRequestPayload paymentRequestPayload);
}
