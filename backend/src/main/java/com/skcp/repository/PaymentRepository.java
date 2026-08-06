package com.skcp.repository;

import com.skcp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}

/*

# Purpose
The PaymentRepository is responsible for all database operations related to the Payment entity.
It acts as the Data Access Layer (DAL) in the SKCP architecture.

# Spring Data JPA
extends JpaRepository<Payment, Integer>
This provides all standard CRUD operations automatically.
No SQL queries need to be written.

# Available Methods
Without writing any code, Spring Boot provides:
    save()
    findAll()
    findById()
    deleteById()
    existsById()
    count()
    flush()
    saveAll()
No SQL Queries needed.

# Primary Key Mapping
JpaRepository<Payment, Integer>
- Payment → Entity
- Integer → Primary Key (payment_id)

# Why @Repository?

Benefits:
- Registers the interface as a Spring Bean.
- Enables Spring's exception translation.
- Improves readability by clearly identifying the persistence layer.

# Current Design
At this stage, the repository only uses inherited CRUD methods.
No custom queries are required.

*/