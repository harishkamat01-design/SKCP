package com.skcp.dto.request.order;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;




public class OrderCreateRequest {

    // ============================================================
    // CUSTOMER
    // ============================================================

    @NotNull(message = "Customer ID is required")
    private Integer customerId;


    // ============================================================
    // ORDER DATE
    // ============================================================

    private LocalDate orderDate;


    // ============================================================
    // EXPECTED DELIVERY DATE
    // ============================================================

    private LocalDate expectedDeliveryDate;


    // ============================================================
    // TRANSPORT MODE
    // ============================================================

    @NotNull(message = "Transport mode is required")
    private String transportMode;


    // ============================================================
    // ORDER ITEMS
    // ============================================================
    //
    // Product, quantity and unit selling price are captured
    // as part of the Order creation request.
    //
    // orderId is NOT required inside each item because the
    // Order does not exist yet. The backend creates the Order
    // first and then attaches all items to that Order.
    //
    // @Valid ensures validation annotations inside
    // OrderItemCreateRequest are also executed.
    // ============================================================

    @Valid
    private List<OrderItemInOrderRequest> items;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderCreateRequest() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }


    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }


    public LocalDate getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }


    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }


    public List<OrderItemInOrderRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemInOrderRequest> items) {
        this.items = items;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}