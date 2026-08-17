package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.payment.PaymentCreateRequest;
import com.skcp.dto.request.payment.PaymentUpdateRequest;
import com.skcp.dto.response.payment.PaymentResponse;
import com.skcp.dto.response.payment.PaymentSummaryResponse;
import com.skcp.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }


    // ============================================================
    // GET ALL ACTIVE PAYMENTS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<PaymentSummaryResponse>>
            > getAllPayments() {

        List<PaymentSummaryResponse> payments =
                paymentService.getAllPayments();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payments retrieved successfully",
                        payments
                )
        );
    }


    // ============================================================
    // GET ACTIVE PAYMENT BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PaymentResponse>
            > getPaymentById(
                    @PathVariable Integer id) {

        PaymentResponse payment =
                paymentService.getPaymentById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment retrieved successfully",
                        payment
                )
        );
    }


    // ============================================================
    // CREATE PAYMENT
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<PaymentResponse>
            > createPayment(
                    @Valid
                    @RequestBody PaymentCreateRequest request) {

        PaymentResponse savedPayment =
                paymentService.createPayment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Payment created successfully",
                                savedPayment
                        )
                );
    }


    // ============================================================
    // UPDATE PAYMENT
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<PaymentResponse>
            > updatePayment(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody PaymentUpdateRequest request) {

        PaymentResponse updatedPayment =
                paymentService.updatePayment(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment updated successfully",
                        updatedPayment
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE PAYMENT
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
    // The Service is responsible for business logic and
    // throwing the appropriate business exceptions.
    //
    // The finalized exception architecture handles the
    // corresponding API error response.
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deletePayment(
                    @PathVariable Integer id) {

        paymentService.deletePayment(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Payment deleted successfully",
                        null
                )
        );
    }
}