package com.skcp.repository;

import com.skcp.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer>
{
    boolean existsByPhoneAndStatus(
            String phone,
            String status
    );

    boolean existsByPhoneAndStatusAndSupplierIdNot(
            String phone,
            String status,
            Integer supplierId
    );
}