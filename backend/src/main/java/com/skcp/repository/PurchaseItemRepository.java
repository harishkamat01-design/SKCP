package com.skcp.repository;

import com.skcp.entity.Purchase;
import com.skcp.entity.PurchaseItem;
import com.skcp.enums.RecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseItemRepository
        extends JpaRepository<PurchaseItem, Integer>
{

    // ============================================================
    // FIND ALL BY STATUS
    // ============================================================

    List<PurchaseItem> findByStatus(
            RecordStatus status
    );


    // ============================================================
    // FIND BY ID AND STATUS
    // ============================================================

    Optional<PurchaseItem> findByPurchaseItemIdAndStatus(
            Integer purchaseItemId,
            RecordStatus status
    );


    // ============================================================
    // FIND BY PURCHASE AND STATUS
    // ============================================================

    List<PurchaseItem> findByPurchaseAndStatus(
            Purchase purchase,
            RecordStatus status
    );

}


/* 
package com.skcp.repository;

import com.skcp.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Integer> 
{

}

*/