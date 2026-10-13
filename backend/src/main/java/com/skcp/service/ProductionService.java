package com.skcp.service;

import com.skcp.dto.request.production.ProductionCreateRequest;
import com.skcp.dto.request.production.ProductionUpdateRequest;
import com.skcp.dto.response.production.ProductionResponse;
import com.skcp.dto.response.production.ProductionSummaryResponse;
import com.skcp.entity.Asset;
import com.skcp.entity.CuringStock;
import com.skcp.entity.Product;
import com.skcp.entity.Production;
import com.skcp.enums.ProductionStatus;
import com.skcp.enums.RecordStatus;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.ProductionMapper;
import com.skcp.repository.AssetRepository;
import com.skcp.repository.CuringStockRepository;
import com.skcp.repository.ProductRepository;
import com.skcp.repository.ProductionRepository;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*import java.time.LocalDate;*/
import java.util.List;

@Service
public class ProductionService {

    private final ProductionRepository productionRepository;
    private final ProductRepository productRepository;
    private final AssetRepository assetRepository;
    private final CuringStockRepository curingStockRepository;
    private final EntityManager entityManager;

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public ProductionService(
            ProductionRepository productionRepository,
            ProductRepository productRepository,
            AssetRepository assetRepository,
            CuringStockRepository curingStockRepository,
            EntityManager entityManager) {

        this.productionRepository = productionRepository;
        this.productRepository = productRepository;
        this.assetRepository = assetRepository;
        this.curingStockRepository = curingStockRepository;
        this.entityManager = entityManager;
    }

    // ============================================================
    // GET ALL PRODUCTIONS
    // ============================================================

