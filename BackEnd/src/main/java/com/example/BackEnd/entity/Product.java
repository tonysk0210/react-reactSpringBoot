package com.example.BackEnd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "PRODUCTS")
@NoArgsConstructor
public class Product extends BaseEntity {
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
}