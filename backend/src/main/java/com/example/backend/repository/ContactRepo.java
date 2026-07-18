package com.example.backend.repository;

import com.example.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact, Long> {
    // 這是 derived query
    List<Contact> findByStatus(String status);

    /**
     * 使用 Spring Data JPA 預設查詢解析策略時：
     * <p>
     * 1. {@code findByStatus} 沒有標註 {@link Query}：
     * Spring 會先找名為 {@code Contact.findByStatus} 的 named query。
     * 本專案沒有定義這個 named query，所以 Spring 會根據
     * {@code findByStatus} 的 method 名稱自動產生查詢（derived query）。
     * <p>
     * 2. {@code fetchByStatus} 標註了 {@code @Query(name = ...)}：
     * Spring 會直接執行 Entity 上定義的
     * {@code Contact.findByStatusNamedQuery}。
     */
    // 明確指定使用 Contact entity 上定義的 Contact.findByStatusNamedQuery named query，這是 named query
    @Query(name = "Contact.findByStatusNamedQuery")
    List<Contact> fetchByStatus(String status);

    // method name 剛好匹配 Contact.findByStatusWithNativeQuery，因此可自動使用 named native query 不需要再加 @Query
    List<Contact> findByStatusWithNativeQuery(String status);
}