    @Transactional(readOnly = true)
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
    public ProductionResponse getProductionById(Integer id) {

        Production production =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: " + id
                                )
                        );

        return ProductionMapper.toResponse(production);
    }

    // ============================================================
    // CREATE PRODUCTION
    //
    // Production and Curing Stock are created in ONE transaction.
    // If either save fails, both operations roll back.
    // ============================================================

    @Transactional
    public ProductionResponse createProduction(
            ProductionCreateRequest request) {

        // --------------------------------------------------------
        // RESOLVE PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(request.getProductId())
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
                assetRepository.findById(request.getAssetId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Asset not found with id: "
                                                + request.getAssetId()
                                )
                        );

        // --------------------------------------------------------
        // MAP REQUEST TO PRODUCTION ENTITY
        // --------------------------------------------------------

        Production production =
                ProductionMapper.toEntity(request);

        production.setProduct(product);
        production.setAsset(asset);
        production.setStatus(ProductionStatus.COMPLETED);

        // --------------------------------------------------------
        // SAVE PRODUCTION
        // --------------------------------------------------------

        Production savedProduction =
                productionRepository.saveAndFlush(production);

        /*
         * total_cement_bags is generated by PostgreSQL.
         * Refresh the saved entity to read the generated value.
         */

        entityManager.refresh(savedProduction);

        // --------------------------------------------------------
        // AUTOMATICALLY CREATE LINKED CURING STOCK
        // --------------------------------------------------------

        if (savedProduction.getProductionDate() == null) {
            throw new IllegalStateException(
                    "Production date is required to create curing stock."
            );
        }

        if (savedProduction.getProduct() == null
                || savedProduction.getQuantityProduced() == null
                || savedProduction.getQuantityProduced() <= 0) {

            throw new IllegalStateException(
                    "A valid product and positive production quantity "
                            + "are required to create curing stock."
            );
        }

        /*
         * A newly created Production ID should not already have
         * a curing record. The repository check provides an
         * additional safeguard alongside the unique database
         * constraint on curing_stock.production_id.
         */

        if (curingStockRepository.existsByProductionProductionId(
                savedProduction.getProductionId())) {

            throw new DuplicateResourceException(
                    "Curing stock already exists for production id: "
                            + savedProduction.getProductionId()
            );
        }

        CuringStock curingStock = new CuringStock();

        curingStock.setProduction(savedProduction);
        curingStock.setProduct(savedProduction.getProduct());
        curingStock.setQuantity(savedProduction.getQuantityProduced());
        curingStock.setProductionDate(savedProduction.getProductionDate());

        curingStock.setExpectedReadyDate(
                savedProduction.getProductionDate().plusDays(3)
        );

        curingStock.setStatus("CURING");
        curingStock.setRecordStatus(RecordStatus.ACTIVE.name());

        // Remarks are optional when created automatically.
        curingStock.setRemarks(null);

        curingStockRepository.saveAndFlush(curingStock);

        // --------------------------------------------------------
        // RETURN PRODUCTION RESPONSE
        // --------------------------------------------------------

        return ProductionMapper.toResponse(savedProduction);
    }

    // ============================================================
    // UPDATE PRODUCTION
    // ============================================================

    @Transactional
    public ProductionResponse updateProduction(
            Integer id,
            ProductionUpdateRequest request) {

        Production existingProduction =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: " + id
                                )
                        );

        if (existingProduction.getStatus()
                == ProductionStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Cancelled production cannot be updated."
            );
        }

        // --------------------------------------------------------
        // CHECK WHETHER ACTIVE CURING STOCK ALREADY EXISTS
        // --------------------------------------------------------

        CuringStock linkedCuringStock =
                curingStockRepository
                        .findByProductionProductionIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElse(null);

        /*
         * Once curing stock exists, production date, product and
         * quantity are fixed to preserve the production-to-curing
         * relationship. Other editable production fields remain
         * available through the existing mapper.
         */

        if (linkedCuringStock != null) {

            boolean productChanged =
                    request.getProductId() == null
                            || !existingProduction.getProduct()
                                    .getProductId()
                                    .equals(request.getProductId());

            boolean dateChanged =
                    request.getProductionDate() == null
                            || !existingProduction.getProductionDate()
                                    .equals(request.getProductionDate());

            boolean quantityChanged =
                    request.getQuantityProduced() == null
                            || !existingProduction.getQuantityProduced()
                                    .equals(request.getQuantityProduced());

            if (productChanged || dateChanged || quantityChanged) {
                throw new IllegalStateException(
                        "Production date, product and quantity cannot be "
                                + "changed after its curing stock is created."
                );
            }
        }

        // --------------------------------------------------------
        // RESOLVE PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository.findById(request.getProductId())
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
                assetRepository.findById(request.getAssetId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Asset not found with id: "
                                                + request.getAssetId()
                                )
                        );

        // --------------------------------------------------------
        // UPDATE ENTITY
        // --------------------------------------------------------

        ProductionMapper.updateEntity(existingProduction, request);

        existingProduction.setProduct(product);
        existingProduction.setAsset(asset);

        // Preserve the existing lifecycle status.

        Production updatedProduction =
                productionRepository.saveAndFlush(existingProduction);

        /*
         * Refresh PostgreSQL-generated total_cement_bags.
         */

        entityManager.refresh(updatedProduction);

        return ProductionMapper.toResponse(updatedProduction);
    }

    // ============================================================
    // CANCEL PRODUCTION — NO PHYSICAL DELETE
    // ============================================================

    @Transactional
    public void deleteProduction(Integer id) {

        Production production =
                productionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Production not found with id: " + id
                                )
                        );

        if (production.getStatus() == ProductionStatus.CANCELLED) {
            throw new DuplicateResourceException(
                    "Production is already cancelled with id: " + id
            );
        }

        CuringStock linkedCuringStock =
                curingStockRepository
                        .findByProductionProductionIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElse(null);

        if (linkedCuringStock != null) {

            String curingStatus = linkedCuringStock.getStatus();

            /*
             * Once curing stock has become READY or MOVED,
             * finished goods may already contain this quantity.
             * Do not cancel production and leave stock inconsistent.
             */

            if ("READY".equals(curingStatus)
                    || "MOVED".equals(curingStatus)) {

                throw new IllegalStateException(
                        "Production cannot be cancelled because its curing "
                                + "batch is already READY or MOVED."
                );
            }

            /*
             * A CURING batch cannot be transferred after its
             * production is cancelled. Mark its curing record
             * inactive as part of the same transaction.
             */

            if ("CURING".equals(curingStatus)) {
                linkedCuringStock.setRecordStatus(
                        RecordStatus.INACTIVE.name()
                );

                curingStockRepository.saveAndFlush(linkedCuringStock);
            }
        }

        // Preserve the historical production record.
        production.setStatus(ProductionStatus.CANCELLED);

        productionRepository.saveAndFlush(production);
    }
}