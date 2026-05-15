package com.example.BackEnd.payload;

import java.math.BigDecimal;
import java.util.List;


public record OrderRequestPayload(
        BigDecimal totalPrice,
        String paymentId,
        String paymentStatus,
        List<OrderItemRequestPayload> orderItems
) {
}
