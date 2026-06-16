package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Named Queries - for demo:
 * 定義一個有名字的 query，Repo method 才是「讓你可以透過 repository 呼叫它」
 */
@NamedQuery(
        name = "Contact.findByStatusNamedQuery",
        query = "SELECT c FROM Contact c WHERE c.status = :status")
@NamedNativeQuery(
        name = "Contact.findByStatusWithNativeQuery",
        query = "SELECT * FROM contacts WHERE status = :status",
        resultClass = Contact.class) // 指定回傳的類型: 請把 SQL 查詢結果 mapping 成 Contact entity
/**
 *  * @NamedQuery -> JPQL，看 Entity / Java field
 *  * @NamedNativeQuery -> SQL，看 table / column
 *  * name              -> query 的註冊名稱
 *  * :status           -> named parameter
 *  * resultClass       -> native SQL 結果要轉回哪個 Entity
 */

@Getter
@Setter
@Entity
@Table(name = "CONTACTS")
@NoArgsConstructor
public class Contact extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONTACT_ID", nullable = false)
    private Long id;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    @Column(name = "MOBILE_NUMBER", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "MESSAGE", nullable = false, length = 500)
    private String message;

    @Column(name = "STATUS", nullable = false, length = 50)
    private String status;
}
/**
 * @Query vs @NamedQuery / @NamedNativeQuery
 * <p>
 * @NamedQuery / @NamedNativeQuery = query 定義在 Entity 上，Repository 透過名字引用
 * @Query = query 直接定義在 Repository method 上
 */

/*
 * 簡單查詢：
 * List<Contact> findByStatus(String status);
 *
 * 稍微自訂但仍是 entity 查詢：
 * @Query JPQL
 *
 * 複雜 SQL / DB-specific 查詢：
 * @Query(nativeQuery = true)
 *
 * 需要命名、重用、展示 JPA named query 機制：
 * @NamedQuery / @NamedNativeQuery
 */