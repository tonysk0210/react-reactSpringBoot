package com.example.backend.repository;

import com.example.backend.entity.Customer;
import com.example.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    // 取得購買紀錄
    List<Order> findByCustomerOrderByCreatedAtDesc(Customer customer);

    // 取得所有狀態為 CREATED 的訂單
    List<Order> findByOrderStatus(String orderStatus);

    /**
     * 1. JPQL 自定義查詢：根據 Customer entity 查詢該客戶的訂單，並依建立時間由新到舊排序。
     */
    // :customer 是 JPQL named parameter，會綁定到 method 上 @Param("customer") 傳入的 Customer 物件。
    @Query("SELECT o FROM Order o WHERE o.customer=:customer ORDER BY o.createdAt DESC")
    List<Order> findOrdersByCustomer(@Param("customer") Customer customer);

    // ?1 代表第一個參數
    @Query("SELECT o FROM Order o WHERE o.orderStatus=?1")
    List<Order> findOrdersByStatus(String orderStatus); // ?1 代表第一個參數

    /**
     * 2. Native SQL 自定義查詢：直接查詢 orders 資料表，根據 customer_id 找出訂單，並依 created_at 由新到舊排序。
     */
    // :customerId 是 SQL named parameter，會綁定到 method 上 @Param("customerId") 傳入的 Long id。
    @Query(value = "SELECT * FROM orders o WHERE o.customer_id=:customerId ORDER BY o.created_at DESC", nativeQuery = true)
    List<Order> findOrdersByCustomerWithNativeQuery(@Param("customerId") Long customerId);

    @Query(value = "SELECT * FROM orders o WHERE o.order_status=?1", nativeQuery = true)
    List<Order> findOrdersByStatusWithNativeQuery(String orderStatus);

    /**
     * JPQL:
     * SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.createdAt DESC
     * 看的是 Entity / Java field name。
     * <p>
     * Native SQL:
     * SELECT * FROM orders o WHERE o.customer_id = :customerId ORDER BY o.created_at DESC
     * 看的是 database table / column name。
     */

    // 更新訂單狀態
    // Bulk update 訂單狀態；@Modifying 表示這個 JPQL 會修改資料，@Transactional 讓更新在交易中執行。
    @Transactional
    @Modifying // Spring Data JPA 預設會把 @Query 當成查詢用
    @Query("UPDATE Order o SET o.orderStatus=:orderStatus, o.updatedAt=instant , o.updatedBy=:updatedBy WHERE o.id=:orderId")
    int updateOrderStatus(@Param("orderId") Long orderId,
                          @Param("orderStatus") String orderStatus,
                          @Param("updatedBy") String updatedBy);

}