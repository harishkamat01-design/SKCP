package com.skcp.repository;

import com.skcp.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository
        extends JpaRepository<OrderItem, Integer> {

    // Get all OrderItems by Record Status
    List<OrderItem> findByRecordStatus(String recordStatus);


    // Find OrderItem by ID and Record Status
    OrderItem findByOrderItemIdAndRecordStatus(
            Integer orderItemId,
            String recordStatus
    );
}