package com.example.BackEnd.service;

import com.example.BackEnd.dto.OrderResponseDto;
import com.example.BackEnd.entity.Order;
import com.example.BackEnd.payload.OrderRequestPayload;

import java.util.List;

public interface OrderService {
    void createOrder(OrderRequestPayload orderRequest);

    List<OrderResponseDto> getCustomerOrders();

    List<OrderResponseDto> getAllPendingOrders();

    Order updateOrderStatus(Long orderId, String orderStatus);
}
