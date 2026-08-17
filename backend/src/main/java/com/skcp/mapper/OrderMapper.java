package com.skcp.mapper;

import com.skcp.dto.request.order.OrderCreateRequest;
import com.skcp.dto.request.order.OrderUpdateRequest;
import com.skcp.dto.response.order.OrderResponse;
import com.skcp.dto.response.order.OrderSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.entity.Order;

public class OrderMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Order toEntity(
            OrderCreateRequest request,
            Customer customer) {

        Order order = new Order();

        order.setCustomer(customer);

        order.setOrderDate(
                request.getOrderDate()
        );

        order.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        // OrderCreateRequest does not accept orderStatus.
        // Entity @PrePersist will default it to PENDING.

        order.setRemarks(
                request.getRemarks()
        );

        return order;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Order order,
            OrderUpdateRequest request,
            Customer customer) {

        order.setCustomer(customer);

        order.setOrderDate(
                request.getOrderDate()
        );

        order.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        order.setOrderStatus(
                request.getOrderStatus()
        );

        order.setRemarks(
                request.getRemarks()
        );
    }


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public static OrderResponse toResponse(Order order) {

        OrderResponse response = new OrderResponse();

        response.setOrderId(
                order.getOrderId()
        );

        if (order.getCustomer() != null) {

            response.setCustomerId(
                    order.getCustomer().getCustomerId()
            );
        }

        response.setOrderDate(
                order.getOrderDate()
        );

        response.setExpectedDeliveryDate(
                order.getExpectedDeliveryDate()
        );

        response.setOrderStatus(
                order.getOrderStatus()
        );

        response.setRemarks(
                order.getRemarks()
        );

        response.setCreatedAt(
                order.getCreatedAt()
        );

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public static OrderSummaryResponse toSummaryResponse(
            Order order) {

        OrderSummaryResponse response =
                new OrderSummaryResponse();

        response.setOrderId(
                order.getOrderId()
        );

        if (order.getCustomer() != null) {

            response.setCustomerId(
                    order.getCustomer().getCustomerId()
            );
        }

        response.setOrderDate(
                order.getOrderDate()
        );

        response.setExpectedDeliveryDate(
                order.getExpectedDeliveryDate()
        );

        response.setOrderStatus(
                order.getOrderStatus()
        );

        return response;
    }
}