        package com.skcp.service;

        import com.skcp.dto.request.curingstock.CuringStockCreateRequest;
        import com.skcp.dto.request.curingstock.CuringStockUpdateRequest;
        import com.skcp.dto.response.curingstock.CuringStockResponse;
        import com.skcp.dto.response.curingstock.CuringStockSummaryResponse;
        import com.skcp.entity.CuringStock;
        import com.skcp.entity.FinishedGoodsStock;
        import com.skcp.entity.Production;
        import com.skcp.enums.ProductionStatus;
        import com.skcp.enums.RecordStatus;
        import com.skcp.exception.DuplicateResourceException;
        import com.skcp.exception.ResourceNotFoundException;
        import com.skcp.mapper.CuringStockMapper;
        import com.skcp.repository.CuringStockRepository;
        import com.skcp.repository.FinishedGoodsStockRepository;
        import com.skcp.repository.ProductionRepository;

        import org.springframework.stereotype.Service;
        import org.springframework.transaction.annotation.Transactional;

        import java.time.LocalDate;
        import java.util.List;

        @Service
        public class CuringStockService {

        private static final String CURING = "CURING";
        private static final String READY = "READY";
        private static final String MOVED = "MOVED";

        private final CuringStockRepository curingStockRepository;
        private final ProductionRepository productionRepository;
        private final FinishedGoodsStockRepository finishedGoodsStockRepository;
        private final CuringStockMapper curingStockMapper;

        public CuringStockService(
                CuringStockRepository curingStockRepository,
                ProductionRepository productionRepository,
                FinishedGoodsStockRepository finishedGoodsStockRepository,
                CuringStockMapper curingStockMapper) {

                this.curingStockRepository = curingStockRepository;
                this.productionRepository = productionRepository;
                this.finishedGoodsStockRepository = finishedGoodsStockRepository;
                this.curingStockMapper = curingStockMapper;
        }

        // ==========================================================
        // GET ALL ACTIVE CURING STOCK
        // ==========================================================

        @Transactional(readOnly = true)
        public List<CuringStockSummaryResponse> getAllCuringStock() {

                return curingStockRepository
                        .findByRecordStatus(RecordStatus.ACTIVE.name())
                        .stream()
                        .map(curingStockMapper::toSummaryResponse)
                        .toList();
        }

        // ==========================================================
        // GET ACTIVE CURING STOCK BY ID
        // ==========================================================

        @Transactional(readOnly = true)
        public CuringStockResponse getCuringStockById(Integer id) {

                CuringStock curingStock =
                        findActiveCuringStock(id);

                return curingStockMapper.toResponse(curingStock);
        }

        // ==========================================================
        // CREATE CURING STOCK
        //
        // Normally created automatically by ProductionService.
        // This method remains for API compatibility and prevents
        // duplicate records for the same production.
        // Production is the source of truth for product, quantity
        // and production date.
        // ==========================================================

        @Transactional
        public CuringStockResponse createCuringStock(
                CuringStockCreateRequest request) {

                Production production =
                        productionRepository.findById(request.getProductionId())
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Production not found with id: "
                                                        + request.getProductionId()
                                        )
                                );

                if (production.getStatus() == ProductionStatus.CANCELLED) {
                throw new IllegalStateException(
                        "Curing stock cannot be created for cancelled production."
                );
                }

                if (curingStockRepository.existsByProductionProductionId(
                        production.getProductionId())) {

                throw new DuplicateResourceException(
                        "Curing stock already exists for production id: "
                                + production.getProductionId()
                );
                }

                if (production.getProduct() == null
                        || production.getQuantityProduced() == null
                        || production.getProductionDate() == null) {

                throw new IllegalStateException(
                        "Production must have a product, quantity and production date."
                );
                }

                CuringStock curingStock = new CuringStock();

                curingStock.setProduction(production);
                curingStock.setProduct(production.getProduct());
                curingStock.setQuantity(production.getQuantityProduced());
                curingStock.setProductionDate(production.getProductionDate());
                curingStock.setExpectedReadyDate(
                        production.getProductionDate().plusDays(3)
                );
                curingStock.setStatus(CURING);
                curingStock.setRecordStatus(RecordStatus.ACTIVE.name());
                curingStock.setRemarks(request.getRemarks());

                CuringStock saved =
                        curingStockRepository.saveAndFlush(curingStock);

                return curingStockMapper.toResponse(saved);
        }

        // ==========================================================
        // UPDATE CURING STOCK
        //
        // Product, quantity, production and dates are controlled by
        // the linked Production record. Only remarks can be edited.
        // ==========================================================

        @Transactional
        public CuringStockResponse updateCuringStock(
                Integer id,
                CuringStockUpdateRequest request) {

                CuringStock existing = findActiveCuringStock(id);

                if (!CURING.equals(existing.getStatus())) {
                throw new IllegalStateException(
                        "Only curing batches with status CURING can be edited."
                );
                }

                existing.setRemarks(request.getRemarks());

                CuringStock updated =
                        curingStockRepository.saveAndFlush(existing);

                return curingStockMapper.toResponse(updated);
        }

        // ==========================================================
        // UPDATE CURING STATUS
        //
        // CURING -> READY:
        //   Validate readiness date and transfer quantity to
        //   Finished Goods Stock in the same transaction.
        //
        // READY -> MOVED:
        //   Update lifecycle status without transferring stock again.
        // ==========================================================

        @Transactional
        public CuringStockResponse updateCuringStockStatus(
                Integer id,
                String requestedStatus) {

                if (requestedStatus == null || requestedStatus.isBlank()) {
                throw new IllegalArgumentException(
                        "Curing stock status is required."
                );
                }

                String newStatus = requestedStatus.trim().toUpperCase();

                if (!READY.equals(newStatus) && !MOVED.equals(newStatus)) {
                throw new IllegalArgumentException(
                        "Allowed curing status changes are READY or MOVED."
                );
                }

                // Obtain the row lock inside this transaction so two
                // simultaneous requests cannot transfer the same batch.
                CuringStock existing =
                        curingStockRepository
                                .findWithLockByCuringStockIdAndRecordStatus(
                                        id,
                                        RecordStatus.ACTIVE.name()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Curing stock not found with id: " + id
                                        )
                                );

                String currentStatus = existing.getStatus();

                // Repeated READY request: do not transfer stock again.
                if (READY.equals(newStatus) && READY.equals(currentStatus)) {
                return curingStockMapper.toResponse(existing);
                }

                if (MOVED.equals(newStatus) && MOVED.equals(currentStatus)) {
                return curingStockMapper.toResponse(existing);
                }

                if (MOVED.equals(newStatus)) {
                if (!READY.equals(currentStatus)) {
                        throw new IllegalStateException(
                                "A curing batch must be READY before it can be marked MOVED."
                        );
                }

                existing.setStatus(MOVED);

                CuringStock moved =
                        curingStockRepository.saveAndFlush(existing);

                return curingStockMapper.toResponse(moved);
                }

                // From here, the requested status is READY.
                if (!CURING.equals(currentStatus)) {
                throw new IllegalStateException(
                        "Only a batch with status CURING can be marked READY."
                );
                }

                Production production = existing.getProduction();

                if (production == null) {
                throw new IllegalStateException(
                        "The curing batch has no linked production record."
                );
                }

                if (production.getStatus() == ProductionStatus.CANCELLED) {
                throw new IllegalStateException(
                        "Cancelled production cannot be transferred to finished goods."
                );
                }

                LocalDate expectedReadyDate = existing.getExpectedReadyDate();

                if (expectedReadyDate == null) {
                throw new IllegalStateException(
                        "Expected ready date is missing for curing stock id: " + id
                );
                }

                if (LocalDate.now().isBefore(expectedReadyDate)) {
                throw new IllegalStateException(
                        "This batch cannot be marked READY before "
                                + expectedReadyDate + "."
                );
                }

                if (existing.getProduct() == null) {
                throw new IllegalStateException(
                        "The curing batch has no linked product."
                );
                }

                Integer quantity = existing.getQuantity();

                if (quantity == null || quantity <= 0) {
                throw new IllegalStateException(
                        "Curing quantity must be greater than zero."
                );
                }

                // If this operation fails, the READY status change also
                // rolls back because both operations share this transaction.
                transferToFinishedGoodsStock(existing, quantity);

                existing.setStatus(READY);

                CuringStock updated =
                        curingStockRepository.saveAndFlush(existing);

                return curingStockMapper.toResponse(updated);
        }

        // ==========================================================
        // TRANSFER CURING QUANTITY TO FINISHED GOODS STOCK
        // ==========================================================

        private void transferToFinishedGoodsStock(
                CuringStock curingStock,
                Integer quantity) {

                Integer productId =
                        curingStock.getProduct().getProductId();

                FinishedGoodsStock stock =
                        finishedGoodsStockRepository
                                .findByProductProductIdAndRecordStatus(
                                        productId,
                                        RecordStatus.ACTIVE.name()
                                )
                                .orElse(null);

                if (stock == null) {

                // Do not create a second aggregate record if the
                // product already has an inactive stock record.
                if (finishedGoodsStockRepository
                        .existsByProductProductId(productId)) {

                        throw new IllegalStateException(
                                "An inactive Finished Goods Stock record already exists "
                                        + "for product id: " + productId
                                        + ". Resolve that record before transferring stock."
                        );
                }

                stock = new FinishedGoodsStock();
                stock.setProduct(curingStock.getProduct());
                stock.setCurrentStockLevel(quantity);
                stock.setMinimumStockLevel(null);
                stock.setLastUpdatedDate(LocalDate.now());
                stock.setRecordStatus(RecordStatus.ACTIVE.name());
                stock.setStatus("NORMAL");

                } else {

                Integer currentStock = stock.getCurrentStockLevel();

                if (currentStock == null || currentStock < 0) {
                        throw new IllegalStateException(
                                "Existing finished goods stock has an invalid stock level."
                        );
                }

                try {
                        stock.setCurrentStockLevel(
                                Math.addExact(currentStock, quantity)
                        );
                } catch (ArithmeticException exception) {
                        throw new IllegalStateException(
                                "Finished goods stock quantity exceeds the supported limit.",
                                exception
                        );
                }

                stock.setLastUpdatedDate(LocalDate.now());

                Integer minimumStock = stock.getMinimumStockLevel();
                Integer updatedStock = stock.getCurrentStockLevel();

                if (updatedStock == 0) {
                        stock.setStatus("OUT_OF_STOCK");
                } else if (minimumStock != null
                        && updatedStock <= minimumStock) {
                        stock.setStatus("LOW_STOCK");
                } else {
                        stock.setStatus("NORMAL");
                }
                }

                finishedGoodsStockRepository.saveAndFlush(stock);
        }

        // ==========================================================
        // SOFT DELETE CURING STOCK
        // ==========================================================

        @Transactional
        public void deleteCuringStock(Integer id) {

                CuringStock existing =
                        curingStockRepository.findById(id)
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Curing stock not found with id: " + id
                                        )
                                );

                if (RecordStatus.INACTIVE.name()
                        .equals(existing.getRecordStatus())) {

                throw new DuplicateResourceException(
                        "Curing stock is already inactive with id: " + id
                );
                }

                if (READY.equals(existing.getStatus())
                        || MOVED.equals(existing.getStatus())) {

                throw new IllegalStateException(
                        "A READY or MOVED curing batch cannot be deleted."
                );
                }

                existing.setRecordStatus(RecordStatus.INACTIVE.name());

                curingStockRepository.saveAndFlush(existing);
        }

        // ==========================================================
        // COMMON HELPER
        // ==========================================================

        private CuringStock findActiveCuringStock(Integer id) {

                return curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Curing stock not found with id: " + id
                                )
                        );
        }
        }
