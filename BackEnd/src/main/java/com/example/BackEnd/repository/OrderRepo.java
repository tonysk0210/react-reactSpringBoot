package com.example.BackEnd.repository;

import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Order> findByOrderStatus(String orderStatus);

    /* 自定義查詢 - 根據客戶查詢訂單 - JPQL query ( 參照 Entity class: Order) */
    // :customer 代表一個參數，名稱為 customer
    @Query("SELECT o FROM Order o WHERE o.customer=:customer ORDER BY o.createdAt DESC")
    List<Order> findOrdersByCustomer(@Param("customer") Customer customer);

    // ?1 代表第一個參數
    @Query("SELECT o FROM Order o WHERE o.orderStatus=?1")
    List<Order> findOrdersByStatus(String orderStatus);

    /*自定義查詢 - 根據客戶查詢訂單 - 原生 SQL query ( 參照 Database table: orders) */
    @Query(value = "SELECT * FROM orders o WHERE o.customer_id=:customerId ORDER BY o.created_at DESC", nativeQuery = true)
    List<Order> findOrdersByCustomerWithNativeQuery(@Param("customerId") Long customerId);

    @Query(value = "SELECT * FROM orders o WHERE o.order_status=?1", nativeQuery = true)
    List<Order> findOrdersByStatusWithNativeQuery(String orderStatus);


    // 更新訂單狀態
    @Transactional // 讓更新操作在 transaction 裡執行
    @Modifying // 表示這個查詢會修改資料庫 Spring Data JPA 預設會把 @Query 當成查詢用
    @Query("UPDATE Order o SET o.orderStatus=:orderStatus, o.updatedAt=instant , o.updatedBy=:updatedBy WHERE o.id=:orderId")
    int updateOrderStatus(@Param("orderId") Long orderId,
                          @Param("orderStatus") String orderStatus,
                          @Param("updatedBy") String updatedBy);

}