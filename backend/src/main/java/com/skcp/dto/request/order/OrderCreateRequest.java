package com.skcp.dto.request.order;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

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

    public void setExpectedDeliveryDate(
            LocalDate expectedDeliveryDate) {

        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}