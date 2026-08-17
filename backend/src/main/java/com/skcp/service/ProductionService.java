package com.skcp.service;

import com.skcp.dto.request.production.ProductionCreateRequest;
import com.skcp.dto.request.production.ProductionUpdateRequest;
import com.skcp.dto.response.production.ProductionResponse;
import com.skcp.dto.response.production.ProductionSummaryResponse;
import com.skcp.entity.Asset;
import com.skcp.entity.Product;
import com.skcp.entity.Production;
import com.skcp.enums.ProductionStatus;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.ProductionMapper;
import com.skcp.repository.AssetRepository;
import com.skcp.repository.ProductRepository;
import com.skcp.repository.ProductionRepository;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductionService {

    private final ProductionRepository productionRepository;
    private final ProductRepository productRepository;
    private final AssetRepository assetRepository;
    private final EntityManager entityManager;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public ProductionService(
            ProductionRepository productionRepository,
            ProductRepository productRepository,
            AssetRepository assetRepository,
            EntityManager entityManager) {

        this.productionRepository = productionRepository;
        this.productRepository = productRepository;
        this.assetRepository = assetRepository;
        this.entityManager = entityManager;
    }


    // ============================================================
    // GET ALL PRODUCTIONS
    // ============================================================

    public List<ProductionSummaryResponse> getAllProductions() {

        return productionRepository.findAll()
                .stream()
                .map(ProductionMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET PRODUCTION BY ID
    // ============================================================

    @Transactional(readOnly = true)
    public ProductionResponse getProductionById(
            Integer id) {

        Production production =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: "
                                                + id
                                )
                        );

        return ProductionMapper.toResponse(
                production
        );
    }


    // ============================================================
    // CREATE PRODUCTION
    // ============================================================

    @Transactional
    public ProductionResponse createProduction(
            ProductionCreateRequest request) {

        // --------------------------------------------------------
        // RESOLVE PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                                request.getProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                )
                        );


        // --------------------------------------------------------
        // RESOLVE ASSET
        // --------------------------------------------------------

        Asset asset =
                assetRepository.findById(
                                request.getAssetId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Asset not found with id: "
                                                + request.getAssetId()
                                )
                        );


        // --------------------------------------------------------
        // MAP REQUEST → ENTITY
        // --------------------------------------------------------

        Production production =
                ProductionMapper.toEntity(request);


        production.setProduct(product);
        production.setAsset(asset);


        // --------------------------------------------------------
        // BACKEND-CONTROLLED STATUS
        // --------------------------------------------------------

        production.setStatus(
                ProductionStatus.COMPLETED
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Production savedProduction =
                productionRepository.save(
                        production
                );


        /*
         * IMPORTANT
         *
         * total_cement_bags is generated by PostgreSQL.
         *
         * Force Hibernate to execute the INSERT first.
         */

        productionRepository.flush();


        /*
         * PostgreSQL has now calculated:
         *
         * morning_cement_bags
         * +
         * afternoon_cement_bags
         *
         * Refresh the entity so Java receives the generated
         * database value.
         */

        entityManager.refresh(
                savedProduction
        );


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return ProductionMapper.toResponse(
                savedProduction
        );
    }


    // ============================================================
    // UPDATE PRODUCTION
    // ============================================================

    @Transactional
    public ProductionResponse updateProduction(
            Integer id,
            ProductionUpdateRequest request) {

        // --------------------------------------------------------
        // FIND EXISTING PRODUCTION
        // --------------------------------------------------------

        Production existingProduction =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // RESOLVE PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                                request.getProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                )
                        );


        // --------------------------------------------------------
        // RESOLVE ASSET
        // --------------------------------------------------------

        Asset asset =
                assetRepository.findById(
                                request.getAssetId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Asset not found with id: "
                                                + request.getAssetId()
                                )
                        );


        // --------------------------------------------------------
        // UPDATE ENTITY
        // --------------------------------------------------------

        ProductionMapper.updateEntity(
                existingProduction,
                request
        );


        existingProduction.setProduct(product);
        existingProduction.setAsset(asset);


        // --------------------------------------------------------
        // PRESERVE EXISTING STATUS
        // --------------------------------------------------------

        /*
         * PUT does not allow the client to change the
         * Production lifecycle status.
         *
         * Existing status is preserved.
         */


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Production updatedProduction =
                productionRepository.save(
                        existingProduction
                );


        /*
         * Force UPDATE to PostgreSQL so the generated
         * total_cement_bags column is recalculated.
         */

        productionRepository.flush();


        /*
         * Refresh entity from PostgreSQL so
         * totalCementBags contains the newly calculated value.
         */

        entityManager.refresh(
                updatedProduction
        );


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return ProductionMapper.toResponse(
                updatedProduction
        );
    }


    // ============================================================
    // DELETE / CANCEL PRODUCTION
    // ============================================================

    @Transactional
    public void deleteProduction(
            Integer id) {

        Production production =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: "
                                                + id
                                )
                        );


        /*
         * Production records are historical business records.
         *
         * NEVER physically delete them.
         *
         * CANCELLED means the production record is
         * logically cancelled.
         */

        production.setStatus(
                ProductionStatus.CANCELLED
        );


        productionRepository.save(
                production
        );
    }
}







/*
package com.skcp.service;

import com.skcp.entity.Production;
import com.skcp.repository.ProductionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductionService {

    // Dependency Injection
    private final ProductionRepository productionRepository;

    // Constructor Injection
    public ProductionService(ProductionRepository productionRepository) {
        this.productionRepository = productionRepository;
    }

    // Get all production records
    public List<Production> getAllProductions() {
        return productionRepository.findAll();
    }

    // Save production
    public Production saveProduction(Production production) {
        return productionRepository.save(production);
    }

    // Find production by ID
    public Production getProductionById(Integer id) {
        return productionRepository.findById(id).orElse(null);
    }

    // Delete production
    public void deleteProduction(Integer id) {
        productionRepository.deleteById(id);
    }
}

*/