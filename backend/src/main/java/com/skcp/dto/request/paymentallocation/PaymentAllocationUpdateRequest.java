package com.skcp.dto.request.paymentallocation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentAllocationUpdateRequest {

    // ============================================================
    // PAYMENT
    // ============================================================

    @NotNull(message = "Payment ID is required")
    private Integer paymentId;


    // ============================================================
    // ORDER
    // ============================================================

    @NotNull(message = "Order ID is required")
    private Integer orderId;


    // ============================================================
    // ALLOCATED AMOUNT
    // ============================================================

    @NotNull(message = "Allocated amount is required")
    @DecimalMin(value = "0.01", message = "Allocated amount must be greater than 0")
    private BigDecimal allocatedAmount;


    // ============================================================
    // ALLOCATION DATE
    // ============================================================

    @NotNull(message = "Allocation date is required")
    private LocalDate allocationDate;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public LocalDate getAllocationDate() {
        return allocationDate;
    }

    public void setAllocationDate(LocalDate allocationDate) {
        this.allocationDate = allocationDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}