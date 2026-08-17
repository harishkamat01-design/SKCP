package com.skcp.dto.response.paymentallocation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PaymentAllocationResponse {

    // ============================================================
    // PRIMARY KEY
    // ============================================================

    private Integer paymentAllocationId;


    // ============================================================
    // RELATIONSHIP IDS
    // ============================================================

    private Integer paymentId;

    private Integer orderId;


    // ============================================================
    // ALLOCATION DETAILS
    // ============================================================

    private BigDecimal allocatedAmount;

    private LocalDate allocationDate;

    private String remarks;


    // ============================================================
    // RECORD STATUS
    // ============================================================

    private String recordStatus;


    // ============================================================
    // CREATED AT
    // ============================================================

    private LocalDateTime createdAt;


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPaymentAllocationId() {
        return paymentAllocationId;
    }

    public void setPaymentAllocationId(Integer paymentAllocationId) {
        this.paymentAllocationId = paymentAllocationId;
    }

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

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}