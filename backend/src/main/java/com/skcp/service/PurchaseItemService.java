package com.skcp.service;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.Purchase;
import com.skcp.entity.PurchaseItem;
import com.skcp.entity.RawMaterial;
import com.skcp.enums.RecordStatus;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PurchaseItemMapper;
import com.skcp.repository.PurchaseItemRepository;
import com.skcp.repository.PurchaseRepository;
import com.skcp.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PurchaseItemService
{

    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final RawMaterialRepository rawMaterialRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public PurchaseItemService(
            PurchaseItemRepository purchaseItemRepository,
            PurchaseRepository purchaseRepository,
            RawMaterialRepository rawMaterialRepository
    )
    {
        this.purchaseItemRepository = purchaseItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }


    // ============================================================
    // CREATE PURCHASE ITEM
    // ============================================================

    @Transactional
    public PurchaseItemResponse createPurchaseItem(
            Integer purchaseId,
            PurchaseItemCreateRequest request
    )
    {
        Purchase purchase =
                purchaseRepository.findById(purchaseId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase not found with id: "
                                                + purchaseId
                                )
                        );


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


        PurchaseItem purchaseItem =
                PurchaseItemMapper.toEntity(request);


        purchaseItem.setPurchase(purchase);
        purchaseItem.setRawMaterial(rawMaterial);
        purchaseItem.setStatus(RecordStatus.ACTIVE);


        // ========================================================
        // BACKEND CALCULATION
        // ========================================================

        BigDecimal lineAmount =
                request.getQuantity()
                        .multiply(request.getUnitPrice());

        purchaseItem.setLineAmount(lineAmount);


        PurchaseItem savedPurchaseItem =
                purchaseItemRepository.save(purchaseItem);


        // Recalculate parent Purchase total
        recalculatePurchaseTotal(purchase);


        return PurchaseItemMapper.toResponse(
                savedPurchaseItem
        );
    }


    // ============================================================
    // RECALCULATE PURCHASE TOTAL
    // ============================================================

    /*
     * Only ACTIVE PurchaseItems contribute to Purchase.totalAmount.
     *
     * INACTIVE items are logically deleted and therefore excluded.
     */

    private void recalculatePurchaseTotal(
            Purchase purchase
    )
    {
        BigDecimal totalAmount =
                purchaseItemRepository
                        .findByPurchaseAndStatus(
                                purchase,
                                RecordStatus.ACTIVE
                        )
                        .stream()
                        .map(PurchaseItem::getLineAmount)
                        .filter(lineAmount -> lineAmount != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        purchase.setTotalAmount(totalAmount);

        purchaseRepository.save(purchase);
    }


    // ============================================================
    // GET ALL ACTIVE PURCHASE ITEMS
    // ============================================================

    public List<PurchaseItemResponse> getAllPurchaseItems()
    {
        return purchaseItemRepository
                .findByStatus(RecordStatus.ACTIVE)
                .stream()
                .map(PurchaseItemMapper::toResponse)
                .toList();
    }


    // ============================================================
    // GET ACTIVE PURCHASE ITEM BY ID
    // ============================================================

    public PurchaseItemResponse getPurchaseItemById(
            Integer id
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository
                        .findByPurchaseItemIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );


        return PurchaseItemMapper.toResponse(
                purchaseItem
        );
    }


    // ============================================================
    // UPDATE PURCHASE ITEM
    // ============================================================

    @Transactional
    public PurchaseItemResponse updatePurchaseItem(
            Integer id,
            PurchaseItemUpdateRequest request
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository
                        .findByPurchaseItemIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );


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


        Purchase purchase =
                purchaseItem.getPurchase();


        // Update editable fields
        PurchaseItemMapper.updateEntity(
                purchaseItem,
                request
        );


        purchaseItem.setRawMaterial(rawMaterial);


        // ========================================================
        // BACKEND CALCULATION
        // ========================================================

        BigDecimal lineAmount =
                request.getQuantity()
                        .multiply(request.getUnitPrice());

        purchaseItem.setLineAmount(lineAmount);


        PurchaseItem updatedPurchaseItem =
                purchaseItemRepository.save(purchaseItem);


        // Recalculate parent Purchase total
        recalculatePurchaseTotal(purchase);


        return PurchaseItemMapper.toResponse(
                updatedPurchaseItem
        );
    }


    // ============================================================
    // SOFT DELETE PURCHASE ITEM
    // ============================================================

    @Transactional
    public void deletePurchaseItem(
            Integer id
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository
                        .findByPurchaseItemIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );


        Purchase purchase =
                purchaseItem.getPurchase();


        // ========================================================
        // SOFT DELETE
        // ========================================================

        purchaseItem.setStatus(
                RecordStatus.INACTIVE
        );


        purchaseItemRepository.save(purchaseItem);


        // ========================================================
        // RECALCULATE PARENT TOTAL
        // ========================================================

        recalculatePurchaseTotal(purchase);
    }

}

