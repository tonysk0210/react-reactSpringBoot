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
     * NamedQuery & NamedNativeQuery
     * <p>
     * 簡單規則：
     * Repo method: findByStatus
     * Spring 先找: Contact.findByStatus named query
     * 找得到 → 用 named query
     * 找不到 → 用 derived query
     */
    // 明確指定使用 Contact entity 上定義的 Contact.findByStatusNamedQuery named query
    @Query(name = "Contact.findByStatusNamedQuery")
    List<Contact> fetchByStatus(String status);

    // method name 剛好匹配 Contact.findByStatusWithNativeQuery，因此可自動使用 named native query 不需要再加 @Query
    List<Contact> findByStatusWithNativeQuery(String status);
}