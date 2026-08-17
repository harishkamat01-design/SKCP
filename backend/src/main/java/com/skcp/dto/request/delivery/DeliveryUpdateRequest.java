package com.skcp.dto.request.delivery;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DeliveryUpdateRequest {

    // ============================================================
    // ORDER
    // ============================================================

    @NotNull(message = "Order ID is required")
    private Integer orderId;


    // ============================================================
    // DELIVERY DATE
    // ============================================================

    @NotNull(message = "Delivery date is required")
    private LocalDate deliveryDate;


    // ============================================================
    // TRIP NUMBER
    // ============================================================

    @NotNull(message = "Trip number is required")
    @Positive(message = "Trip number must be greater than 0")
    private Integer tripNumber;


    // ============================================================
    // TOTAL TRIPS
    // ============================================================

    @NotNull(message = "Total trips is required")
    @Positive(message = "Total trips must be greater than 0")
    private Integer totalTrips;


    // ============================================================
    // VEHICLE TYPE
    // ============================================================

    @Size(
        max = 50,
        message = "Vehicle type must not exceed 50 characters"
    )
    private String vehicleType;


    // ============================================================
    // VEHICLE NUMBER
    // ============================================================

    @Size(
        max = 20,
        message = "Vehicle number must not exceed 20 characters"
    )
    private String vehicleNumber;


    // ============================================================
    // DRIVER NAME
    // ============================================================

    @Size(
        max = 100,
        message = "Driver name must not exceed 100 characters"
    )
    private String driverName;


    // ============================================================
    // TRANSPORT MODE
    // ============================================================

    @NotNull(message = "Transport mode is required")
    private String transportMode;


    // ============================================================
    // TRANSPORT COST
    // ============================================================

    @DecimalMin(
        value = "0.00",
        message = "Transport cost cannot be negative"
    )
    private BigDecimal transportCost;


    // ============================================================
    // DELIVERY STATUS
    // ============================================================

    @NotNull(message = "Delivery status is required")
    private String deliveryStatus;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public DeliveryUpdateRequest() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Integer getTripNumber() {
        return tripNumber;
    }

    public void setTripNumber(Integer tripNumber) {
        this.tripNumber = tripNumber;
    }

    public Integer getTotalTrips() {
        return totalTrips;
    }

    public void setTotalTrips(Integer totalTrips) {
        this.totalTrips = totalTrips;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }

    public BigDecimal getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(BigDecimal transportCost) {
        this.transportCost = transportCost;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}