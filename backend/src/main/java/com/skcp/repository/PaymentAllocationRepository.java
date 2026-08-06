package com.skcp.repository;

import com.skcp.entity.PaymentAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentAllocationRepository
        extends JpaRepository<PaymentAllocation, Integer>{
}

