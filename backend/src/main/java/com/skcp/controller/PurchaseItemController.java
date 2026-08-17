package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.service.PurchaseItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-items")
public class PurchaseItemController
{

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final PurchaseItemService purchaseItemService;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public PurchaseItemController(
            PurchaseItemService purchaseItemService
    )
    {
        this.purchaseItemService = purchaseItemService;
    }


    // ============================================================
    // GET ALL PURCHASE ITEMS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<PurchaseItemResponse>>
            > getAllPurchaseItems()
    {

        List<PurchaseItemResponse> purchaseItems =
                purchaseItemService.getAllPurchaseItems();


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase items retrieved successfully",
                        purchaseItems
                )
        );
    }


    // ============================================================
    // GET PURCHASE ITEM BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > getPurchaseItemById(
            @PathVariable Integer id
    )
    {

        PurchaseItemResponse purchaseItem =
                purchaseItemService.getPurchaseItemById(id);


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item retrieved successfully",
                        purchaseItem
                )
        );
    }


    // ============================================================
    // CREATE PURCHASE ITEM
    // ============================================================

    @PostMapping("/purchase/{purchaseId}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > createPurchaseItem(
            @PathVariable Integer purchaseId,
            @Valid @RequestBody
            PurchaseItemCreateRequest request
    )
    {

        PurchaseItemResponse savedPurchaseItem =
                purchaseItemService.createPurchaseItem(
                        purchaseId,
                        request
                );


        /*
         * SKCP API STANDARD:
         *
         * Successful business operations return HTTP 200 OK.
         */

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item created successfully",
                        savedPurchaseItem
                )
        );
    }


    // ============================================================
    // UPDATE PURCHASE ITEM
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > updatePurchaseItem(
            @PathVariable Integer id,
            @Valid @RequestBody
            PurchaseItemUpdateRequest request
    )
    {

        PurchaseItemResponse updatedPurchaseItem =
                purchaseItemService.updatePurchaseItem(
                        id,
                        request
                );


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item updated successfully",
                        updatedPurchaseItem
                )
        );
    }


    // ============================================================
    // DELETE PURCHASE ITEM
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deletePurchaseItem(
            @PathVariable Integer id
    )
    {

        purchaseItemService.deletePurchaseItem(id);


        /*
         * This is a SOFT DELETE.
         *
         * Database:
         * status = INACTIVE
         *
         * Physical row remains in database.
         */

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item deleted successfully",
                        null
                )
        );
    }

}


/*
package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.service.PurchaseItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-items")
public class PurchaseItemController
{

    // Dependency Injection
    private final PurchaseItemService purchaseItemService;

    // Constructor Injection
    public PurchaseItemController(
            PurchaseItemService purchaseItemService
    )
    {
        this.purchaseItemService = purchaseItemService;
    }


    // ============================================================
    // GET ALL PURCHASE ITEMS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<PurchaseItemResponse>>
            > getAllPurchaseItems()
    {
        List<PurchaseItemResponse> purchaseItems =
                purchaseItemService.getAllPurchaseItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase items retrieved successfully",
                        purchaseItems
                )
        );
    }


    // ============================================================
    // GET PURCHASE ITEM BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > getPurchaseItemById(
            @PathVariable Integer id
    )
    {
        PurchaseItemResponse purchaseItem =
                purchaseItemService.getPurchaseItemById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item retrieved successfully",
                        purchaseItem
                )
        );
    }


    // ============================================================
    // CREATE PURCHASE ITEM
    // ============================================================

    @PostMapping("/purchase/{purchaseId}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > createPurchaseItem(
            @PathVariable Integer purchaseId,
            @Valid @RequestBody PurchaseItemCreateRequest request
    )
    {
        PurchaseItemResponse savedPurchaseItem =
                purchaseItemService.createPurchaseItem(
                        purchaseId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Purchase item created successfully",
                                savedPurchaseItem
                        )
                );
    }


    // ============================================================
    // UPDATE PURCHASE ITEM
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseItemResponse>
            > updatePurchaseItem(
            @PathVariable Integer id,
            @Valid @RequestBody PurchaseItemUpdateRequest request
    )
    {
        PurchaseItemResponse updatedPurchaseItem =
                purchaseItemService.updatePurchaseItem(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item updated successfully",
                        updatedPurchaseItem
                )
        );
    }


    // ============================================================
    // DELETE PURCHASE ITEM
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deletePurchaseItem(
            @PathVariable Integer id
    )
    {
        purchaseItemService.deletePurchaseItem(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase item deleted successfully",
                        null
                )
        );
    }

}

*/



/* 
package com.skcp.controller;

import com.skcp.service.PurchaseItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-items")
public class PurchaseItemController
{

    // Dependency Injection
    private final PurchaseItemService purchaseItemService;

    // Constructor Injection
    public PurchaseItemController(
            PurchaseItemService purchaseItemService
    )
    {
        this.purchaseItemService = purchaseItemService;
    }


    // ============================================================
    // GET ALL PURCHASE ITEMS
    // ============================================================

    @GetMapping
    public ResponseEntity<List<PurchaseItemResponse>>
    getAllPurchaseItems()
    {
        List<PurchaseItemResponse> purchaseItems =
                purchaseItemService.getAllPurchaseItems();

        return ResponseEntity.ok(purchaseItems);
    }


    // ============================================================
    // GET PURCHASE ITEM BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseItemResponse>
    getPurchaseItemById(
            @PathVariable Integer id
    )
    {
        PurchaseItemResponse purchaseItem =
                purchaseItemService.getPurchaseItemById(id);

        return ResponseEntity.ok(purchaseItem);
    }


    // ============================================================
    // CREATE PURCHASE ITEM
    // ============================================================

    @PostMapping("/purchase/{purchaseId}")
    public ResponseEntity<PurchaseItemResponse>
    createPurchaseItem(
            @PathVariable Integer purchaseId,
            @Valid @RequestBody PurchaseItemCreateRequest request
    )
    {
        PurchaseItemResponse savedPurchaseItem =
                purchaseItemService.createPurchaseItem(
                        purchaseId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPurchaseItem);
    }


    // ============================================================
    // UPDATE PURCHASE ITEM
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseItemResponse>
    updatePurchaseItem(
            @PathVariable Integer id,
            @Valid @RequestBody PurchaseItemUpdateRequest request
    )
    {
        PurchaseItemResponse updatedPurchaseItem =
                purchaseItemService.updatePurchaseItem(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedPurchaseItem);
    }


    // ============================================================
    // DELETE PURCHASE ITEM
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deletePurchaseItem(
            @PathVariable Integer id
    )
    {
        purchaseItemService.deletePurchaseItem(id);

        return ResponseEntity.noContent().build();
    }

}

*/