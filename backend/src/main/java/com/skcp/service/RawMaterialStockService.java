package com.skcp.service;

import com.skcp.dto.request.rawmaterialstock.RawMaterialStockCreateRequest;
import com.skcp.dto.request.rawmaterialstock.RawMaterialStockUpdateRequest;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockResponse;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockSummaryResponse;
import com.skcp.entity.RawMaterial;
import com.skcp.entity.RawMaterialStock;
import com.skcp.enums.RawMaterialStockStatus;
import com.skcp.enums.RecordStatus;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.RawMaterialStockMapper;
import com.skcp.repository.RawMaterialRepository;
import com.skcp.repository.RawMaterialStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RawMaterialStockService {

    private final RawMaterialStockRepository rawMaterialStockRepository;
    private final RawMaterialRepository rawMaterialRepository;

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public RawMaterialStockService(
            RawMaterialStockRepository rawMaterialStockRepository,
            RawMaterialRepository rawMaterialRepository) {

        this.rawMaterialStockRepository = rawMaterialStockRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    // ============================================================
    // GET ALL ACTIVE RAW MATERIAL STOCK
    // ============================================================

    public List<RawMaterialStockSummaryResponse> getAllRawMaterialStock() {

        return rawMaterialStockRepository
                .findByRecordStatus(RecordStatus.ACTIVE)
                .stream()
                .map(RawMaterialStockMapper::toSummaryResponse)
                .toList();
    }

    // ============================================================
    // GET ACTIVE RAW MATERIAL STOCK BY ID
    // ============================================================

    public RawMaterialStockResponse getRawMaterialStockById(Integer id) {

        RawMaterialStock stock =
                rawMaterialStockRepository
                        .findByRawMaterialStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material stock not found with id: "
                                                + id
                                )
                        );

        return RawMaterialStockMapper.toResponse(stock);
    }

    // ============================================================
    // CREATE RAW MATERIAL STOCK
    // ============================================================

    @Transactional
    public RawMaterialStockResponse createRawMaterialStock(
            RawMaterialStockCreateRequest request) {

        // --------------------------------------------------------
        // FIND PARENT RAW MATERIAL
        // --------------------------------------------------------

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(
                                request.getRawMaterialId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material not found with id: "
                                                + request.getRawMaterialId()
                                )
                        );

        // --------------------------------------------------------
        // PREVENT DUPLICATE ACTIVE STOCK RECORD
        // --------------------------------------------------------

        if (rawMaterialStockRepository
                .existsByRawMaterialRawMaterialIdAndRecordStatus(
                        request.getRawMaterialId(),
                        RecordStatus.ACTIVE
                )) {

            throw new IllegalStateException(
                    "Active raw material stock already exists for raw material id: "
                            + request.getRawMaterialId()
            );
        }

        // --------------------------------------------------------
        // CREATE ENTITY FROM REQUEST
        // --------------------------------------------------------

        RawMaterialStock stock =
                RawMaterialStockMapper.toEntity(request);

        // --------------------------------------------------------
        // SET PARENT RELATIONSHIP
        // --------------------------------------------------------

        stock.setRawMaterial(rawMaterial);

        // --------------------------------------------------------
        // SYSTEM-MANAGED FIELDS
        // --------------------------------------------------------

        stock.setLastUpdatedDate(LocalDate.now());

        stock.setRecordStatus(RecordStatus.ACTIVE);

        // --------------------------------------------------------
        // CALCULATE STOCK STATUS
        // --------------------------------------------------------

        stock.setStockStatus(
                calculateStockStatus(
                        stock.getCurrentStockLevel(),
                        stock.getMinimumStockLevel()
                )
        );

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        RawMaterialStock savedStock =
                rawMaterialStockRepository.save(stock);

        return RawMaterialStockMapper.toResponse(savedStock);
    }

    // ============================================================
    // UPDATE RAW MATERIAL STOCK
    // ============================================================

    @Transactional
    public RawMaterialStockResponse updateRawMaterialStock(
            Integer id,
            RawMaterialStockUpdateRequest request) {

        // --------------------------------------------------------
        // FIND ACTIVE STOCK
        // --------------------------------------------------------

        RawMaterialStock existingStock =
                rawMaterialStockRepository
                        .findByRawMaterialStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material stock not found with id: "
                                                + id
                                )
                        );

        // --------------------------------------------------------
        // FIND PARENT RAW MATERIAL
        // --------------------------------------------------------

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(
                                request.getRawMaterialId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material not found with id: "
                                                + request.getRawMaterialId()
                                )
                        );

        // --------------------------------------------------------
        // PREVENT MOVING TO ANOTHER RAW MATERIAL THAT ALREADY
        // HAS AN ACTIVE STOCK RECORD
        // --------------------------------------------------------

        if (!existingStock.getRawMaterial()
                .getRawMaterialId()
                .equals(request.getRawMaterialId())) {

            if (rawMaterialStockRepository
                    .existsByRawMaterialRawMaterialIdAndRecordStatus(
                            request.getRawMaterialId(),
                            RecordStatus.ACTIVE
                    )) {

                throw new IllegalStateException(
                        "Active raw material stock already exists for raw material id: "
                                + request.getRawMaterialId()
                );
            }
        }

        // --------------------------------------------------------
        // UPDATE REQUEST-MANAGED FIELDS
        // --------------------------------------------------------

        RawMaterialStockMapper.updateEntity(
                existingStock,
                request
        );

        // --------------------------------------------------------
        // SET PARENT RELATIONSHIP
        // --------------------------------------------------------

        existingStock.setRawMaterial(rawMaterial);

        // --------------------------------------------------------
        // SYSTEM-MANAGED FIELDS
        // --------------------------------------------------------

        existingStock.setLastUpdatedDate(LocalDate.now());

        // --------------------------------------------------------
        // RECALCULATE STOCK STATUS
        // --------------------------------------------------------

        existingStock.setStockStatus(
                calculateStockStatus(
                        existingStock.getCurrentStockLevel(),
                        existingStock.getMinimumStockLevel()
                )
        );

        // --------------------------------------------------------
        // RECORD STATUS
        // --------------------------------------------------------

        existingStock.setRecordStatus(RecordStatus.ACTIVE);

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        RawMaterialStock updatedStock =
                rawMaterialStockRepository.save(existingStock);

        return RawMaterialStockMapper.toResponse(updatedStock);
    }

    // ============================================================
    // DELETE / SOFT DELETE RAW MATERIAL STOCK
    // ============================================================

    @Transactional
    public void deleteRawMaterialStock(Integer id) {

        // --------------------------------------------------------
        // FIND ACTIVE STOCK
        // --------------------------------------------------------

        RawMaterialStock stock =
                rawMaterialStockRepository
                        .findByRawMaterialStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material stock not found with id: "
                                                + id
                                )
                        );

        // --------------------------------------------------------
        // SOFT DELETE
        // --------------------------------------------------------

        stock.setRecordStatus(RecordStatus.INACTIVE);

        stock.setLastUpdatedDate(LocalDate.now());

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        rawMaterialStockRepository.save(stock);
    }

    // ============================================================
    // CALCULATE STOCK STATUS
    // ============================================================

    private RawMaterialStockStatus calculateStockStatus(
            BigDecimal currentStockLevel,
            BigDecimal minimumStockLevel) {

        // --------------------------------------------------------
        // NULL CURRENT STOCK
        // --------------------------------------------------------

        if (currentStockLevel == null) {
            return RawMaterialStockStatus.NORMAL;
        }

        // --------------------------------------------------------
        // OUT OF STOCK
        // --------------------------------------------------------

        if (currentStockLevel.compareTo(BigDecimal.ZERO) <= 0) {
            return RawMaterialStockStatus.OUT_OF_STOCK;
        }

        // --------------------------------------------------------
        // LOW STOCK
        // --------------------------------------------------------

        if (minimumStockLevel != null
                && currentStockLevel.compareTo(minimumStockLevel) <= 0) {

            return RawMaterialStockStatus.LOW_STOCK;
        }

        // --------------------------------------------------------
        // NORMAL
        // --------------------------------------------------------

        return RawMaterialStockStatus.NORMAL;
    }
}


/*
package com.skcp.service;

import com.skcp.entity.RawMaterialStock;
import com.skcp.repository.RawMaterialStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialStockService {

    // Dependency Injection
    private final RawMaterialStockRepository rawMaterialStockRepository;

    // Constructor Injection
    public RawMaterialStockService(RawMaterialStockRepository rawMaterialStockRepository) {
        this.rawMaterialStockRepository = rawMaterialStockRepository;
    }

    // Get all Raw Material Stock records
    public List<RawMaterialStock> getAllRawMaterialStock() {
        return rawMaterialStockRepository.findAll();
    }

    // Save Raw Material Stock
    public RawMaterialStock saveRawMaterialStock(RawMaterialStock rawMaterialStock) {
        return rawMaterialStockRepository.save(rawMaterialStock);
    }

    // Find Raw Material Stock by ID
    public RawMaterialStock getRawMaterialStockById(Integer id) {
        return rawMaterialStockRepository.findById(id).orElse(null);
    }

    // Delete Raw Material Stock
    public void deleteRawMaterialStock(Integer id) {
        rawMaterialStockRepository.deleteById(id);
    }
}

*/