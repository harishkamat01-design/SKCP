package com.skcp.repository;

import com.skcp.entity.CuringStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}