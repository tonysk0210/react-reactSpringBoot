package com.example.backend.entity;

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
@MappedSuperclass // 這個 class 不是一張 table，但它的 mapping 欄位要被子類 Entity 繼承
@EntityListeners(AuditingEntityListener.class)
// 將 Spring Data JPA auditing listener 掛到繼承此類別的 entity lifecycle 上。
// 當 entity 新增或更新時，會自動填入 @CreatedDate、@CreatedBy、@LastModifiedDate、@LastModifiedBy 欄位。
public class BaseEntity {

    // updatable = false 代表這個欄位在更新時不會被修改
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    @CreatedDate // 靠 auditing 自動填時間
    private Instant createdAt;

    @Column(name = "CREATED_BY", nullable = false, length = 20, updatable = false)
    @CreatedBy // 靠 AuditorAwareImpl 提供 user
    private String createdBy;

    // insertable = false 代表這個欄位在新增時不會被填充，通常用於更新時自動填充的欄位
    @Column(name = "UPDATED_AT", insertable = false)
    @LastModifiedDate // 靠 auditing 自動填時間
    private Instant updatedAt;

    @Column(name = "UPDATED_BY", length = 20, insertable = false)
    @LastModifiedBy // 靠 AuditorAwareImpl 提供 user
    private String updatedBy;
}
/**
 * @EnableJpaAuditing = 打開 auditing 系統
 * @EntityListeners(AuditingEntityListener.class) = 讓某個 entity 在新增/更新時觸發 auditing
 * AuditorAwareImpl = 告訴 auditing 系統目前使用者是誰
 */