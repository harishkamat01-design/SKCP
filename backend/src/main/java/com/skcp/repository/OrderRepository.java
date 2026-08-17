package com.skcp.repository;

import com.skcp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Get all Orders by Record Status
    List<Order> findByRecordStatus(String recordStatus);

    // Find Order by ID and Record Status
    Order findByOrderIdAndRecordStatus(
            Integer orderId,
            String recordStatus
    );
}



/*

Why these two methods?

They support our two separate concepts:

recordStatus → ACTIVE / INACTIVE → soft delete

orderStatus → PENDING / PARTIAL / COMPLETED / CANCELLED → business lifecycle

For example:
Order ID = 10
recordStatus = INACTIVE
orderStatus  = PENDING

That means:

The order was cancelled/deleted from the active records, 
but its business status remains PENDING in the historical record.
*/