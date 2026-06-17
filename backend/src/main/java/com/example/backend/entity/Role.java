package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "ROLES")
public class Role extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROLE_ID", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NAME", nullable = false, length = 50)
    private String name;

    // Make it uni-directional relationship: 不會使用到 Role -> Customer
    /*@NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // 這表示當 Customer 被刪除時，相關的 Role 也會被刪除
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private Customer customer;*/

    @ManyToMany(mappedBy = "roles")
    private Set<Customer> customers = new LinkedHashSet<>();

    /**
     * mappedBy = "roles"： Role 告訴 JPA：「我不是負責維護關聯表的那一方，真正擁有這個關聯的是 Customer 裡面名叫 roles 的欄位。」
     * owning side 不一定代表「那個 entity table 本身一定擁有 FK 欄位」。owning side 的意思是：哪一邊負責維護資料庫中的關聯資料。
     */

}