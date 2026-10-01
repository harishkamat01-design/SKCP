package com.skcp.repository;

import com.skcp.entity.PaymentAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentAllocationRepository
        extends JpaRepository<PaymentAllocation, Integer> {

    // Get all PaymentAllocations for an Order by Record Status
    List<PaymentAllocation> findByOrderOrderIdAndRecordStatus(
            Integer orderId,
            String recordStatus
    );
}