package com.skcp.mapper;

import com.skcp.dto.request.delivery.DeliveryCreateRequest;
import com.skcp.dto.request.delivery.DeliveryUpdateRequest;
import com.skcp.dto.response.delivery.DeliveryResponse;
import com.skcp.dto.response.delivery.DeliverySummaryResponse;
import com.skcp.entity.Delivery;
import com.skcp.entity.Order;

public class DeliveryMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Delivery toEntity(
            DeliveryCreateRequest request,
            Order order) {

        Delivery delivery = new Delivery();

        delivery.setOrder(order);

        delivery.setDeliveryDate(
                request.getDeliveryDate()
        );

        delivery.setTripNumber(
                request.getTripNumber()
        );

        delivery.setTotalTrips(
                request.getTotalTrips()
        );

        delivery.setVehicleType(
                request.getVehicleType()
        );

        delivery.setVehicleNumber(
                request.getVehicleNumber()
        );

        delivery.setDriverName(
                request.getDriverName()
        );

        delivery.setTransportMode(
                request.getTransportMode()
        );

        delivery.setTransportCost(
                request.getTransportCost()
        );

        /*
         * New Delivery:
         *
         * deliveryStatus → PENDING
         * recordStatus   → ACTIVE
         *
         * These defaults are handled by Delivery @PrePersist.
         */

        delivery.setRemarks(
                request.getRemarks()
        );

        return delivery;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Delivery delivery,
            DeliveryUpdateRequest request,
            Order order) {

        delivery.setOrder(order);

        delivery.setDeliveryDate(
                request.getDeliveryDate()
        );

        delivery.setTripNumber(
                request.getTripNumber()
        );

        delivery.setTotalTrips(
                request.getTotalTrips()
        );

        delivery.setVehicleType(
                request.getVehicleType()
        );

        delivery.setVehicleNumber(
                request.getVehicleNumber()
        );

        delivery.setDriverName(
                request.getDriverName()
        );

        delivery.setTransportMode(
                request.getTransportMode()
        );

        delivery.setTransportCost(
                request.getTransportCost()
        );

        delivery.setDeliveryStatus(
                request.getDeliveryStatus()
        );

        delivery.setRemarks(
                request.getRemarks()
        );
    }


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public static DeliveryResponse toResponse(
            Delivery delivery) {

        DeliveryResponse response =
                new DeliveryResponse();

        response.setDeliveryId(
                delivery.getDeliveryId()
        );

        if (delivery.getOrder() != null) {

            response.setOrderId(
                    delivery.getOrder().getOrderId()
            );
        }

        response.setDeliveryDate(
                delivery.getDeliveryDate()
        );

        response.setTripNumber(
                delivery.getTripNumber()
        );

        response.setTotalTrips(
                delivery.getTotalTrips()
        );

        response.setVehicleType(
                delivery.getVehicleType()
        );

        response.setVehicleNumber(
                delivery.getVehicleNumber()
        );

        response.setDriverName(
                delivery.getDriverName()
        );

        response.setTransportMode(
                delivery.getTransportMode()
        );

        response.setTransportCost(
                delivery.getTransportCost()
        );

        response.setDeliveryStatus(
                delivery.getDeliveryStatus()
        );

        response.setRecordStatus(
                delivery.getRecordStatus()
        );

        response.setRemarks(
                delivery.getRemarks()
        );

        response.setCreatedAt(
                delivery.getCreatedAt()
        );

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public static DeliverySummaryResponse toSummaryResponse(
            Delivery delivery) {

        DeliverySummaryResponse response =
                new DeliverySummaryResponse();

        response.setDeliveryId(
                delivery.getDeliveryId()
        );

        if (delivery.getOrder() != null) {

            response.setOrderId(
                    delivery.getOrder().getOrderId()
            );
        }

        response.setDeliveryDate(
                delivery.getDeliveryDate()
        );

        response.setTripNumber(
                delivery.getTripNumber()
        );

        response.setTotalTrips(
                delivery.getTotalTrips()
        );

        response.setTransportMode(
                delivery.getTransportMode()
        );

        response.setDeliveryStatus(
                delivery.getDeliveryStatus()
        );

        return response;
    }
}
