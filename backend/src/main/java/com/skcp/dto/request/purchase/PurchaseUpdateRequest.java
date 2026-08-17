package com.skcp.dto.request.purchase;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class PurchaseUpdateRequest
{
    @NotNull(message = "Supplier ID is required")
    private Integer supplierId;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @Size(
            max = 50,
            message = "Invoice number must not exceed 50 characters"
    )
    private String invoiceNumber;

    @NotNull(message = "Payment status is required")
    @Size(
            max = 30,
            message = "Payment status must not exceed 30 characters"
    )
    private String paymentStatus;

    @Size(
            max = 500,
            message = "Remarks must not exceed 500 characters"
    )
    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseUpdateRequest()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getSupplierId()
    {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId)
    {
        this.supplierId = supplierId;
    }

    public LocalDate getPurchaseDate()
    {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate)
    {
        this.purchaseDate = purchaseDate;
    }

    public String getInvoiceNumber()
    {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber)
    {
        this.invoiceNumber = normalize(invoiceNumber);
    }

    public String getPaymentStatus()
    {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus)
    {
        this.paymentStatus = normalize(paymentStatus);
    }

    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = normalize(remarks);
    }


    // ============================================================
    // NORMALIZATION HELPER
    // ============================================================

    private String normalize(String value)
    {
        if (value == null)
        {
            return null;
        }

        String trimmedValue = value.trim();

        return trimmedValue.isEmpty()
                ? null
                : trimmedValue;
    }
}