
package com.skcp.repository;

import com.skcp.entity.RawMaterialStock;
import com.skcp.enums.RecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RawMaterialStockRepository
        extends JpaRepository<RawMaterialStock, Integer> {

    // ============================================================
    // GET ALL ACTIVE STOCK RECORDS
    // ============================================================

    List<RawMaterialStock> findByRecordStatus(
            RecordStatus recordStatus
    );


    // ============================================================
    // GET ACTIVE STOCK RECORD BY ID
    // ============================================================

    Optional<RawMaterialStock> findByRawMaterialStockIdAndRecordStatus(
            Integer rawMaterialStockId,
            RecordStatus recordStatus
    );


    // ============================================================
    // CHECK WHETHER ACTIVE STOCK EXISTS FOR RAW MATERIAL
    // ============================================================

    boolean existsByRawMaterialRawMaterialIdAndRecordStatus(
            Integer rawMaterialId,
            RecordStatus recordStatus
    );
}


/*
package com.skcp.repository;

import com.skcp.entity.RawMaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawMaterialStockRepository extends JpaRepository<RawMaterialStock, Integer> {

}

*/