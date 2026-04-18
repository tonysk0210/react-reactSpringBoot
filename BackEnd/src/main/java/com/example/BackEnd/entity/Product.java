package com.example.BackEnd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "PRODUCTS")
@NoArgsConstructor
public class Product {
    @Id // 代表這個欄位是主鍵
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 代表這個欄位的值會自動生成，使用資料庫的自增功能
    @Column(name = "PRODUCT_ID", nullable = false)
    private Long id;

    @Column(name = "NAME", nullable = false, length = 250)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false, length = 500)
    private String description;

    @Column(name = "PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "POPULARITY", nullable = false)
    private Integer popularity;

    @Column(name = "IMAGE_URL", nullable = false, length = 500)
    private String imageUrl;

    @ColumnDefault("CURRENT_TIMESTAMP") // 預設值為當前時間戳 @ColumnDefault 是給「資料庫」看的
    @Column(name = "CREATED_AT", nullable = false)
    private Instant createdAt;

    @Column(name = "CREATED_BY", nullable = false, length = 20)
    private String createdBy;

    @ColumnDefault("NULL") // 預設值為 NULL
    @Column(name = "UPDATED_AT")
    private Instant updatedAt;
    
    @ColumnDefault("NULL") // 預設值為 NULL
    @Column(name = "UPDATED_BY", length = 20)
    private String updatedBy;
}