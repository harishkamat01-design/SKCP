package com.skcp.service;

import com.skcp.entity.Purchase;
import com.skcp.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseService {

    // Dependency Injection
    private final PurchaseRepository purchaseRepository;

    // Constructor Injection
    public PurchaseService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    // Get all purchases
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    // Save purchase
    public Purchase savePurchase(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    // Find purchase by ID
    public Purchase getPurchaseById(Integer id) {
        return purchaseRepository.findById(id).orElse(null);
    }

    // Delete purchase
    public void deletePurchase(Integer id) {
        purchaseRepository.deleteById(id);
    }
}


/****************************************************************
 Current Architecture:
 
Postman / Frontend

        │
        ▼
PurchaseController

        │
        ▼
PurchaseService

        │
        ▼
PurchaseRepository

        │
        ▼
Hibernate (JPA)

        │
        ▼

PostgreSQL
********************************************************************/