
package com.skcp.repository;

import com.skcp.entity.RawMaterialStock;
import com.skcp.enums.RecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RawMaterialStockRepository
        extends JpaRepository<RawMaterialStock, Integer> {

    List<RawMaterialStock> findByRecordStatus(
            RecordStatus recordStatus
    );

    Optional<RawMaterialStock> findByRawMaterialStockIdAndRecordStatus(
            Integer rawMaterialStockId,
            RecordStatus recordStatus
    );

    // Check whether this material already has a record for this date.
    boolean existsByRawMaterialRawMaterialIdAndStockDate(
            Integer rawMaterialId,
            LocalDate stockDate
    );

    // Check for a duplicate while excluding the record being edited.
    boolean existsByRawMaterialRawMaterialIdAndStockDateAndRawMaterialStockIdNot(
            Integer rawMaterialId,
            LocalDate stockDate,
            Integer rawMaterialStockId
    );
}