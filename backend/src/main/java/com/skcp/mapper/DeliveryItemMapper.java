package com.skcp.mapper;

import com.skcp.dto.request.deliveryitem.DeliveryItemCreateRequest;
import com.skcp.dto.request.deliveryitem.DeliveryItemUpdateRequest;
import com.skcp.dto.response.deliveryitem.DeliveryItemResponse;
import com.skcp.dto.response.deliveryitem.DeliveryItemSummaryResponse;
import com.skcp.entity.Delivery;
import com.skcp.entity.DeliveryItem;
import com.skcp.entity.Product;

import org.springframework.stereotype.Component;

@Component
public class DeliveryItemMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public DeliveryItem toEntity(
            DeliveryItemCreateRequest request,
            Delivery delivery,
            Product product) {

        DeliveryItem deliveryItem = new DeliveryItem();

        deliveryItem.setDelivery(delivery);
        deliveryItem.setProduct(product);
        deliveryItem.setDeliveredQuantity(
                request.getDeliveredQuantity()
        );
        deliveryItem.setRemarks(
                request.getRemarks()
        );

        return deliveryItem;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public void updateEntity(
            DeliveryItem deliveryItem,
            DeliveryItemUpdateRequest request,
            Delivery delivery,
            Product product) {

        deliveryItem.setDelivery(delivery);
        deliveryItem.setProduct(product);
        deliveryItem.setDeliveredQuantity(
                request.getDeliveredQuantity()
        );
        deliveryItem.setRemarks(
                request.getRemarks()
        );
    }


    // ============================================================
    // ENTITY → RESPONSE
    // ============================================================

    public DeliveryItemResponse toResponse(
            DeliveryItem deliveryItem) {

        DeliveryItemResponse response =
                new DeliveryItemResponse();

        response.setDeliveryItemId(
                deliveryItem.getDeliveryItemId()
        );

        response.setDeliveryId(
                deliveryItem.getDelivery().getDeliveryId()
        );

        response.setProductId(
                deliveryItem.getProduct().getProductId()
        );

        response.setDeliveredQuantity(
                deliveryItem.getDeliveredQuantity()
        );

        response.setRemarks(
                deliveryItem.getRemarks()
        );

        response.setRecordStatus(
                deliveryItem.getRecordStatus()
        );

        response.setCreatedAt(
                deliveryItem.getCreatedAt()
        );

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public DeliveryItemSummaryResponse toSummaryResponse(
            DeliveryItem deliveryItem) {

        DeliveryItemSummaryResponse response =
                new DeliveryItemSummaryResponse();

        response.setDeliveryItemId(
                deliveryItem.getDeliveryItemId()
        );

        response.setDeliveryId(
                deliveryItem.getDelivery().getDeliveryId()
        );

        response.setProductId(
                deliveryItem.getProduct().getProductId()
        );

        response.setDeliveredQuantity(
                deliveryItem.getDeliveredQuantity()
        );

        response.setRecordStatus(
                deliveryItem.getRecordStatus()
        );

        return response;
    }
}