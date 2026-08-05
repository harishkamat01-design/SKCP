package com.skcp.controller;

import com.skcp.entity.Purchase;
import com.skcp.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    // Dependency Injection
    private final PurchaseService purchaseService;

    // Constructor Injection
    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    // Get all purchases
    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {

        List<Purchase> purchaseList = purchaseService.getAllPurchases();

        return ResponseEntity.ok(purchaseList);
    }

    // Get purchase by ID
    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable Integer id) {

        Purchase purchase = purchaseService.getPurchaseById(id);

        if (purchase == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(purchase);
    }

    // Create purchase
    @PostMapping
    public ResponseEntity<Purchase> createPurchase(@RequestBody Purchase purchase) {

        Purchase savedPurchase = purchaseService.savePurchase(purchase);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPurchase);
    }

    // Update purchase
    @PutMapping("/{id}")
    public ResponseEntity<Purchase> updatePurchase(
            @PathVariable Integer id,
            @RequestBody Purchase purchase) {

        Purchase existingPurchase = purchaseService.getPurchaseById(id);

        if (existingPurchase == null) {
            return ResponseEntity.notFound().build();
        }

        // Update editable fields
        existingPurchase.setSupplier(purchase.getSupplier());
        existingPurchase.setPurchaseDate(purchase.getPurchaseDate());
        existingPurchase.setInvoiceNumber(purchase.getInvoiceNumber());
        existingPurchase.setTotalAmount(purchase.getTotalAmount());
        existingPurchase.setPaymentStatus(purchase.getPaymentStatus());
        existingPurchase.setRemarks(purchase.getRemarks());
        existingPurchase.setStatus(purchase.getStatus());

        Purchase updatedPurchase =
                purchaseService.savePurchase(existingPurchase);

        return ResponseEntity.ok(updatedPurchase);
    }

    // Delete purchase
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(@PathVariable Integer id) {

        Purchase existingPurchase = purchaseService.getPurchaseById(id);

        if (existingPurchase == null) {
            return ResponseEntity.notFound().build();
        }

        purchaseService.deletePurchase(id);

        return ResponseEntity.noContent().build();
    }
}

