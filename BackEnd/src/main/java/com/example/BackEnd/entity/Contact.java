package com.example.BackEnd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "CONTACTS")
@NoArgsConstructor
/* Named Queries - for demonstration purposes: 定義一個有名字的 query，Repo method 才是「讓你可以透過 repository 呼叫它」*/
@NamedQuery(
        name = "Contact.findByStatusNamedQuery",
        query = "SELECT c FROM Contact c WHERE c.status = :status")
@NamedNativeQuery(
        name = "Contact.findByStatusWithNativeQuery",
        query = "SELECT * FROM contacts WHERE status = :status",
        resultClass = Contact.class) // 指定回傳的類型: 請把 SQL 查詢結果 mapping 成 Contact entity
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
