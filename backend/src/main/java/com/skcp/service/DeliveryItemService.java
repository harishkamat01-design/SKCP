package com.skcp.service;

import com.skcp.dto.request.deliveryitem.DeliveryItemCreateRequest;
import com.skcp.dto.request.deliveryitem.DeliveryItemUpdateRequest;
import com.skcp.dto.response.deliveryitem.DeliveryItemResponse;
import com.skcp.dto.response.deliveryitem.DeliveryItemSummaryResponse;
import com.skcp.entity.Delivery;
import com.skcp.entity.DeliveryItem;
import com.skcp.entity.Product;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.DeliveryItemMapper;
import com.skcp.repository.DeliveryItemRepository;
import com.skcp.repository.DeliveryRepository;
import com.skcp.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryItemService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final DeliveryItemRepository deliveryItemRepository;
    private final DeliveryRepository deliveryRepository;
    private final ProductRepository productRepository;
    private final DeliveryItemMapper deliveryItemMapper;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public DeliveryItemService(
            DeliveryItemRepository deliveryItemRepository,
            DeliveryRepository deliveryRepository,
            ProductRepository productRepository,
            DeliveryItemMapper deliveryItemMapper) {

        this.deliveryItemRepository = deliveryItemRepository;
        this.deliveryRepository = deliveryRepository;
        this.productRepository = productRepository;
        this.deliveryItemMapper = deliveryItemMapper;
    }


    // ============================================================
    // GET ALL ACTIVE DELIVERY ITEMS
    // ============================================================

    public List<DeliveryItemSummaryResponse> getAllDeliveryItems() {

        return deliveryItemRepository
                .findByRecordStatus("ACTIVE")
                .stream()
                .map(deliveryItemMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ACTIVE DELIVERY ITEM BY ID
    // ============================================================

    public DeliveryItemResponse getDeliveryItemById(
            Integer deliveryItemId) {

        DeliveryItem deliveryItem =
                deliveryItemRepository
                        .findByDeliveryItemIdAndRecordStatus(
                                deliveryItemId,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery item not found with id: "
                                                + deliveryItemId
                                )
                        );

        return deliveryItemMapper.toResponse(deliveryItem);
    }


    // ============================================================
    // CREATE DELIVERY ITEM
    // ============================================================

    public DeliveryItemResponse createDeliveryItem(
            DeliveryItemCreateRequest request) {

        // --------------------------------------------------------
        // Validate Delivery
        // --------------------------------------------------------

        Delivery delivery =
                deliveryRepository.findById(
                        request.getDeliveryId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Delivery not found with id: "
                                        + request.getDeliveryId()
                        )
                );


        // --------------------------------------------------------
        // Validate Product
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                        request.getProductId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        )
                );


        // --------------------------------------------------------
        // Map Request → Entity
        // --------------------------------------------------------

        DeliveryItem deliveryItem =
                deliveryItemMapper.toEntity(
                        request,
                        delivery,
                        product
                );


        // --------------------------------------------------------
        // Default Record Status
        // --------------------------------------------------------

        deliveryItem.setRecordStatus("ACTIVE");


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        DeliveryItem savedDeliveryItem =
                deliveryItemRepository.save(deliveryItem);


        // --------------------------------------------------------
        // Entity → Response
        // --------------------------------------------------------

        return deliveryItemMapper.toResponse(
                savedDeliveryItem
        );
    }


    // ============================================================
    // UPDATE DELIVERY ITEM
    // ============================================================

    public DeliveryItemResponse updateDeliveryItem(
            Integer deliveryItemId,
            DeliveryItemUpdateRequest request) {

        // --------------------------------------------------------
        // Find ACTIVE Delivery Item
        // --------------------------------------------------------

        DeliveryItem existingDeliveryItem =
                deliveryItemRepository
                        .findByDeliveryItemIdAndRecordStatus(
                                deliveryItemId,
                                "ACTIVE"
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery item not found with id: "
                                                + deliveryItemId
                                )
                        );


        // --------------------------------------------------------
        // Validate Delivery
        // --------------------------------------------------------

        Delivery delivery =
                deliveryRepository.findById(
                        request.getDeliveryId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Delivery not found with id: "
                                        + request.getDeliveryId()
                        )
                );


        // --------------------------------------------------------
        // Validate Product
        // --------------------------------------------------------

        Product product =
                productRepository.findById(
                        request.getProductId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        )
                );


        // --------------------------------------------------------
        // Map Request → Existing Entity
        // --------------------------------------------------------

        deliveryItemMapper.updateEntity(
                existingDeliveryItem,
                request,
                delivery,
                product
        );


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        DeliveryItem updatedDeliveryItem =
                deliveryItemRepository.save(
                        existingDeliveryItem
                );


        // --------------------------------------------------------
        // Entity → Response
        // --------------------------------------------------------

        return deliveryItemMapper.toResponse(
                updatedDeliveryItem
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE DELIVERY ITEM
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // No physical DELETE occurs.
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
    // ============================================================

    public void deleteDeliveryItem(
            Integer deliveryItemId) {

        // --------------------------------------------------------
        // Check whether ID exists at all
        // --------------------------------------------------------

        DeliveryItem deliveryItem =
                deliveryItemRepository
                        .findById(deliveryItemId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Delivery item not found with id: "
                                                + deliveryItemId
                                )
                        );


        // --------------------------------------------------------
        // Already INACTIVE
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                deliveryItem.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Delivery item already deleted with id: "
                            + deliveryItemId
            );
        }


        // --------------------------------------------------------
        // ACTIVE → INACTIVE
        // --------------------------------------------------------

        deliveryItem.setRecordStatus("INACTIVE");

        deliveryItemRepository.save(deliveryItem);
    }
}
