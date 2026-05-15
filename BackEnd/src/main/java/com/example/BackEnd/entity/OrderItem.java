package com.example.BackEnd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "ORDER_ITEMS")
public class OrderItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ITEM_ID", nullable = false)
    private Long id;

    // Order 1 --- * OrderItem * --- 1 Product

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT) //  OrderItem 指向某筆 Order，資料庫會禁止刪除那筆 Order。 因為歷史訂單需要保留訂單紀錄，不應該因為訂單被刪除而讓訂單明細資料壞掉。
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT) //  OrderItem 指向某筆 Product，資料庫會禁止刪除那筆 Product。 因為歷史訂單明細需要保留商品紀錄，不應該因為商品被刪除而讓訂單資料壞掉。
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;


}