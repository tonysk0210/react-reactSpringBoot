package com.example.BackEnd.controller;

import com.example.BackEnd.dto.OrderResponseDto;
import com.example.BackEnd.payload.OrderRequestPayload;
import com.example.BackEnd.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> loadCustomerOrders() {
        return ResponseEntity.ok(orderService.getCustomerOrders());
    }

}
