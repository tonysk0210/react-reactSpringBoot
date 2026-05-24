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

    @ManyToMany(mappedBy = "roles") //
    private Set<Customer> customers = new LinkedHashSet<>();

}