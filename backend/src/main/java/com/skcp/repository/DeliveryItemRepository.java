package com.skcp.repository;

import com.skcp.entity.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryItemRepository extends JpaRepository<DeliveryItem, Integer>
{

}


/*

# Purpose:
- The Repository Layer is responsible only for communicating with the database.
- It should never contain business logic.

# Extending JpaRepository:
JpaRepository<DeliveryItem, Integer>
-Spring Boot automatically provides:
    save()
    findAll()
    findById()
    deleteById()
    existsById()
    count()
    saveAll()
    deleteAll()
No SQL queries are required.

# Enterprise Architecture:
    Controller
        │
        ▼
    Service
        │
        ▼
    Repository
        │
        ▼
    PostgreSQL
Each layer has a single responsibility.

*/