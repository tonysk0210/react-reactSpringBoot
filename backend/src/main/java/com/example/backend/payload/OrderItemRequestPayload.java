package com.example.backend.payload;

import java.math.BigDecimal;

public record OrderItemRequestPayload(
        Long productId,
        Integer quantity,
        BigDecimal price) {
}
