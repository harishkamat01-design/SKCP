package com.skcp.controller;

import com.skcp.entity.Delivery;
import com.skcp.service.DeliveryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    // Dependency Injection
    private final DeliveryService deliveryService;

    // Constructor Injection
    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // =====================================================
    // GET ALL DELIVERIES
    // =====================================================
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {

        List<Delivery> deliveries = deliveryService.getAllDeliveries();

        return new ResponseEntity<>(deliveries, HttpStatus.OK);
    }

    // =====================================================
    // GET DELIVERY BY ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Integer id) {

        Optional<Delivery> delivery = deliveryService.getDeliveryById(id);

        return delivery
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // =====================================================
    // CREATE DELIVERY
    // =====================================================
    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody Delivery delivery) {

        Delivery savedDelivery = deliveryService.saveDelivery(delivery);

        return new ResponseEntity<>(savedDelivery, HttpStatus.CREATED);
    }

    // =====================================================
    // UPDATE DELIVERY
    // =====================================================
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(
            @PathVariable Integer id,
            @RequestBody Delivery delivery) {

        Optional<Delivery> existingDelivery = deliveryService.getDeliveryById(id);

        if (existingDelivery.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Delivery updatedDelivery = deliveryService.updateDelivery(id, delivery);

        return new ResponseEntity<>(updatedDelivery, HttpStatus.OK);
    }

    // =====================================================
    // DELETE DELIVERY
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Integer id) {

        Optional<Delivery> existingDelivery = deliveryService.getDeliveryById(id);

        if (existingDelivery.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        deliveryService.deleteDelivery(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

 
/*

Endpoint: /api/deliveries
Using the plural resource name follows REST API best practices.


HTTP Methods: 

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | `/api/deliveries` | Retrieve all deliveries |
| GET | `/api/deliveries/{id}` | Retrieve a delivery by ID |
| POST | `/api/deliveries` | Create a new delivery |
| PUT | `/api/deliveries/{id}` | Update an existing delivery |
| DELETE | `/api/deliveries/{id}` | Delete a delivery |

HTTP Status Codes
| Status | Meaning |
|---------|---------|
| **200 OK** | Successful GET or PUT |
| **201 CREATED** | Successful POST |
| **204 NO CONTENT** | Successful DELETE |
| **404 NOT FOUND** | Record not found |

*/