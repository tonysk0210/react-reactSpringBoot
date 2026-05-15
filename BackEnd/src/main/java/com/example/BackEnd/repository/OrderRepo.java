package com.example.BackEnd.repository;

import com.example.BackEnd.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, Long> {
}