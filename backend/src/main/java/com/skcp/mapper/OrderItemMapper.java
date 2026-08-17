package com.skcp.mapper;

import com.skcp.dto.request.orderitem.OrderItemCreateRequest;
import com.skcp.dto.request.orderitem.OrderItemUpdateRequest;
import com.skcp.dto.response.orderitem.OrderItemResponse;
import com.skcp.entity.Order;
import com.skcp.entity.OrderItem;
import com.skcp.entity.Product;

public class OrderItemMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static OrderItem toEntity(
            OrderItemCreateRequest request,
            Order order,
            Product product) {

        OrderItem orderItem = new OrderItem();

        orderItem.setOrder(order);

        orderItem.setProduct(product);

        orderItem.setOrderedQuantity(
                request.getOrderedQuantity()
        );

        orderItem.setUnitSellingPrice(
                request.getUnitSellingPrice()
        );

        orderItem.setRemarks(
                request.getRemarks()
        );

        /*
         * recordStatus is not accepted from the request.
         *
         * New OrderItem:
         *     recordStatus → ACTIVE
         *
         * This default is handled by OrderItem @PrePersist.
         */

        return orderItem;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            OrderItem orderItem,
            OrderItemUpdateRequest request,
            Order order,
            Product product) {

        orderItem.setOrder(order);

        orderItem.setProduct(product);

        orderItem.setOrderedQuantity(
                request.getOrderedQuantity()
        );

        orderItem.setUnitSellingPrice(
                request.getUnitSellingPrice()
        );

        orderItem.setRemarks(
                request.getRemarks()
        );

        /*
         * recordStatus is intentionally not modified here.
         *
         * ACTIVE / INACTIVE is controlled by the service layer.
         */
    }


    // ============================================================
    // ENTITY → RESPONSE
    // ============================================================

    public static OrderItemResponse toResponse(
            OrderItem orderItem) {

        OrderItemResponse response =
                new OrderItemResponse();

        response.setOrderItemId(
                orderItem.getOrderItemId()
        );


        // --------------------------------------------------------
        // ORDER ID
        // --------------------------------------------------------

        if (orderItem.getOrder() != null) {

            response.setOrderId(
                    orderItem.getOrder().getOrderId()
            );
        }


        // --------------------------------------------------------
        // PRODUCT ID
        // --------------------------------------------------------

        if (orderItem.getProduct() != null) {

            response.setProductId(
                    orderItem.getProduct().getProductId()
            );
        }


        // --------------------------------------------------------
        // ORDERED QUANTITY
        // --------------------------------------------------------

        response.setOrderedQuantity(
                orderItem.getOrderedQuantity()
        );


        // --------------------------------------------------------
        // UNIT SELLING PRICE
        // --------------------------------------------------------

        response.setUnitSellingPrice(
                orderItem.getUnitSellingPrice()
        );


        // --------------------------------------------------------
        // REMARKS
        // --------------------------------------------------------

        response.setRemarks(
                orderItem.getRemarks()
        );


        // --------------------------------------------------------
        // CREATED AT
        // --------------------------------------------------------

        response.setCreatedAt(
                orderItem.getCreatedAt()
        );


        return response;
    }
}
