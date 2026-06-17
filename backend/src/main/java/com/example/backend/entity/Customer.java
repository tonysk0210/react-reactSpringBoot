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

    // @OneToOne：表示一對一關聯。(一個 Customer 對應 一個 Address)
    // mappedBy = "customer"：表示 Address 類中的 customer 欄位是對應到這個 Customer 類中的 id 欄位
    // cascade = CascadeType.ALL：表示如果 Customer 被刪除，那麼對應的 Address 也會被刪除 (JPA level rule)
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    private Address address;

    /*// Customer.roles 是 owning side。原因是：@JoinColumn 寫在 Customer 類中; customerRepo.save(customer);　→ 會寫入/更新 ROLES 表的 customer_id FK ✅
    // 單向 | 只有一邊有對方的欄位; 雙向 | 兩邊都有對方的欄位
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id", nullable = false) // ROLES 表裡面有一個 customer_id 欄位，用它來連回 CUSTOMERS。
    private Set<Role> roles = new LinkedHashSet<>(); // 不重複，而且保留加入順序*/

    // Customer 是 owning side，負責維護 customer_roles 中間表。
    // Role 是共用權限資料，不要加 CascadeType.REMOVE，避免刪除 Customer 時誤刪 ROLE_USER / ROLE_ADMIN。
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "customer_roles",
            joinColumns = @JoinColumn(name = "customer_id"), // customer_roles.customer_id -> CUSTOMERS.CUSTOMER_ID
            inverseJoinColumns = @JoinColumn(name = "role_id")) // customer_roles.role_id -> ROLES.ROLE_ID
    private Set<Role> roles = new LinkedHashSet<>();

    /**
     *
     * 有 mappedBy 的那一邊 = non-owning side
     * 有 @JoinColumn 的那一邊 = owning side
     *
     * @JoinColumn 是放在 JPA 關聯的 owning side
     * 不是單純照 Java 欄位所在的 table 判斷
     *
     * Unidirectional @OneToMany:
     * 因為 many side 沒有 Java 欄位，所以 @JoinColumn 只能放在 one side 的 collection 上。
     * 但實際 DB 外鍵仍然在 many side table。
     */

    /**
     * cascade = CascadeType.ALL
     *   -> JPA 操作時生效
     *   -> 例如 customerRepo.delete(customer)
     *   -> Hibernate 負責 cascade
     *
     * @OnDelete(action = CASCADE)
     *   -> DB foreign key 規則
     *   -> 即使直接用 SQL 刪 Customer，也可能由 DB 自動刪 Address
     *   -> database 負責 cascade
     */

}
