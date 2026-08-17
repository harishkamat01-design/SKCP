package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.purchase.PurchaseCreateRequest;
import com.skcp.dto.request.purchase.PurchaseUpdateRequest;
import com.skcp.dto.response.purchase.PurchaseResponse;
import com.skcp.dto.response.purchase.PurchaseSummaryResponse;
import com.skcp.service.PurchaseService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<PurchaseSummaryResponse>>
            > getAllPurchases() {

        List<PurchaseSummaryResponse> purchases =
                purchaseService.getAllPurchases();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchases retrieved successfully",
                        purchases
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseResponse>
            > getPurchaseById(
                    @PathVariable Integer id
            ) {

        PurchaseResponse purchase =
                purchaseService.getPurchaseById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase retrieved successfully",
                        purchase
                )
        );
    }

    @PostMapping
    public ResponseEntity<
            ApiResponse<PurchaseResponse>
            > createPurchase(
                    @Valid @RequestBody PurchaseCreateRequest request
            ) {

        PurchaseResponse savedPurchase =
                purchaseService.createPurchase(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Purchase created successfully",
                        savedPurchase
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PurchaseResponse>
            > updatePurchase(
                    @PathVariable Integer id,
                    @Valid @RequestBody PurchaseUpdateRequest request
            ) {

        PurchaseResponse updatedPurchase =
                purchaseService.updatePurchase(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase updated successfully",
                        updatedPurchase
                )
        );
    }

                        @DeleteMapping("/{id}")
                        public ResponseEntity<ApiResponse<Void>> deletePurchase(
                                @PathVariable Integer id
                        ) {
                        purchaseService.deletePurchase(id);

                        return ResponseEntity.ok(
                                ApiResponse.<Void>success(
                                        "Purchase marked as inactive successfully",
                                        null
                                )
                        );
                        }


}