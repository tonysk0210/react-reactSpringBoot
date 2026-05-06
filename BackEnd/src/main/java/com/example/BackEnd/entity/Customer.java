package com.example.BackEnd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "CUSTOMERS")
public class Customer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMER_ID", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Size(max = 100)
    @NotNull
    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    @Size(max = 15)
    @NotNull
    @Column(name = "MOBILE_NUMBER", nullable = false, length = 15)
    private String mobileNumber;

    @Size(max = 500)
    @NotNull
    @Column(name = "PASSWORD_HASH", nullable = false, length = 500)
    private String passwordHash;


}