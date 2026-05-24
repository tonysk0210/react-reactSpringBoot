package com.example.backend.payload;

import java.math.BigDecimal;
import java.util.List;


public record OrderRequestPayload(
        BigDecimal totalPrice,
        String paymentId,
        String paymentStatus,
        List<OrderItemRequestPayload> orderItems
) {
}
