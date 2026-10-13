package com.skcp.repository;

import com.skcp.entity.CuringStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuringStockRepository
        extends JpaRepository<CuringStock, Integer> {

    List<CuringStock> findByRecordStatus(String recordStatus);

    Optional<CuringStock> findByCuringStockIdAndRecordStatus(
            Integer curingStockId,
            String recordStatus
    );

    // Prevent duplicate curing records for the same production.
    boolean existsByProductionProductionId(
            Integer productionId
    );

    Optional<CuringStock> findByProductionProductionId(
            Integer productionId
    );

    Optional<CuringStock> findByProductionProductionIdAndRecordStatus(
            Integer productionId,
            String recordStatus
    );

    // Lock the curing batch while transferring it to finished goods.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<CuringStock> findWithLockByCuringStockIdAndRecordStatus(
            Integer curingStockId,
            String recordStatus
    );
}
