package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "ADDRESS")
public class Address extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADDRESS_ID", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    // @OneToOne：表示一對一關聯。(一個 Address 對應 一個 Customer)
    // fetch = FetchType.LAZY：查詢 Address 時，先不要立刻載入 Customer，等到呼叫 address.getCustomer() 時才載入
    // optional = false：這個關聯是必填的，也就是 Address 一定要有一個 Customer (database column rule)
    @OnDelete(action = OnDeleteAction.CASCADE) //Often on owning side
    // 如果某筆 Customer 被刪除，資料庫會自動刪除對應的 Address (database level rule)
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    // name = "CUSTOMER_ID"：外鍵欄位名稱叫 CUSTOMER_ID
    // nullable = false：這個欄位不能是 NULL (JPA rule)
    private Customer customer;

    @Size(max = 150)
    @NotNull
    @Column(name = "STREET", nullable = false, length = 150)
    private String street;

    @Size(max = 100)
    @NotNull
    @Column(name = "CITY", nullable = false, length = 100)
    private String city;

    @Size(max = 100)
    @NotNull
    @Column(name = "STATE", nullable = false, length = 100)
    private String state;

    @Size(max = 20)
    @NotNull
    @Column(name = "POSTAL_CODE", nullable = false, length = 20)
    private String postalCode;

    @Size(max = 100)
    @NotNull
    @Column(name = "COUNTRY", nullable = false, length = 100)
    private String country;
}