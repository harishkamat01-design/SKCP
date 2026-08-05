package com.skcp.controller;

import com.skcp.entity.PurchaseItem;
import com.skcp.service.PurchaseItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-items")
public class PurchaseItemController {

    // Dependency Injection
    private final PurchaseItemService purchaseItemService;

    // Constructor Injection
    public PurchaseItemController(PurchaseItemService purchaseItemService) {
        this.purchaseItemService = purchaseItemService;
    }

    // Get all purchase items
    @GetMapping
    public ResponseEntity<List<PurchaseItem>> getAllPurchaseItems() {

        List<PurchaseItem> purchaseItems =
                purchaseItemService.getAllPurchaseItems();

        return ResponseEntity.ok(purchaseItems);
    }

    // Get purchase item by ID
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseItem> getPurchaseItemById(
            @PathVariable Integer id) {

        PurchaseItem purchaseItem =
                purchaseItemService.getPurchaseItemById(id);

        if (purchaseItem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(purchaseItem);
    }

    // Create purchase item
    @PostMapping
    public ResponseEntity<PurchaseItem> createPurchaseItem(
            @RequestBody PurchaseItem purchaseItem) {

        PurchaseItem savedPurchaseItem =
                purchaseItemService.savePurchaseItem(purchaseItem);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedPurchaseItem);
    }

    // Update purchase item
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseItem> updatePurchaseItem(
            @PathVariable Integer id,
            @RequestBody PurchaseItem purchaseItem) {

        PurchaseItem existingPurchaseItem =
                purchaseItemService.getPurchaseItemById(id);

        if (existingPurchaseItem == null) {
            return ResponseEntity.notFound().build();
        }

        // Update editable fields

        existingPurchaseItem.setPurchase(purchaseItem.getPurchase());
        existingPurchaseItem.setRawMaterial(purchaseItem.getRawMaterial());
        existingPurchaseItem.setQuantity(purchaseItem.getQuantity());
        existingPurchaseItem.setUnit(purchaseItem.getUnit());
        existingPurchaseItem.setUnitPrice(purchaseItem.getUnitPrice());
        existingPurchaseItem.setLineAmount(purchaseItem.getLineAmount());
        existingPurchaseItem.setRemarks(purchaseItem.getRemarks());

        PurchaseItem updatedPurchaseItem =
                purchaseItemService.savePurchaseItem(existingPurchaseItem);

        return ResponseEntity.ok(updatedPurchaseItem);
    }

    // Delete purchase item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseItem(
            @PathVariable Integer id) {

        PurchaseItem existingPurchaseItem =
                purchaseItemService.getPurchaseItemById(id);

        if (existingPurchaseItem == null) {
            return ResponseEntity.notFound().build();
        }

        purchaseItemService.deletePurchaseItem(id);

        return ResponseEntity.noContent().build();
    }
}