package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.paymentallocation.PaymentAllocationCreateRequest;
import com.skcp.dto.request.paymentallocation.PaymentAllocationUpdateRequest;
import com.skcp.dto.response.paymentallocation.PaymentAllocationResponse;
import com.skcp.dto.response.paymentallocation.PaymentAllocationSummaryResponse;
import com.skcp.service.PaymentAllocationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-allocations")
@CrossOrigin(origins = "*")
public class PaymentAllocationController {

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    private final PaymentAllocationService paymentAllocationService;

    public PaymentAllocationController(
            PaymentAllocationService paymentAllocationService) {

        this.paymentAllocationService = paymentAllocationService;
    }


    // ============================================================
    // GET ALL ACTIVE PAYMENT ALLOCATIONS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<PaymentAllocationSummaryResponse>>
            > getAllPaymentAllocations() {

        List<PaymentAllocationSummaryResponse> allocations =
                paymentAllocationService.getAllPaymentAllocations();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment allocations retrieved successfully",
                        allocations
                )
        );
    }


    // ============================================================
    // GET ACTIVE PAYMENT ALLOCATION BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PaymentAllocationResponse>
            > getPaymentAllocationById(
                    @PathVariable Integer id) {

        PaymentAllocationResponse allocation =
                paymentAllocationService.getPaymentAllocationById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment allocation retrieved successfully",
                        allocation
                )
        );
    }


    // ============================================================
    // CREATE PAYMENT ALLOCATION
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<PaymentAllocationResponse>
            > createPaymentAllocation(
                    @Valid
                    @RequestBody
                    PaymentAllocationCreateRequest request) {

        PaymentAllocationResponse savedAllocation =
                paymentAllocationService.createPaymentAllocation(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Payment allocation created successfully",
                                savedAllocation
                        )
                );
    }


    // ============================================================
    // UPDATE PAYMENT ALLOCATION
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PaymentAllocationResponse>
            > updatePaymentAllocation(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody
                    PaymentAllocationUpdateRequest request) {

        PaymentAllocationResponse updatedAllocation =
                paymentAllocationService.updatePaymentAllocation(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment allocation updated successfully",
                        updatedAllocation
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE PAYMENT ALLOCATION
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
    // Database row is preserved.
    //
    // The Service is responsible for:
    //     - finding the allocation
    //     - checking recordStatus
    //     - changing ACTIVE → INACTIVE
    //     - throwing the appropriate exception
    //
    // The finalized exception architecture handles
    // the corresponding API error response.
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deletePaymentAllocation(
                    @PathVariable Integer id) {

        paymentAllocationService.deletePaymentAllocation(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Payment allocation deleted successfully",
                        null
                )
        );
    }
}