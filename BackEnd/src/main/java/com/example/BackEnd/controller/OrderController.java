package com.example.BackEnd.controller;

import com.example.BackEnd.payload.OrderRequestPayload;
import com.example.BackEnd.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequestPayload orderRequestPayload) {
        orderService.createOrder(orderRequestPayload);
        return ResponseEntity.ok("訂單建立成功");
    }
}
