package com.example.BackEnd.repository;

import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByCreatedAtDesc(Customer customer);
}