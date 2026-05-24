package com.example.backend.service;

import com.example.backend.dto.OrderResponseDto;
import com.example.backend.entity.Order;
import com.example.backend.payload.OrderRequestPayload;

import java.util.List;

public interface OrderService {
    void createOrder(OrderRequestPayload orderRequest);

    List<OrderResponseDto> getCustomerOrders();

    List<OrderResponseDto> getAllPendingOrders();

    Order updateOrderStatus(Long orderId, String orderStatus);
}
