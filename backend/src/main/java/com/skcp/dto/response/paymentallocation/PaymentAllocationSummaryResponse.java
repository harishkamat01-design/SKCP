package com.skcp.dto.response.paymentallocation;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentAllocationSummaryResponse {

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


    // ============================================================
    // RECORD STATUS
    // ============================================================

    private String recordStatus;


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

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }
}