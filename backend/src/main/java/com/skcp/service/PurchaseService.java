package com.skcp.service;

import com.skcp.dto.request.purchase.PurchaseCreateRequest;
import com.skcp.dto.request.purchase.PurchaseUpdateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchase.PurchaseResponse;
import com.skcp.dto.response.purchase.PurchaseSummaryResponse;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.Purchase;
import com.skcp.entity.PurchaseItem;
import com.skcp.entity.RawMaterial;
import com.skcp.entity.Supplier;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PurchaseItemMapper;
import com.skcp.mapper.PurchaseMapper;
import com.skcp.repository.PurchaseItemRepository;
import com.skcp.repository.PurchaseRepository;
import com.skcp.repository.RawMaterialRepository;
import com.skcp.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final SupplierRepository supplierRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository purchaseItemRepository,
            SupplierRepository supplierRepository,
            RawMaterialRepository rawMaterialRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.supplierRepository = supplierRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public List<PurchaseSummaryResponse> getAllPurchases() {
        return purchaseRepository.findByStatus("ACTIVE")
                .stream()
                .map(PurchaseMapper::toSummaryResponse)
                .toList();
    }

    public PurchaseResponse getPurchaseById(Integer id) {
        Purchase purchase =
                purchaseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase not found with id: " + id
                                )
                        );

        return PurchaseMapper.toResponse(purchase);
    }

    @Transactional
    public PurchaseResponse createPurchase(
            PurchaseCreateRequest request
    ) {
        Supplier supplier =
                supplierRepository.findById(request.getSupplierId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with ID: "
                                                + request.getSupplierId()
                                )
                        );

        Purchase purchase =
                PurchaseMapper.toEntity(request);

        purchase.setSupplier(supplier);
        purchase.setTotalAmount(BigDecimal.ZERO);
        purchase.setStatus("ACTIVE");

        purchase = purchaseRepository.save(purchase);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseItemCreateRequest itemRequest : request.getItems()) {

            RawMaterial rawMaterial =
                    rawMaterialRepository.findById(
                            itemRequest.getRawMaterialId()
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Raw Material not found with ID: "
                                            + itemRequest.getRawMaterialId()
                            )
                    );

            PurchaseItem purchaseItem = new PurchaseItem();

            purchaseItem.setPurchase(purchase);
            purchase.getPurchaseItems().add(purchaseItem);

            purchaseItem.setRawMaterial(rawMaterial);

            purchaseItem.setQuantity(itemRequest.getQuantity());
            purchaseItem.setUnit(itemRequest.getUnit());
            purchaseItem.setUnitPrice(itemRequest.getUnitPrice());
            purchaseItem.setRemarks(itemRequest.getRemarks());

            BigDecimal lineAmount =
                    itemRequest.getQuantity()
                            .multiply(itemRequest.getUnitPrice());

            purchaseItem.setLineAmount(lineAmount);

            purchaseItemRepository.save(purchaseItem);

            totalAmount = totalAmount.add(lineAmount);
        }

        purchase.setTotalAmount(totalAmount);

        purchase = purchaseRepository.save(purchase);

        return PurchaseMapper.toResponse(purchase);
    }

    @Transactional
    public PurchaseResponse updatePurchase(
            Integer id,
            PurchaseUpdateRequest request
    ) {
        Purchase purchase =
                purchaseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase not found with id: " + id
                                )
                        );

        Supplier supplier =
                supplierRepository.findById(request.getSupplierId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: "
                                                + request.getSupplierId()
                                )
                        );

        PurchaseMapper.updateEntity(purchase, request);

        purchase.setSupplier(supplier);

        purchase = purchaseRepository.save(purchase);

        return PurchaseMapper.toResponse(purchase);
    }

    @Transactional
    public PurchaseItemResponse updatePurchaseItem(
            Integer id,
            PurchaseItemUpdateRequest request
    ) {
        PurchaseItem purchaseItem =
                purchaseItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: " + id
                                )
                        );

        return PurchaseItemMapper.toResponse(purchaseItem);
    }

        @Transactional
        public void deletePurchase(Integer id) {

        Purchase purchase =
                purchaseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase not found with id: " + id
                                )
                        );

        purchase.setStatus("INACTIVE");

        purchaseRepository.save(purchase);
        }
}