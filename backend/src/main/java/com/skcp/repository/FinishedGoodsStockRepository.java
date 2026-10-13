package com.skcp.repository;

import com.skcp.entity.FinishedGoodsStock;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;  
import java.util.Optional;

@Repository
public interface FinishedGoodsStockRepository
        extends JpaRepository<FinishedGoodsStock, Integer> {

    // ==========================================================
    // GET ALL STOCK RECORDS BY RECORD STATUS
    // ==========================================================

    List<FinishedGoodsStock> findByRecordStatus(
            String recordStatus
    );

    // ==========================================================
    // GET STOCK BY ID AND RECORD STATUS
    // ==========================================================

    Optional<FinishedGoodsStock> findByFinishedGoodsStockIdAndRecordStatus(
            Integer finishedGoodsStockId,
            String recordStatus
    );

    // ==========================================================
    // FIND STOCK BY PRODUCT AND RECORD STATUS
    //
    // Pessimistic write lock protects an existing product's
    // stock balance during concurrent curing-stock transfers.
    // Must be called within a transaction.
    // ==========================================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<FinishedGoodsStock> findByProductProductIdAndRecordStatus(
            Integer productId,
            String recordStatus
    );

    // ==========================================================
    // CHECK WHETHER A PRODUCT HAS A RECORD WITH THIS STATUS
    // ==========================================================

    boolean existsByProductProductIdAndRecordStatus(
            Integer productId,
            String recordStatus
    );

    // ==========================================================
    // CHECK WHETHER A PRODUCT HAS ANY STOCK RECORD
    // Includes inactive records.
    // ==========================================================

    boolean existsByProductProductId(
            Integer productId
    );
}