/*
package com.skcp.service;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.Purchase;
import com.skcp.entity.PurchaseItem;
import com.skcp.entity.RawMaterial;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PurchaseItemMapper;
import com.skcp.repository.PurchaseItemRepository;
import com.skcp.repository.PurchaseRepository;
import com.skcp.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PurchaseItemService
{
    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public PurchaseItemService(
            PurchaseItemRepository purchaseItemRepository,
            PurchaseRepository purchaseRepository,
            RawMaterialRepository rawMaterialRepository
    )
    {
        this.purchaseItemRepository = purchaseItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }


    // ============================================================
    // CREATE PURCHASE ITEM
    // ============================================================

    @Transactional
    public PurchaseItemResponse createPurchaseItem(
            Integer purchaseId,
            PurchaseItemCreateRequest request
    )
    {
        Purchase purchase =
                purchaseRepository.findById(purchaseId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase not found with id: "
                                                + purchaseId
                                )
                        );

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

        PurchaseItem purchaseItem =
                PurchaseItemMapper.toEntity(request);

        purchaseItem.setPurchase(purchase);
        purchaseItem.setRawMaterial(rawMaterial);

        BigDecimal lineAmount =
                request.getQuantity()
                        .multiply(request.getUnitPrice());

        purchaseItem.setLineAmount(lineAmount);

        PurchaseItem savedPurchaseItem =
                purchaseItemRepository.save(purchaseItem);

        recalculatePurchaseTotal(purchase);

        return PurchaseItemMapper.toResponse(
                savedPurchaseItem
        );
    }


    // ============================================================
    // RECALCULATE PURCHASE TOTAL
    // ============================================================

    private void recalculatePurchaseTotal(
            Purchase purchase
    )
    {
        BigDecimal totalAmount =
                purchaseItemRepository
                        .findAll()
                        .stream()
                        .filter(item ->
                                item.getPurchase() != null
                                        && item.getPurchase()
                                                .getPurchaseId()
                                                .equals(
                                                        purchase.getPurchaseId()
                                                )
                        )
                        .map(PurchaseItem::getLineAmount)
                        .filter(lineAmount -> lineAmount != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        purchase.setTotalAmount(totalAmount);

        purchaseRepository.save(purchase);
    }


    // ============================================================
    // GET ALL PURCHASE ITEMS
    // ============================================================

    public List<PurchaseItemResponse> getAllPurchaseItems()
    {
        return purchaseItemRepository.findAll()
                .stream()
                .map(PurchaseItemMapper::toResponse)
                .toList();
    }


    // ============================================================
    // GET PURCHASE ITEM BY ID
    // ============================================================

    public PurchaseItemResponse getPurchaseItemById(
            Integer id
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );

        return PurchaseItemMapper.toResponse(
                purchaseItem
        );
    }


    // ============================================================
    // UPDATE PURCHASE ITEM
    // ============================================================

    @Transactional
    public PurchaseItemResponse updatePurchaseItem(
            Integer id,
            PurchaseItemUpdateRequest request
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );

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

        Purchase purchase =
                purchaseItem.getPurchase();

        PurchaseItemMapper.updateEntity(
                purchaseItem,
                request
        );

        purchaseItem.setRawMaterial(rawMaterial);

        BigDecimal lineAmount =
                request.getQuantity()
                        .multiply(request.getUnitPrice());

        purchaseItem.setLineAmount(lineAmount);

        PurchaseItem updatedPurchaseItem =
                purchaseItemRepository.save(purchaseItem);

        recalculatePurchaseTotal(purchase);

        return PurchaseItemMapper.toResponse(
                updatedPurchaseItem
        );
    }


    // ============================================================
    // DELETE PURCHASE ITEM
    // ============================================================

    @Transactional
    public void deletePurchaseItem(
            Integer id
    )
    {
        PurchaseItem purchaseItem =
                purchaseItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase item not found with id: "
                                                + id
                                )
                        );

        Purchase purchase =
                purchaseItem.getPurchase();

        purchaseItemRepository.delete(purchaseItem);

        recalculatePurchaseTotal(purchase);
    }
}

*/


