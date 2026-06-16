package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "ORDERS")
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ID", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT) // 當資料庫裡有 Order 指向某個 Customer 時，不允許刪除那個 Customer。Order 一定要有 Customer，不能是 null
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private Customer customer;

    // mappedBy = "order"：表示這個 OneToMany 關聯由 OrderItem 類別中的 order 欄位維護；FK 在 OrderItem 對應的資料表中。
    // orphanRemoval = true：當已被管理的 OrderItem 從 orderItems 集合中被移除時，JPA 會刪除該子物件。
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @NotNull
    @Column(name = "TOTAL_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Size(max = 200)
    @NotNull
    @Column(name = "PAYMENT_ID", nullable = false, length = 200)
    private String paymentId;

    @Size(max = 50)
    @NotNull
    @Column(name = "PAYMENT_STATUS", nullable = false, length = 50)
    private String paymentStatus;

    @Size(max = 50)
    @NotNull
    @Column(name = "ORDER_STATUS", nullable = false, length = 50)
    private String orderStatus;

    /**
     * CascadeType.REMOVE vs orphanRemoval = true
     *
     * CascadeType.REMOVE:
     * 刪 parent entity 時，連帶刪 child entity。
     * - 觸發點：刪除 parent
     * - 例子：delete(order)
     * - 結果：orderItems 一起被刪除
     *
     * orphanRemoval = true
     * 不刪 parent，只要 child 被從 parent 的關聯中移除，就刪 child entity。
     * - 觸發點：child 從 parent collection / relationship 中被移除
     * - 例子：order.getOrderItems().remove(item)
     * - 結果：那個 item 被刪除
     */

}