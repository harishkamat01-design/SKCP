package com.skcp.repository;

import com.skcp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer>
{
    List<Customer> findByStatus(String status);

    boolean existsByMobileNumberAndStatus(
            String mobileNumber,
            String status
    );

    boolean existsByMobileNumberAndStatusAndCustomerIdNot(
            String mobileNumber,
            String status,
            Integer customerId
    );
}