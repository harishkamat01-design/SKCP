package com.skcp.controller;

import com.skcp.entity.PaymentAllocation;
import com.skcp.service.PaymentAllocationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-allocations")
@CrossOrigin(origins = "*")
public class PaymentAllocationController {

    // Dependency Injection
    private final PaymentAllocationService paymentAllocationService;

    // Constructor Injection
    public PaymentAllocationController(PaymentAllocationService paymentAllocationService) {
        this.paymentAllocationService = paymentAllocationService;
    }

    // =====================================================
    // GET ALL PAYMENT ALLOCATIONS
    // =====================================================
    @GetMapping
    public ResponseEntity<List<PaymentAllocation>> getAllPaymentAllocations() {

        List<PaymentAllocation> paymentAllocations =
                paymentAllocationService.getAllPaymentAllocations();

        return new ResponseEntity<>(paymentAllocations, HttpStatus.OK);
    }

    // =====================================================
    // GET PAYMENT ALLOCATION BY ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<PaymentAllocation> getPaymentAllocationById(
            @PathVariable Integer id) {

        Optional<PaymentAllocation> paymentAllocation =
                paymentAllocationService.getPaymentAllocationById(id);

        return paymentAllocation
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // =====================================================
    // CREATE PAYMENT ALLOCATION
    // =====================================================
    @PostMapping
    public ResponseEntity<PaymentAllocation> createPaymentAllocation(
            @RequestBody PaymentAllocation paymentAllocation) {

        PaymentAllocation savedPaymentAllocation =
                paymentAllocationService.savePaymentAllocation(paymentAllocation);

        return new ResponseEntity<>(savedPaymentAllocation, HttpStatus.CREATED);
    }

    // =====================================================
    // UPDATE PAYMENT ALLOCATION
    // =====================================================
    @PutMapping("/{id}")
    public ResponseEntity<PaymentAllocation> updatePaymentAllocation(
            @PathVariable Integer id,
            @RequestBody PaymentAllocation paymentAllocation) {

        Optional<PaymentAllocation> existingPaymentAllocation =
                paymentAllocationService.getPaymentAllocationById(id);

        if (existingPaymentAllocation.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        PaymentAllocation updatedPaymentAllocation =
                paymentAllocationService.updatePaymentAllocation(id, paymentAllocation);

        return new ResponseEntity<>(updatedPaymentAllocation, HttpStatus.OK);
    }

    // =====================================================
    // DELETE PAYMENT ALLOCATION
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentAllocation(
            @PathVariable Integer id) {

        Optional<PaymentAllocation> existingPaymentAllocation =
                paymentAllocationService.getPaymentAllocationById(id);

        if (existingPaymentAllocation.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        paymentAllocationService.deletePaymentAllocation(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}