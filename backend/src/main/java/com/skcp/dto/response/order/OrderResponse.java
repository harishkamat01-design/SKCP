package com.skcp.dto.response.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private String paymentStatus;
    private BigDecimal paidAmount;
    private BigDecimal balance;

    // ============================================================
    // ORDER ID
    // ============================================================

    private Integer orderId;


    // ============================================================
    // CUSTOMER ID
    // ============================================================

    private Integer customerId;


    // ============================================================
    // CUSTOMER NAME
    // ============================================================

    private String customerName;


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
    // ORDER BILL ITEMS
    // ============================================================

    private List<OrderBillItemResponse> items;


    // ============================================================
    // TOTAL AMOUNT
    // ============================================================

    private BigDecimal totalAmount;


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

    public String getPaymentStatus() {
    return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

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

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
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

    public List<OrderBillItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderBillItemResponse> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}