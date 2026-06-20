package com.example.backend.repository;

import com.example.backend.entity.Role;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role, Long> {
    // 將 findByName 方法的回傳值加入 cache 中，cache 名稱為 "roles"，key = name
    // value 和 key 是在描述「快取要放在哪裡」以及「用什麼名字找那筆快取」。
    @Cacheable(value = "roles", key = "#name")
    Optional<Role> findByName(String name);

    /**
     * 快取位置
     * cache name: roles
     * key: ROLE_USER
     * value: Optional<Role>
     *
     * roles
     *  ├── ROLE_USER  -> Optional<Role> for ROLE_USER
     *  └── ROLE_ADMIN -> Optional<Role> for ROLE_ADMIN
     *
     *  @Cacheable 可以放在需要快取「回傳結果」的方法上，但這個方法應該是查詢型、結果可重用、沒有副作用，並且要透過 Spring 管理的 bean/proxy 被呼叫。
     */
}