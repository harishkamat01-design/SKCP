package com.skcp.dto.request.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentCreateRequest {

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Total amount received is required")
    @DecimalMin(value = "0.01", message = "Total amount received must be greater than 0")
    private BigDecimal totalAmountReceived;

    @NotBlank(message = "Payment mode is required")
    @Pattern(
        regexp = "CASH|UPI|BANK_TRANSFER|CHEQUE",
        message = "Payment mode must be CASH, UPI, BANK_TRANSFER, or CHEQUE"
    )
    private String paymentMode;

    @Size(max = 100, message = "Reference number must not exceed 100 characters")
    private String referenceNumber;

    @NotBlank(message = "Received by is required")
    @Size(max = 100, message = "Received by must not exceed 100 characters")
    private String receivedBy;

    private String remarks;

    // ==========================
    // Default Constructor
    // ==========================

    public PaymentCreateRequest() {
    }

    // ==========================
    // Getters and Setters
    // ==========================

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
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
}