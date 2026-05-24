package com.example.backend.repository;

import com.example.backend.entity.Role;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role, Long> {
    @Cacheable(value = "roles", key = "#name")
        // 將 findByName 方法的回傳值加入 cache 中，cache 名稱為 "roles"，key = name
    Optional<Role> findByName(String name);
}