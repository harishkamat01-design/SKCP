package com.skcp.service;

import com.skcp.entity.PurchaseItem;
import com.skcp.repository.PurchaseItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseItemService 
{

    // Dependency Injection
    private final PurchaseItemRepository purchaseItemRepository;

    // Constructor Injection
    public PurchaseItemService(PurchaseItemRepository purchaseItemRepository) 
    {
        this.purchaseItemRepository = purchaseItemRepository;
    }

    // Get all purchase items
    public List<PurchaseItem> getAllPurchaseItems() 
    {
        return purchaseItemRepository.findAll();
    }

    // Save purchase item
    public PurchaseItem savePurchaseItem(PurchaseItem purchaseItem) 
    {
        return purchaseItemRepository.save(purchaseItem);
    }

    // Find purchase item by ID
    public PurchaseItem getPurchaseItemById(Integer id) 
    {
        return purchaseItemRepository.findById(id).orElse(null);
    }

    // Delete purchase item
    public void deletePurchaseItem(Integer id) 
    {
        purchaseItemRepository.deleteById(id);
    }
}