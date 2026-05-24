package com.example.backend.repository;

import com.example.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact, Long> {
    List<Contact> findByStatus(String status);

    /**
     * 簡單規則：
     * Repo method: findByStatus
     * Spring 先找: Contact.findByStatus named query
     * 找得到 → 用 named query
     * 找不到 → 用 derived query
     */
    /*　Named Queries - for demonstration purposes　*/
    @Query(name = "Contact.findByStatusNamedQuery")
    // 這個 method 要使用 Contact.findByStatus 這個 named query
    List<Contact> fetchByStatus(String status);


    // @Query 可以省，因為 method name 剛好匹配：Contact.findByStatusWithNativeQuery
    List<Contact> findByStatusWithNativeQuery(String status);
}