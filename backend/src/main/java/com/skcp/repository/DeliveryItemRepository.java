package com.skcp.repository;

import com.skcp.entity.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryItemRepository
        extends JpaRepository<DeliveryItem, Integer> {

    // =====================================================
    // FIND DELIVERY ITEM BY ID AND RECORD STATUS
    // =====================================================

    Optional<DeliveryItem> findByDeliveryItemIdAndRecordStatus(
            Integer deliveryItemId,
            String recordStatus
    );

    // =====================================================
    // FIND DELIVERY ITEMS BY RECORD STATUS
    // =====================================================

    List<DeliveryItem> findByRecordStatus(String recordStatus);
}