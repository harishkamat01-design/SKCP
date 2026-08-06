package com.skcp.service;

import com.skcp.entity.DeliveryItem;
import com.skcp.repository.DeliveryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryItemService {

    private final DeliveryItemRepository deliveryItemRepository;

    // Constructor Injection
    public DeliveryItemService(DeliveryItemRepository deliveryItemRepository) {
        this.deliveryItemRepository = deliveryItemRepository;
    }

    // ==========================
    // CREATE
    // ==========================
    public DeliveryItem saveDeliveryItem(DeliveryItem deliveryItem) {
        return deliveryItemRepository.save(deliveryItem);
    }

    // ==========================
    // READ ALL
    // ==========================
    public List<DeliveryItem> getAllDeliveryItems() {
        return deliveryItemRepository.findAll();
    }

    // ==========================
    // READ BY ID
    // ==========================
    public Optional<DeliveryItem> getDeliveryItemById(Integer deliveryItemId) {
        return deliveryItemRepository.findById(deliveryItemId);
    }

    // ==========================
    // UPDATE
    // ==========================
    public DeliveryItem updateDeliveryItem(Integer deliveryItemId,
                                           DeliveryItem updatedDeliveryItem) {

        return deliveryItemRepository.findById(deliveryItemId)
                .map(existingDeliveryItem -> {

                    existingDeliveryItem.setDelivery(updatedDeliveryItem.getDelivery());
                    existingDeliveryItem.setProduct(updatedDeliveryItem.getProduct());
                    existingDeliveryItem.setDeliveredQuantity(updatedDeliveryItem.getDeliveredQuantity());
                    existingDeliveryItem.setRemarks(updatedDeliveryItem.getRemarks());

                    return deliveryItemRepository.save(existingDeliveryItem);

                })
                .orElseThrow(() ->
                        new RuntimeException("Delivery Item not found with ID : " + deliveryItemId));
    }

    // ==========================
    // DELETE
    // ==========================
    public void deleteDeliveryItem(Integer deliveryItemId) {
        deliveryItemRepository.deleteById(deliveryItemId);
    }
} 