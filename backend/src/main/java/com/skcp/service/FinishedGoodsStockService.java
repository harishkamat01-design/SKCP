
package com.skcp.service;

import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockCreateRequest;
import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockUpdateRequest;
import com.skcp.dto.response.finishedgoodsstock.FinishedGoodsStockResponse;
import com.skcp.entity.FinishedGoodsStock;
import com.skcp.entity.Product;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.FinishedGoodsStockMapper;
import com.skcp.repository.FinishedGoodsStockRepository;
import com.skcp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FinishedGoodsStockService {

    private final FinishedGoodsStockRepository finishedGoodsStockRepository;
    private final ProductRepository productRepository;
    private final FinishedGoodsStockMapper finishedGoodsStockMapper;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public FinishedGoodsStockService(
            FinishedGoodsStockRepository finishedGoodsStockRepository,
            ProductRepository productRepository,
            FinishedGoodsStockMapper finishedGoodsStockMapper) {

        this.finishedGoodsStockRepository = finishedGoodsStockRepository;
        this.productRepository = productRepository;
        this.finishedGoodsStockMapper = finishedGoodsStockMapper;
    }


    // ============================================================
    // GET ALL ACTIVE FINISHED GOODS STOCK
    // ============================================================

    public List<FinishedGoodsStockResponse> getAllFinishedGoodsStock() {

        return finishedGoodsStockRepository
                .findByRecordStatus("ACTIVE")
                .stream()
                .map(finishedGoodsStockMapper::toResponse)
                .toList();
    }


    // ============================================================
    // GET ACTIVE FINISHED GOODS STOCK BY ID
    // ============================================================

    public FinishedGoodsStockResponse getFinishedGoodsStockById(
            Integer id) {

        FinishedGoodsStock finishedGoodsStock =
                finishedGoodsStockRepository
                        .findByFinishedGoodsStockIdAndRecordStatus(
                                id,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finished goods stock not found with id: "
                                                + id
                                )
                        );

        return finishedGoodsStockMapper.toResponse(
                finishedGoodsStock
        );
    }


    // ============================================================
    // CREATE FINISHED GOODS STOCK
    // ============================================================

    public FinishedGoodsStockResponse createFinishedGoodsStock(
            FinishedGoodsStockCreateRequest request) {

        // --------------------------------------------------------
        // FIND PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                        request.getProductId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        )
                );


        // --------------------------------------------------------
        // DUPLICATE ACTIVE STOCK CHECK
        // --------------------------------------------------------

        boolean exists =
                finishedGoodsStockRepository
                        .existsByProductProductIdAndRecordStatus(
                                request.getProductId(),
                                "ACTIVE"
                        );

        if (exists) {

            throw new DuplicateResourceException(
                    "Finished goods stock already exists for product id: "
                            + request.getProductId()
            );
        }


        // --------------------------------------------------------
        // REQUEST → ENTITY
        // --------------------------------------------------------

        FinishedGoodsStock finishedGoodsStock =
                finishedGoodsStockMapper.toEntity(request);


        // --------------------------------------------------------
        // SERVER CONTROLLED FIELDS
        // --------------------------------------------------------

        finishedGoodsStock.setProduct(product);

        finishedGoodsStock.setRecordStatus("ACTIVE");

        finishedGoodsStock.setLastUpdatedDate(
                LocalDate.now()
        );


        // --------------------------------------------------------
        // CALCULATE STOCK STATUS
        // --------------------------------------------------------

        finishedGoodsStock.setStatus(
                calculateStockStatus(
                        finishedGoodsStock.getCurrentStockLevel(),
                        finishedGoodsStock.getMinimumStockLevel()
                )
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        FinishedGoodsStock saved =
                finishedGoodsStockRepository.save(
                        finishedGoodsStock
                );


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return finishedGoodsStockMapper.toResponse(saved);
    }


    // ============================================================
    // UPDATE FINISHED GOODS STOCK
    // ============================================================

    public FinishedGoodsStockResponse updateFinishedGoodsStock(
            Integer id,
            FinishedGoodsStockUpdateRequest request) {

        // --------------------------------------------------------
        // FIND EXISTING ACTIVE RECORD
        // --------------------------------------------------------

        FinishedGoodsStock existingStock =
                finishedGoodsStockRepository
                        .findByFinishedGoodsStockIdAndRecordStatus(
                                id,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finished goods stock not found with id: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // FIND PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                        request.getProductId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        )
                );


        // --------------------------------------------------------
        // DUPLICATE ACTIVE PRODUCT CHECK
        // --------------------------------------------------------

        boolean duplicateExists =
                finishedGoodsStockRepository
                        .existsByProductProductIdAndRecordStatus(
                                request.getProductId(),
                                "ACTIVE"
                        );

        if (duplicateExists
                && !existingStock.getProduct()
                        .getProductId()
                        .equals(request.getProductId())) {

            throw new DuplicateResourceException(
                    "Finished goods stock already exists for product id: "
                            + request.getProductId()
            );
        }


        // --------------------------------------------------------
        // UPDATE REQUEST → EXISTING ENTITY
        // --------------------------------------------------------

        finishedGoodsStockMapper.updateEntity(
                existingStock,
                request
        );


        // --------------------------------------------------------
        // SERVER CONTROLLED FIELDS
        // --------------------------------------------------------

        existingStock.setProduct(product);

        existingStock.setLastUpdatedDate(
                LocalDate.now()
        );


        // --------------------------------------------------------
        // RECALCULATE STOCK STATUS
        // --------------------------------------------------------

        existingStock.setStatus(
                calculateStockStatus(
                        existingStock.getCurrentStockLevel(),
                        existingStock.getMinimumStockLevel()
                )
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        FinishedGoodsStock updated =
                finishedGoodsStockRepository.save(
                        existingStock
                );


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return finishedGoodsStockMapper.toResponse(updated);
    }


    // ============================================================
    // DELETE - SOFT DELETE FINISHED GOODS STOCK
    // ============================================================
    //
    // Business rules:
    //
    // 1. ID does not exist
    //      → ResourceNotFoundException
    //      → 404 NOT FOUND
    //
    // 2. ID exists but is already INACTIVE
    //      → DuplicateResourceException
    //      → 409 CONFLICT
    //
    // 3. ID exists and is ACTIVE
    //      → ACTIVE → INACTIVE
    //      → successful deletion
    //      → 200 OK
    //
    // IMPORTANT:
    // The service performs only the business operation.
    //
    // The Controller is responsible for constructing the
    // HTTP success response.
    //
    // ============================================================

    public void deleteFinishedGoodsStock(Integer id) {

        // --------------------------------------------------------
        // FIND RECORD BY ID
        // --------------------------------------------------------
        //
        // IMPORTANT:
        // Do NOT search only for ACTIVE here.
        //
        // We need to know whether the ID exists but is already
        // INACTIVE so that we can return 409 CONFLICT instead
        // of incorrectly returning 404 NOT FOUND.
        //
        // --------------------------------------------------------

        FinishedGoodsStock existingStock =
                finishedGoodsStockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finished goods stock not found with id: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // CHECK IF ALREADY DELETED
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                existingStock.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Finished goods stock already deleted with id: "
                            + id
            );
        }


        // --------------------------------------------------------
        // SOFT DELETE
        // --------------------------------------------------------

        existingStock.setRecordStatus("INACTIVE");


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        finishedGoodsStockRepository.save(existingStock);
    }


    // ============================================================
    // STOCK STATUS BUSINESS LOGIC
    // ============================================================

    private String calculateStockStatus(
            Integer currentStockLevel,
            Integer minimumStockLevel) {

        if (currentStockLevel == null) {
            return "OUT_OF_STOCK";
        }

        if (currentStockLevel == 0) {
            return "OUT_OF_STOCK";
        }

        if (minimumStockLevel != null
                && currentStockLevel <= minimumStockLevel) {

            return "LOW_STOCK";
        }

        return "NORMAL";
    }
}
