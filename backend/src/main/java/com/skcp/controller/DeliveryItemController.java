package com.skcp.controller;

import com.skcp.entity.DeliveryItem;
import com.skcp.service.DeliveryItemService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-items")
@CrossOrigin(origins = "*")
public class DeliveryItemController {

    // Dependency Injection
    private final DeliveryItemService deliveryItemService;

    // Constructor Injection
    public DeliveryItemController(DeliveryItemService deliveryItemService) {
        this.deliveryItemService = deliveryItemService;
    }

    // =====================================================
    // GET ALL DELIVERY ITEMS
    // =====================================================
    @GetMapping
    public ResponseEntity<List<DeliveryItem>> getAllDeliveryItems() {

        List<DeliveryItem> deliveryItems =
                deliveryItemService.getAllDeliveryItems();

        return new ResponseEntity<>(deliveryItems, HttpStatus.OK);
    }

    // =====================================================
    // GET DELIVERY ITEM BY ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryItem> getDeliveryItemById(
            @PathVariable Integer id) {

        Optional<DeliveryItem> deliveryItem =
                deliveryItemService.getDeliveryItemById(id);

        return deliveryItem
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // =====================================================
    // CREATE DELIVERY ITEM
    // =====================================================
    @PostMapping
    public ResponseEntity<DeliveryItem> createDeliveryItem(
            @RequestBody DeliveryItem deliveryItem) {

        DeliveryItem savedDeliveryItem =
                deliveryItemService.saveDeliveryItem(deliveryItem);

        return new ResponseEntity<>(savedDeliveryItem, HttpStatus.CREATED);
    }

    // =====================================================
    // UPDATE DELIVERY ITEM
    // =====================================================
    @PutMapping("/{id}")
    public ResponseEntity<DeliveryItem> updateDeliveryItem(
            @PathVariable Integer id,
            @RequestBody DeliveryItem deliveryItem) {

        Optional<DeliveryItem> existingDeliveryItem =
                deliveryItemService.getDeliveryItemById(id);

        if (existingDeliveryItem.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        DeliveryItem updatedDeliveryItem =
                deliveryItemService.updateDeliveryItem(id, deliveryItem);

        return new ResponseEntity<>(updatedDeliveryItem, HttpStatus.OK);
    }

    // =====================================================
    // DELETE DELIVERY ITEM
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliveryItem(
            @PathVariable Integer id) {

        Optional<DeliveryItem> existingDeliveryItem =
                deliveryItemService.getDeliveryItemById(id);

        if (existingDeliveryItem.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        deliveryItemService.deleteDeliveryItem(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

/*

Endpoint: /api/delivery-items
Using the plural resource name follows REST API best practices.

HTTP Methods:
| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | `/api/delivery-items` | Retrieve all delivery items |
| GET | `/api/delivery-items/{id}` | Retrieve a delivery item by ID |
| POST | `/api/delivery-items` | Create a delivery item |
| PUT | `/api/delivery-items/{id}` | Update a delivery item |
| DELETE | `/api/delivery-items/{id}` | Delete a delivery item |

HTTP Status Codes:
| Status | Meaning |
|---------|---------|
| **200 OK** | Successful GET / PUT |
| **201 CREATED** | Successful POST |
| **204 NO CONTENT** | Successful DELETE |
| **404 NOT FOUND** | Record not found |











*/