package com.example.BackEnd.repository;

import com.example.BackEnd.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact, Long> {
    List<Contact> findByStatus(String status);
}