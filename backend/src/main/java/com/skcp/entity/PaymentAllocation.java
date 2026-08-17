package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_allocation")
public class PaymentAllocation
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_allocation_id")
    private Integer paymentAllocationId;

    // Parent Relationship → Payment
    @ManyToOne
    /* |Payment|PaymentAllocation|1 : N|PaymentID| */
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    // Parent Relationship → Orders
    @ManyToOne
    /* |Order|PaymentAllocation|1 : N|OrderID| */
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(
        name = "allocated_amount",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal allocatedAmount;

    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "record_status", nullable = false)
    private String recordStatus = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist()
    {

        this.createdAt = LocalDateTime.now();

        if (this.allocationDate == null) {
            this.allocationDate = LocalDate.now();
        }

        if (this.recordStatus == null) {
            this.recordStatus = "ACTIVE";
        }
    }

    // ==========================
    // Default Constructor
    // ==========================

    public PaymentAllocation()
    {

    }

    // ==========================
    // Getters and Setters
    // ==========================

    public Integer getPaymentAllocationId() {
        return paymentAllocationId;
    }

    public void setPaymentAllocationId(Integer paymentAllocationId) {
        this.paymentAllocationId = paymentAllocationId;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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