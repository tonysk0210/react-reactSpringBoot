package com.example.BackEnd.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data // 這個註解會自動生成 getter、setter、toString、equals 和 hashCode 方法，讓代碼更簡潔
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer popularity;
    private String imageUrl;
    private Instant createdAt;
}
