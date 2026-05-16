package com.example.BackEnd.service.impl;

import com.example.BackEnd.constant.ApplicationConstants;
import com.example.BackEnd.dto.OrderItemResponseDto;
import com.example.BackEnd.dto.OrderResponseDto;
import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.entity.Order;
import com.example.BackEnd.entity.OrderItem;
import com.example.BackEnd.entity.Product;
import com.example.BackEnd.exception.ResourceNotFoundException;
import com.example.BackEnd.payload.OrderRequestPayload;
import com.example.BackEnd.repository.OrderRepo;
import com.example.BackEnd.repository.ProductRepo;
import com.example.BackEnd.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final ProfileServiceImpl profileServiceImpl;

    @Override
    public void createOrder(OrderRequestPayload orderRequestPayload) {
        // 1. 取得當前登入用戶的 Customer 物件
        Customer customer = profileServiceImpl.getAuthenticatedCustomer();

        // 2. 建立 Order Entity 物件
        Order order = new Order();
        order.setCustomer(customer);
        BeanUtils.copyProperties(orderRequestPayload, order); // totalPrice, paymentId, paymentStatus, orderItems
        order.setOrderStatus(ApplicationConstants.ORDER_STATUS_CREATED);
        // 2.1 遍歷 orderItems 並建立 OrderItem Entity 物件
        List<OrderItem> orderItems = orderRequestPayload.orderItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order); // 設定 OrderItem 所属的 Order -> 必要 (關係的「真正擁有方」是 OrderItem 這邊)，負責 FK ORDER_ID
                    Product product = productRepo.findById(item.productId()) // 取得 Product Optional
                            .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductID",
                                    item.productId().toString())); // 如果找不到 Product 則拋出 ResourceNotFoundException: 找不到符合條件的 Product，欄位 ProductID 的值為 item.productId()
                    orderItem.setProduct(product); // 設定 OrderItem 所属的 Product -> 必要 (關係的「真正擁有方」是 OrderItem 這邊)，負責 FK PRODUCT_ID
                    orderItem.setQuantity(item.quantity());
                    orderItem.setPrice(item.price());
                    return orderItem;
                }).collect(Collectors.toList()); // 將 Stream<OrderItem> 轉換成 List<OrderItem>
        order.setOrderItems(orderItems); // 設定 Order 持有的 OrderItems，讓 cascade save 可以一起儲存訂單明細

        //3. 儲存 Order Entity 物件，包含所有的 OrderItem
        orderRepo.save(order);
    }

    @Override
    public List<OrderResponseDto> getCustomerOrders() {
        // 1. 取得當前登入用戶的 Customer 物件
        Customer customer = profileServiceImpl.getAuthenticatedCustomer();

        // 2. 取得 Customer 的所有訂單
        List<Order> orders = orderRepo.findByCustomerOrderByCreatedAtDesc(customer);

        // 3. 將 Order 列表轉換成 OrderResponseDto 列表
        return orders.stream().map(this::mapToOrderResponseDTO).collect(Collectors.toList());
    }

    /* Helper method */
    // 將 Order 轉換成 OrderResponseDto
    private OrderResponseDto mapToOrderResponseDTO(Order order) {
        // 1. 取得 Order 的所有 OrderItem
        List<OrderItemResponseDto> orderItemsDTOs = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponseDTO)
                .collect(Collectors.toList());
        // 2. 建立 OrderResponseDto 物件
        OrderResponseDto orderResponseDto = new OrderResponseDto(
                order.getId(),
                order.getOrderStatus(),
                order.getTotalPrice(),
                order.getCreatedAt().toString(),
                orderItemsDTOs);

        return orderResponseDto;
    }

    // 將 OrderItem 轉換成 OrderItemResponseDto
    private OrderItemResponseDto mapToOrderItemResponseDTO(OrderItem orderItem) {
        // 1. 取得 OrderItem 的 Product 名稱、數量、價格及圖片 URL
        OrderItemResponseDto orderItemDto = new OrderItemResponseDto(
                orderItem.getProduct().getName(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getProduct().getImageUrl());

        return orderItemDto;
    }
}
