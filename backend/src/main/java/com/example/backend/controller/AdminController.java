package com.example.backend.controller;

import com.example.backend.constant.ApplicationConstants;
import com.example.backend.dto.ContactResponseDto;
import com.example.backend.dto.OrderResponseDto;
import com.example.backend.dto.ResponseDto;
import com.example.backend.entity.Order;
import com.example.backend.service.ContactService;
import com.example.backend.service.OrderService;
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

    /**
     * 確認訂單 CONFIRMED
     */
    @PatchMapping("/orderManage/{orderId}/confirm")
    public ResponseEntity<ResponseDto> confirmOrder(@PathVariable Long orderId) {
        // 1. 更新訂單狀態為 CONFIRMED
        Order confirmedOrder = orderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CONFIRMED);
        return ResponseEntity.ok(
                new ResponseDto("200", "訂單 #" + confirmedOrder.getId() + " 已經確認成功.")
        );
    }

    /**
     * 取消訂單 CANCELLED
     */
    @PatchMapping("/orderManage/{orderId}/cancel")
    public ResponseEntity<ResponseDto> cancelOrder(@PathVariable Long orderId) {
        // 1. 更新訂單狀態為 CANCELLED
        Order cancelledOrder = orderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CANCELLED);
        return ResponseEntity.ok(
                new ResponseDto("200", "訂單 #" + cancelledOrder.getId() + " 已經取消成功.")
        );
    }

    /**
     * 取得所有未讀取的留言
     */
    @GetMapping("/messages")
    public ResponseEntity<List<ContactResponseDto>> getAllOpenMessages() {
        return ResponseEntity.ok(contactService.getAllOpenMessages());
    }

    /**
     * 關閉留言 CLOSED
     */
    @PatchMapping("/messages/{contactId}/close")
    public ResponseEntity<ResponseDto> closeMessage(@PathVariable Long contactId) {
        // 1. 更新留言狀態為 CLOSED
        contactService.updateMessageStatus(contactId, ApplicationConstants.CLOSED_MESSAGE);
        // 2. 回應成功
        return ResponseEntity.ok(
                new ResponseDto("200", "留言 #" + contactId + " 已讀取，將此信息狀態更新為 CLOSED.")
        );
    }
}
