package com.skcp.repository;

import com.skcp.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

}

/*********************************************************************************
Explanation:

@Repository
- Marks this interface as a Spring Repository Bean.
- Enables Spring to detect it automatically during component scanning.
- Handles database-related exceptions by translating them into Spring exceptions.

JpaRepository<Purchase, Integer>
- Purchase → Entity class.
- Integer → Primary Key datatype (purchase_id).

By extending JpaRepository, Spring automatically provides:
findAll()
findById()
save()
deleteById()
existsById()
count()
No SQL queries are required for these standard CRUD operations.
**********************************************************************************/