package com.example.BackEnd.controller;

import com.example.BackEnd.constant.ApplicationConstants;
import com.example.BackEnd.dto.OrderResponseDto;
import com.example.BackEnd.dto.ResponseDto;
import com.example.BackEnd.entity.Order;
import com.example.BackEnd.service.ContactService;
import com.example.BackEnd.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final ContactService contactService;

    @GetMapping("/orderManage")
    public ResponseEntity<List<OrderResponseDto>> getAllPendingOrders() {
        return ResponseEntity.ok().body(orderService.getAllPendingOrders());
    }

    @PatchMapping("/orderManage/{orderId}/confirm")
    public ResponseEntity<ResponseDto> confirmOrder(@PathVariable Long orderId) {
        // 1. 更新訂單狀態為 CONFIRMED
        Order confirmedOrder = orderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CONFIRMED);
        return ResponseEntity.ok(
                new ResponseDto("200", "訂單 #" + confirmedOrder.getId() + " 已經確認.")
        );
    }

    @PatchMapping("/orderManage/{orderId}/cancel")
    public ResponseEntity<ResponseDto> cancelOrder(@PathVariable Long orderId) {
        // 1. 更新訂單狀態為 CANCELLED
        Order cancelledOrder = orderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CANCELLED);
        return ResponseEntity.ok(
                new ResponseDto("200", "訂單 #" + cancelledOrder.getId() + " 已經取消.")
        );
    }
}
