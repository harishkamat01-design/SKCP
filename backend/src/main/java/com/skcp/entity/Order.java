package com.skcp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;


    // ============================================================
    // CUSTOMER RELATIONSHIP
    // ============================================================

    // Parent Relationship → Customer
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;


    // ============================================================
    // ORDER DATE
    // ============================================================

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;


    // ============================================================
    // EXPECTED DELIVERY DATE
    // ============================================================

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;


    // ============================================================
    // ORDER STATUS
    // ============================================================
    // Business lifecycle:
    // PENDING / PARTIAL / COMPLETED / CANCELLED

    @Column(name = "order_status", nullable = false)
    private String orderStatus;


    // ============================================================
    // REMARKS
    // ============================================================

    @Column(name = "remarks")
    private String remarks;


    // ============================================================
    // CREATED AT
    // ============================================================

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // ============================================================
    // RECORD STATUS
    // ============================================================
    // Database record lifecycle:
    // ACTIVE / INACTIVE
    //
    // This is completely separate from orderStatus.

    @Column(name = "record_status", nullable = false)
    private String recordStatus;


    // ============================================================
    // PRE-PERSIST
    // ============================================================

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        if (this.orderDate == null) {
            this.orderDate = LocalDate.now();
        }

        if (this.orderStatus == null) {
            this.orderStatus = "PENDING";
        }

        if (this.recordStatus == null) {
            this.recordStatus = "ACTIVE";
        }
    }


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public Order() {
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


    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
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


    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }
}
