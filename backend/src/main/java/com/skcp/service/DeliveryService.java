package com.skcp.service;

import com.skcp.dto.request.delivery.DeliveryCreateRequest;
import com.skcp.dto.request.delivery.DeliveryUpdateRequest;
import com.skcp.dto.response.delivery.DeliveryResponse;
import com.skcp.dto.response.delivery.DeliverySummaryResponse;
import com.skcp.entity.Delivery;
import com.skcp.entity.Order;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.DeliveryMapper;
import com.skcp.repository.DeliveryRepository;
import com.skcp.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            OrderRepository orderRepository) {

        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
    }


    // ============================================================
    // GET ALL ACTIVE DELIVERIES
    // ============================================================

    public List<DeliverySummaryResponse> getAllDeliveries() {

        return deliveryRepository
                .findByRecordStatus("ACTIVE")
                .stream()
                .map(DeliveryMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ACTIVE DELIVERY BY ID
    // ============================================================

    public DeliveryResponse getDeliveryById(Integer id) {

        Delivery delivery =
                deliveryRepository
                        .findByDeliveryIdAndRecordStatus(
                                id,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery not found with id: " + id
                                )
                        );

        return DeliveryMapper.toResponse(delivery);
    }


    // ============================================================
    // CREATE DELIVERY
    // ============================================================

    public DeliveryResponse createDelivery(
            DeliveryCreateRequest request) {

        // --------------------------------------------------------
        // Validate Order
        // --------------------------------------------------------

        Order order =
                orderRepository.findById(
                        request.getOrderId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: "
                                        + request.getOrderId()
                        )
                );


        // --------------------------------------------------------
        // Map Request → Entity
        // --------------------------------------------------------

        Delivery delivery =
                DeliveryMapper.toEntity(
                        request,
                        order
                );


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        Delivery savedDelivery =
                deliveryRepository.save(delivery);


        // --------------------------------------------------------
        // Entity → Response
        // --------------------------------------------------------

        return DeliveryMapper.toResponse(savedDelivery);
    }


    // ============================================================
    // UPDATE DELIVERY
    // ============================================================

    public DeliveryResponse updateDelivery(
            Integer id,
            DeliveryUpdateRequest request) {

        // --------------------------------------------------------
        // Find ACTIVE Delivery
        // --------------------------------------------------------

        Delivery delivery =
                deliveryRepository
                        .findByDeliveryIdAndRecordStatus(
                                id,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery not found with id: " + id
                                )
                        );


        // --------------------------------------------------------
        // Validate Order
        // --------------------------------------------------------

        Order order =
                orderRepository.findById(
                        request.getOrderId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: "
                                        + request.getOrderId()
                        )
                );


        // --------------------------------------------------------
        // Update Entity
        // --------------------------------------------------------

        DeliveryMapper.updateEntity(
                delivery,
                request,
                order
        );


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        Delivery updatedDelivery =
                deliveryRepository.save(delivery);


        // --------------------------------------------------------
        // Entity → Response
        // --------------------------------------------------------

        return DeliveryMapper.toResponse(updatedDelivery);
    }


    // ============================================================
    // SOFT DELETE DELIVERY
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Valid ACTIVE ID:
    //     200 OK
    //
    // Already INACTIVE:
    //     409 CONFLICT
    //
    // Invalid ID:
    //     404 NOT FOUND
    //
    // No physical DELETE occurs.
    // ============================================================

    public void deleteDelivery(Integer id) {

        Delivery delivery =
                deliveryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery not found with id: " + id
                                )
                        );


        // --------------------------------------------------------
        // Already INACTIVE
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                delivery.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Delivery already deleted with id: " + id
            );
        }


        // --------------------------------------------------------
        // Soft Delete
        // --------------------------------------------------------

        delivery.setRecordStatus("INACTIVE");

        deliveryRepository.save(delivery);
    }
}