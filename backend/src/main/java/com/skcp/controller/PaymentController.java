package com.skcp.controller;

import com.skcp.entity.Payment;
import com.skcp.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // Constructor Injection
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ==========================
    // CREATE
    // ==========================
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {

        Payment savedPayment = paymentService.savePayment(payment);

        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    // ==========================
    // READ ALL
    // ==========================
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ==========================
    // READ BY ID
    // ==========================
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {

        Optional<Payment> payment = paymentService.getPaymentById(id);

        return payment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================
    // UPDATE
    // ==========================
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Integer id,
                                                 @RequestBody Payment payment) {

        try {

            Payment updatedPayment =
                    paymentService.updatePayment(id, payment);

            return ResponseEntity.ok(updatedPayment);

        } catch (RuntimeException ex) {

            return ResponseEntity.notFound().build();
        }
    }

    // ==========================
    // DELETE
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {

        paymentService.deletePayment(id);

        return ResponseEntity.noContent().build();
    }
}

