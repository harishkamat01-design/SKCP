package com.skcp.repository;

import com.skcp.entity.FinishedGoodsStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinishedGoodsStockRepository
        extends JpaRepository<FinishedGoodsStock, Integer> {

    // Get all active Finished Goods Stock records
    List<FinishedGoodsStock> findByRecordStatus(String recordStatus);

    // Get active Finished Goods Stock by ID
    Optional<FinishedGoodsStock> findByFinishedGoodsStockIdAndRecordStatus(
            Integer finishedGoodsStockId,
            String recordStatus
    );

    // Check whether a Product already has a Finished Goods Stock record
    boolean existsByProductProductIdAndRecordStatus(
        Integer productId,
        String recordStatus
);
}

/*

Final repository responsibilities

Method                                                  	Purpose
findByRecordStatus()	                        Return only records with the requested record_status
findByFinishedGoodsStockIdAndRecordStatus()	Get a stock record only if it has the requested record status
existsByProductProductIdAndRecordStatus()	Detect an existing stock record for a product with a specific record status

*/