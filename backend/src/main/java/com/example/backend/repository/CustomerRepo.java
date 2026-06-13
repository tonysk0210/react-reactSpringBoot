package com.example.backend.repository;

import com.example.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Long> {
    // all derived 自定義的查詢方法
    Optional<Customer> findByEmailOrMobileNumber(String email, String mobileNumber); // 尋找電子郵件或手機號碼符合的顧客

    boolean existsByEmail(String email); // 尋找電子郵件符合的顧客是否存在

    boolean existsByMobileNumber(String mobileNumber); // 尋找手機號碼符合的顧客是否存在

    Optional<Customer> findByEmail(String email); // 尋找電子郵件符合的顧客


}