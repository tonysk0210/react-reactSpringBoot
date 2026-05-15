package com.example.BackEnd.entity;

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
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private Customer customer;

    // 這個欄位主要是提供 ORM 的雙向關聯、物件導覽與 cascade/orphan removal 功能，並不是 ORDERS 資料表中的實際欄位。
    // orphanRemoval = true : 當子物件從父物件的集合中被移除，子物件就會被刪除。
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>(); // 這段

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


}