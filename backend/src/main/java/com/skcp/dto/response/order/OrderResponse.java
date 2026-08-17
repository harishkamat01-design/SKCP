package com.skcp.dto.response.order;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OrderResponse {

    // ============================================================
    // ORDER ID
    // ============================================================

    private Integer orderId;


    // ============================================================
    // CUSTOMER ID
    // ============================================================

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
    // ORDER STATUS
    // ============================================================

    private String orderStatus;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // CREATED AT
    // ============================================================

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderResponse() {
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

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}