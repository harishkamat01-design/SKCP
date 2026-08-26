package com.skcp.service;

import com.skcp.dto.request.curingstock.CuringStockCreateRequest;
import com.skcp.dto.request.curingstock.CuringStockUpdateRequest;
import com.skcp.dto.response.curingstock.CuringStockResponse;
import com.skcp.dto.response.curingstock.CuringStockSummaryResponse;
import com.skcp.entity.CuringStock;
import com.skcp.entity.Product;
import com.skcp.entity.Production;
import com.skcp.enums.RecordStatus;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.CuringStockMapper;
import com.skcp.repository.CuringStockRepository;
import com.skcp.repository.ProductRepository;
import com.skcp.repository.ProductionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuringStockService {

    private final CuringStockRepository curingStockRepository;
    private final ProductionRepository productionRepository;
    private final ProductRepository productRepository;
    private final CuringStockMapper curingStockMapper;

    public CuringStockService(
            CuringStockRepository curingStockRepository,
            ProductionRepository productionRepository,
            ProductRepository productRepository,
            CuringStockMapper curingStockMapper) {

        this.curingStockRepository = curingStockRepository;
        this.productionRepository = productionRepository;
        this.productRepository = productRepository;
        this.curingStockMapper = curingStockMapper;
    }

    // ==========================================================
    // GET ALL ACTIVE CURING STOCK
    // ==========================================================

    public List<CuringStockSummaryResponse> getAllCuringStock() {

        return curingStockRepository
                .findByRecordStatus(
                        RecordStatus.ACTIVE.name()
                )
                .stream()
                .map(curingStockMapper::toSummaryResponse)
                .toList();
    }

    // ==========================================================
    // GET ACTIVE CURING STOCK BY ID
    // ==========================================================

    public CuringStockResponse getCuringStockById(Integer id) {

        CuringStock curingStock =
                curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Curing stock not found with id: " + id
                                )
                        );

        return curingStockMapper.toResponse(curingStock);
    }

    // ==========================================================
    // CREATE CURING STOCK
    // ==========================================================

    public CuringStockResponse createCuringStock(
            CuringStockCreateRequest request) {

        // ------------------------------------------------------
        // FIND PRODUCTION
        // ------------------------------------------------------

        Production production =
                productionRepository
                        .findById(request.getProductionId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: "
                                                + request.getProductionId()
                                )
                        );

        // ------------------------------------------------------
        // FIND PRODUCT
        // ------------------------------------------------------

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                )
                        );

        // ------------------------------------------------------
        // CREATE ENTITY
        // ------------------------------------------------------

        CuringStock curingStock = new CuringStock();

        curingStock.setProduction(production);
        curingStock.setProduct(product);
        curingStock.setQuantity(request.getQuantity());
        curingStock.setProductionDate(request.getProductionDate());
        curingStock.setRemarks(request.getRemarks());

        // ------------------------------------------------------
        // SERVER-CONTROLLED LIFECYCLE STATUS
        // ------------------------------------------------------

        curingStock.setStatus("CURING");

        // ------------------------------------------------------
        // SERVER-CONTROLLED RECORD STATUS
        // ------------------------------------------------------

        curingStock.setRecordStatus(
                RecordStatus.ACTIVE.name()
        );

        // ------------------------------------------------------
        // BUSINESS RULE
        // Production Date + 3 Days
        // ------------------------------------------------------

        curingStock.setExpectedReadyDate(
                request.getProductionDate().plusDays(3)
        );

        // ------------------------------------------------------
        // SAVE
        // ------------------------------------------------------

        CuringStock saved =
                curingStockRepository.save(curingStock);

        return curingStockMapper.toResponse(saved);
    }

    // ==========================================================
    // UPDATE CURING STOCK
    // ==========================================================

    public CuringStockResponse updateCuringStock(
            Integer id,
            CuringStockUpdateRequest request) {

        // ------------------------------------------------------
        // FIND ACTIVE RECORD
        // ------------------------------------------------------

        CuringStock existing =
                curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Curing stock not found with id: " + id
                                )
                        );

        // ------------------------------------------------------
        // FIND PRODUCT
        // ------------------------------------------------------

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                )
                        );

        // ------------------------------------------------------
        // UPDATE ALLOWED FIELDS
        // ------------------------------------------------------

        existing.setProduct(product);
        existing.setQuantity(request.getQuantity());
        existing.setProductionDate(request.getProductionDate());
        existing.setRemarks(request.getRemarks());

        // ------------------------------------------------------
        // RECALCULATE DERIVED FIELD
        // ------------------------------------------------------

        existing.setExpectedReadyDate(
                request.getProductionDate().plusDays(3)
        );

        // ------------------------------------------------------
        // DO NOT MODIFY:
        //
        // production
        // status
        // recordStatus
        // createdAt
        // ------------------------------------------------------

        CuringStock updated =
                curingStockRepository.save(existing);

        return curingStockMapper.toResponse(updated);
    }

    // ==========================================================
    // SOFT DELETE CURING STOCK
    // ==========================================================

    public void deleteCuringStock(Integer id) {

        // ------------------------------------------------------
        // FIRST CHECK WHETHER RECORD EXISTS
        // ------------------------------------------------------

        CuringStock existing =
                curingStockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Curing stock not found with id: " + id
                                )
                        );

        // ------------------------------------------------------
        // ALREADY INACTIVE
        // ------------------------------------------------------

        if (RecordStatus.INACTIVE.name()
                .equals(existing.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Curing stock is already inactive with id: " + id
            );
        }

        // ------------------------------------------------------
        // ACTIVE → INACTIVE
        // ------------------------------------------------------

        existing.setRecordStatus(
                RecordStatus.INACTIVE.name()
        );

        curingStockRepository.save(existing);
    }
}