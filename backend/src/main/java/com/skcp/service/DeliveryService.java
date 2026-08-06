package com.skcp.service;

import com.skcp.entity.Delivery;
import com.skcp.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    // Constructor Injection
    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    // ==========================
    // CREATE
    // ==========================
    public Delivery saveDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    // ==========================
    // READ ALL
    // ==========================
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // ==========================
    // READ BY ID
    // ==========================
    public Optional<Delivery> getDeliveryById(Integer deliveryId) {
        return deliveryRepository.findById(deliveryId);
    }

    // ==========================
    // UPDATE
    // ==========================
    public Delivery updateDelivery(Integer deliveryId, Delivery updatedDelivery) {

        return deliveryRepository.findById(deliveryId)
                .map(existingDelivery -> {

                    existingDelivery.setOrder(updatedDelivery.getOrder());
                    existingDelivery.setDeliveryDate(updatedDelivery.getDeliveryDate());
                    existingDelivery.setTripNumber(updatedDelivery.getTripNumber());
                    existingDelivery.setTotalTrips(updatedDelivery.getTotalTrips());
                    existingDelivery.setVehicleType(updatedDelivery.getVehicleType());
                    existingDelivery.setVehicleNumber(updatedDelivery.getVehicleNumber());
                    existingDelivery.setDriverName(updatedDelivery.getDriverName());
                    existingDelivery.setTransportMode(updatedDelivery.getTransportMode());
                    existingDelivery.setTransportCost(updatedDelivery.getTransportCost());
                    existingDelivery.setDeliveryStatus(updatedDelivery.getDeliveryStatus());
                    existingDelivery.setRemarks(updatedDelivery.getRemarks());

                    return deliveryRepository.save(existingDelivery);

                })
                .orElseThrow(() ->
                        new RuntimeException("Delivery not found with ID : " + deliveryId));
    }

    // ==========================
    // DELETE
    // ==========================
    public void deleteDelivery(Integer deliveryId) {
        deliveryRepository.deleteById(deliveryId);
    }
}


/*

# Responsibilities
## Current responsibilities:

Save a delivery
Fetch all deliveries
Fetch a delivery by ID
Update an existing delivery
Delete a delivery

# Constructor Injection:
private final DeliveryRepository deliveryRepository;

Using constructor injection is the recommended Spring Boot practice because it:
- Promotes immutability
- Makes dependencies explicit
- Improves testability

*/