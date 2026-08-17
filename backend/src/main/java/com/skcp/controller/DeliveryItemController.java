package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.deliveryitem.DeliveryItemCreateRequest;
import com.skcp.dto.request.deliveryitem.DeliveryItemUpdateRequest;
import com.skcp.dto.response.deliveryitem.DeliveryItemResponse;
import com.skcp.dto.response.deliveryitem.DeliveryItemSummaryResponse;
import com.skcp.service.DeliveryItemService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-items")
public class DeliveryItemController {

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final DeliveryItemService deliveryItemService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public DeliveryItemController(
            DeliveryItemService deliveryItemService) {

        this.deliveryItemService = deliveryItemService;
    }


    // ============================================================
    // GET ALL ACTIVE DELIVERY ITEMS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<DeliveryItemSummaryResponse>>
            > getAllDeliveryItems() {

        List<DeliveryItemSummaryResponse> deliveryItems =
                deliveryItemService.getAllDeliveryItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery items retrieved successfully",
                        deliveryItems
                )
        );
    }


    // ============================================================
    // GET ACTIVE DELIVERY ITEM BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<DeliveryItemResponse>
            > getDeliveryItemById(
            @PathVariable Integer id) {

        DeliveryItemResponse deliveryItem =
                deliveryItemService.getDeliveryItemById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery item retrieved successfully",
                        deliveryItem
                )
        );
    }


    // ============================================================
    // CREATE DELIVERY ITEM
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<DeliveryItemResponse>
            > createDeliveryItem(
            @Valid
            @RequestBody DeliveryItemCreateRequest request) {

        DeliveryItemResponse savedDeliveryItem =
                deliveryItemService.createDeliveryItem(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Delivery item created successfully",
                                savedDeliveryItem
                        )
                );
    }


    // ============================================================
    // UPDATE DELIVERY ITEM
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<DeliveryItemResponse>
            > updateDeliveryItem(
            @PathVariable Integer id,
            @Valid
            @RequestBody DeliveryItemUpdateRequest request) {

        DeliveryItemResponse updatedDeliveryItem =
                deliveryItemService.updateDeliveryItem(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery item updated successfully",
                        updatedDeliveryItem
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE DELIVERY ITEM
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Database row is preserved.
    //
    // API returns:
    //
    // 200 OK
    // {
    //     "data": null,
    //     "message": "Delivery item deleted successfully",
    //     "status": "SUCCESS",
    //     "timestamp": "..."
    // }
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteDeliveryItem(
            @PathVariable Integer id) {

        deliveryItemService.deleteDeliveryItem(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Delivery item deleted successfully",
                        null
                )
        );
    }

}