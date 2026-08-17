
package com.skcp.repository;

import com.skcp.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    // =====================================================
    // FIND ACTIVE DELIVERIES
    // =====================================================

    List<Delivery> findByRecordStatus(String recordStatus);

    // =====================================================
    // FIND ACTIVE DELIVERY BY ID
    // =====================================================

    Optional<Delivery> findByDeliveryIdAndRecordStatus(
            Integer deliveryId,
            String recordStatus
    );

    // =====================================================
    // CHECK WHETHER AN ACTIVE DELIVERY EXISTS
    // =====================================================

    boolean existsByDeliveryIdAndRecordStatus(
            Integer deliveryId,
            String recordStatus
    );
}
