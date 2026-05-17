package com.example.BackEnd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Getter
@Setter
@MappedSuperclass // 讓子類共用欄位，但不建立資料表的父類
@EntityListeners(AuditingEntityListener.class)
// 讓 Spring Data JPA 的 auditing listener 介入處理。啟用審計功能，讓 @CreatedDate 和 @LastModifiedDate 能自動填充; 「當這個 Entity 發生 新增 / 更新 時，幫我自動處理一些欄位（例如時間）」
public class BaseEntity {

    // @ColumnDefault("CURRENT_TIMESTAMP") // 預設值為當前時間戳 @ColumnDefault 是給「資料庫」看的
    @Column(name = "CREATED_AT", nullable = false, updatable = false)  // updatable = false 代表這個欄位在更新時不會被修改
    @CreatedDate // 代表這個欄位會在 Entity 被新增時自動填充為當前時間 由 Spring Data JPA 控制
    // @CreationTimestamp // 代表這個欄位會在 Entity 被新增時自動填充為當前時間 由 Hibernate 控制
    private Instant createdAt;

    @Column(name = "CREATED_BY", nullable = false, length = 20, updatable = false) // updatable = false 代表這個欄位在更新時不會被修改
    @CreatedBy // 代表這個欄位會在 Entity 被新增時自動填充為當前使用者的名稱（需要配合 Spring Security 或其他認證機制）
    private String createdBy;

    // @ColumnDefault("NULL") // 預設值為 NULL
    @Column(name = "UPDATED_AT", insertable = false) // insertable = false 代表這個欄位在新增時不會被填充，通常用於更新時自動填充的欄位
    @LastModifiedDate // 代表這個欄位會在 Entity 被更新時自動填充為當前時間 由 Spring Data JPA 控制
    // @UpdateTimestamp // 代表這個欄位會在 Entity 被更新時自動填充為當前時間 由 Hibernate 控制
    private Instant updatedAt;

    // @ColumnDefault("NULL") // 預設值為 NULL
    @Column(name = "UPDATED_BY", length = 20, insertable = false) // insertable = false 代表這個欄位在新增時不會被填充，通常用於更新時自動填充的欄位
    @LastModifiedBy // 代表這個欄位會在 Entity 被更新時自動填充為當前使用者的名稱（需要配合 Spring Security 或其他認證機制）
    private String updatedBy;
}

/**
 * @EntityListeners(AuditingEntityListener.class) |
 * v
 * 啟用 auditing listener
 * |
 * v
 * @EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")
 * |
 * v
 * 指定使用 auditorAwareImpl
 * <p>
 * <p>
 * 簡單流程：
 * save(entity)
 * ↓
 * JPA 準備新增或更新 entity
 * ↓
 * AuditingEntityListener 被觸發
 * ↓
 * 看到 @CreatedDate / @CreatedBy / @LastModifiedDate / @LastModifiedBy
 * ↓
 * 自動填入時間與使用者
 * ↓
 * 寫入資料庫
 */
