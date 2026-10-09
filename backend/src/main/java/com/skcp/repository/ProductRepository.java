package com.skcp.repository;

import com.skcp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    boolean existsByProductCode(String productCode);

    boolean existsByProductCodeAndProductIdNot(
            String productCode,
            Integer productId
    );
}