/* package com.skcp.service;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.Purchase;
import com.skcp.entity.PurchaseItem;
import com.skcp.entity.RawMaterial;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PurchaseItemMapper;

import com.skcp.repository.PurchaseItemRepository;
import com.skcp.repository.PurchaseRepository;
import com.skcp.repository.RawMaterialRepository;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PurchaseItemService
{

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final PurchaseItemRepository purchaseItemRepository;

    private final PurchaseRepository purchaseRepository;

    private final RawMaterialRepository rawMaterialRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public PurchaseItemService(
            PurchaseItemRepository purchaseItemRepository,
            PurchaseRepository purchaseRepository,
            RawMaterialRepository rawMaterialRepository
    )
    {
        this.purchaseItemRepository =
                purchaseItemRepository;

        this.purchaseRepository =
                purchaseRepository;

        this.rawMaterialRepository =
                rawMaterialRepository;
    }

        // ============================================================
        // 1. CREATE PURCHASE ITEM
        // ============================================================

        public PurchaseItemResponse createPurchaseItem(
        Integer purchaseId,
        PurchaseItemCreateRequest request)
        
        {
            
        // ------------------------------------------------------------
        // 1.A. FIND PURCHASE
        // ------------------------------------------------------------

        Purchase purchase =
                purchaseRepository.findById(
                        purchaseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase not found with id: "
                                        + purchaseId )
                );


        // ------------------------------------------------------------
        // 1.B. FIND RAW MATERIAL
        // ------------------------------------------------------------

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(
                        request.getRawMaterialId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Raw material not found with id: "
                                        + request.getRawMaterialId()
                        )
                );

        // ------------------------------------------------------------
        // 1.C. REQUEST → ENTITY
        // ------------------------------------------------------------

        PurchaseItem purchaseItem =
                PurchaseItemMapper.toEntity(request);

        // ------------------------------------------------------------
        // 1.D. SET BACKEND-CONTROLLED RELATIONSHIPS
        // ------------------------------------------------------------
        purchaseItem.setPurchase(purchase);
        purchaseItem.setRawMaterial(rawMaterial);

        // ------------------------------------------------------------
        // 1.E. CALCULATE LINE AMOUNT
        // ------------------------------------------------------------

        BigDecimal lineAmount =
                request.getQuantity()
                        .multiply(request.getUnitPrice());

        purchaseItem.setLineAmount(lineAmount);

        // ------------------------------------------------------------
        // 1.F. SAVE PURCHASE ITEM
        // ------------------------------------------------------------

        PurchaseItem savedPurchaseItem =
                purchaseItemRepository.save(purchaseItem);

        // ------------------------------------------------------------
        // 1.G. RECALCULATE PURCHASE TOTAL
        // ------------------------------------------------------------

        recalculatePurchaseTotal(purchase);

        // ------------------------------------------------------------
        // 1.H. ENTITY → RESPONSE DTO
        // ------------------------------------------------------------

        return PurchaseItemMapper.toResponse(
                savedPurchaseItem
        );

        }

        // ============================================================
        // 1. I. RECALCULATE PURCHASE TOTAL
        // ============================================================

        private void recalculatePurchaseTotal(
                Purchase purchase
        )
        
        {
            BigDecimal totalAmount =
                    purchaseItemRepository
                            .findAll()
                            .stream()
                            .filter(item ->
                                    item.getPurchase()
                                            .getPurchaseId()
                                            .equals(
                                                    purchase.getPurchaseId()
                                            )
                            )
                            .map(PurchaseItem::getLineAmount)
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add
                            );

            purchase.setTotalAmount(totalAmount);

            purchaseRepository.save(purchase);
        }


            // ============================================================
            // 2. GET ALL PURCHASE ITEMS
            // ============================================================

            public List<PurchaseItemResponse> getAllPurchaseItems()
            {
                return purchaseItemRepository.findAll()
                        .stream()
                        .map(PurchaseItemMapper::toResponse)
                        .toList();
            }

            // ============================================================
            // 3. GET PURCHASE ITEM BY ID
            // ============================================================

            public PurchaseItemResponse getPurchaseItemById(Integer id)
            {
                PurchaseItem purchaseItem =
                        purchaseItemRepository.findById(id)
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Purchase item not found with id: " + id
                                        )
                                );

                return PurchaseItemMapper.toResponse(purchaseItem);
            }


            // ============================================================
            // 4. UPDATE PURCHASE ITEM
            // ============================================================

            public PurchaseItemResponse updatePurchaseItem(
                    Integer id,
                    PurchaseItemUpdateRequest request
            )
            {
                        // ------------------------------------------------------------
                        // 4.A.FIND PURCHASE ITEM
                        // ------------------------------------------------------------

                        PurchaseItem purchaseItem =
                                purchaseItemRepository.findById(id)
                                        .orElseThrow(() ->
                                                new ResourceNotFoundException(
                                                        "Purchase item not found with id: " + id
                                                )
                                        );


                        // ------------------------------------------------------------
                        // 4.B. FIND RAW MATERIAL
                        // ------------------------------------------------------------

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


                        // ------------------------------------------------------------
                        // 4.C. UPDATE PURCHASE ITEM FIELDS
                        // ------------------------------------------------------------

                        purchaseItem.setRawMaterial(rawMaterial);

                        purchaseItem.setQuantity(
                                request.getQuantity()
                        );

                        purchaseItem.setUnit(
                                request.getUnit()
                        );

                        purchaseItem.setUnitPrice(
                                request.getUnitPrice()
                        );

                        purchaseItem.setRemarks(
                                request.getRemarks()
                        );


                        // ------------------------------------------------------------
                        // 4.D. RECALCULATE LINE AMOUNT
                        // ------------------------------------------------------------

                        BigDecimal lineAmount =
                                request.getQuantity()
                                        .multiply(request.getUnitPrice());

                        purchaseItem.setLineAmount(lineAmount);


                        // ------------------------------------------------------------
                        // 4.E.SAVE UPDATED PURCHASE ITEM
                        // ------------------------------------------------------------

                        PurchaseItem updatedPurchaseItem =
                                purchaseItemRepository.save(purchaseItem);


                        // ------------------------------------------------------------
                        // 4.F. RECALCULATE PURCHASE TOTAL
                        // ------------------------------------------------------------

                        recalculatePurchaseTotal(
                                purchaseItem.getPurchase()
                        );


                        // ------------------------------------------------------------
                        // 4.G. ENTITY → RESPONSE DTO
                        // ------------------------------------------------------------

                        return PurchaseItemMapper.toResponse(
                                updatedPurchaseItem
                        );
                    }


                            // ============================================================
                            // 5.  DELETE PURCHASE ITEM
                            // ============================================================

                            public void deletePurchaseItem(Integer id)
                            {
                                // ------------------------------------------------------------
                                // 5. A. FIND PURCHASE ITEM
                                // ------------------------------------------------------------

                                PurchaseItem purchaseItem =
                                        purchaseItemRepository.findById(id)
                                                .orElseThrow(() ->
                                                        new ResourceNotFoundException(
                                                                "Purchase item not found with id: " + id
                                                        )
                                                );


                                // ------------------------------------------------------------
                                // 5. B. REMEMBER PARENT PURCHASE
                                // ------------------------------------------------------------

                                Purchase purchase =
                                        purchaseItem.getPurchase();


                                // ------------------------------------------------------------
                                // 5. C.DELETE PURCHASE ITEM
                                // ------------------------------------------------------------

                                purchaseItemRepository.delete(purchaseItem);


                                // ------------------------------------------------------------
                                // 5. E. RECALCULATE PURCHASE TOTAL
                                // ------------------------------------------------------------

                                recalculatePurchaseTotal(purchase);
                            }


}

*/





/* 
package com.skcp.service;

import com.skcp.entity.PurchaseItem;
import com.skcp.repository.PurchaseItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseItemService 
{

    // Dependency Injection
    private final PurchaseItemRepository purchaseItemRepository;

    // Constructor Injection
    public PurchaseItemService(PurchaseItemRepository purchaseItemRepository) 
    {
        this.purchaseItemRepository = purchaseItemRepository;
    }

    // Get all purchase items
    public List<PurchaseItem> getAllPurchaseItems() 
    {
        return purchaseItemRepository.findAll();
    }

    // Save purchase item
    public PurchaseItem savePurchaseItem(PurchaseItem purchaseItem) 
    {
        return purchaseItemRepository.save(purchaseItem);
    }

    // Find purchase item by ID
    public PurchaseItem getPurchaseItemById(Integer id) 
    {
        return purchaseItemRepository.findById(id).orElse(null);
    }

    // Delete purchase item
    public void deletePurchaseItem(Integer id) 
    {
        purchaseItemRepository.deleteById(id);
    }
}


 */