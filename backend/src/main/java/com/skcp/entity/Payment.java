package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    // Parent Relationship → Customer (Many : 1)
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "total_amount_received", nullable = false)
    private BigDecimal totalAmountReceived;

    @Column(name = "payment_mode", nullable = false)
    private String paymentMode;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "received_by", nullable = false)
    private String receivedBy;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() 
    {
        this.createdAt = LocalDateTime.now();
    }

    // Default Constructor
    public Payment() 
    {

    }

    // ==========================
    // Getters and Setters
    // ==========================

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public BigDecimal getTotalAmountReceived() {
        return totalAmountReceived;
    }

    public void setTotalAmountReceived(BigDecimal totalAmountReceived) {
        this.totalAmountReceived = totalAmountReceived;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(String receivedBy) {
        this.receivedBy = receivedBy;
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

/*

# Relationship:

Customer → Payment
Customer (1)
        │
        ▼
Payment (Many)


# Implemented as:

@ManyToOne
@JoinColumn(name = "customer_id", nullable = false)
private Customer customer;

This is the correct enterprise mapping because:
- One customer can make many payments.
- Each payment belongs to exactly one customer.

# Why BigDecimal?
private BigDecimal totalAmountReceived;
This is the correct datatype for financial applications 
because it avoids floating-point precision issues that occur with double.

# Why LocalDate?
private LocalDate paymentDate;
Only the payment date is required; time is captured separately by createdAt.

# Why createdAt?
@PrePersist
Automatically records when the payment entry was created for auditing purposes.

# Design Decisions
- Customer is referenced through a @ManyToOne relationship rather than storing customer details directly.
- Payment intentionally does not contain orderId. One payment may be allocated across multiple orders in the upcoming PaymentAllocation module.
- Monetary values use BigDecimal for precision.
- The entity is fully normalized and consistent with the overall SKCP architecture.

*/