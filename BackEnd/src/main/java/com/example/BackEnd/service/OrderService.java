package com.example.BackEnd.service;

import com.example.BackEnd.payload.OrderRequestPayload;

public interface OrderService {
    void createOrder(OrderRequestPayload orderRequest);
}
