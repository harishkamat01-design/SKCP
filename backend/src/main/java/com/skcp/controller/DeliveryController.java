package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.delivery.DeliveryCreateRequest;
import com.skcp.dto.request.delivery.DeliveryUpdateRequest;
import com.skcp.dto.response.delivery.DeliveryResponse;
import com.skcp.dto.response.delivery.DeliverySummaryResponse;
import com.skcp.service.DeliveryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {

        this.deliveryService = deliveryService;
    }


    // ============================================================
    // GET ALL ACTIVE DELIVERIES
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<DeliverySummaryResponse>>
            > getAllDeliveries() {

        List<DeliverySummaryResponse> deliveries =
                deliveryService.getAllDeliveries();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Deliveries retrieved successfully",
                        deliveries
                )
        );
    }


    // ============================================================
    // GET ACTIVE DELIVERY BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<DeliveryResponse>
            > getDeliveryById(
                    @PathVariable Integer id) {

        DeliveryResponse delivery =
                deliveryService.getDeliveryById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery retrieved successfully",
                        delivery
                )
        );
    }


    // ============================================================
    // CREATE DELIVERY
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<DeliveryResponse>
            > createDelivery(
                    @Valid
                    @RequestBody DeliveryCreateRequest request) {

        DeliveryResponse savedDelivery =
                deliveryService.createDelivery(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Delivery created successfully",
                                savedDelivery
                        )
                );
    }


    // ============================================================
    // UPDATE DELIVERY
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<DeliveryResponse>
            > updateDelivery(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody DeliveryUpdateRequest request) {

        DeliveryResponse updatedDelivery =
                deliveryService.updateDelivery(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delivery updated successfully",
                        updatedDelivery
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE DELIVERY
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Valid ACTIVE ID:
    //     200 OK
    //
    // Already INACTIVE:
    //     409 CONFLICT
    //
    // Invalid ID:
    //     404 NOT FOUND
    //
    // No physical DELETE occurs.
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteDelivery(
                    @PathVariable Integer id) {

        deliveryService.deleteDelivery(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Delivery deleted successfully",
                        null
                )
        );
    }
}