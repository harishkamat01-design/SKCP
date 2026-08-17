package com.skcp.dto.response.purchase;

/*
 * Lightweight response DTO used for Purchase lists
 * and search results.
 *
 * Detailed PurchaseItem information is intentionally
 * excluded from this response.
 *
 * Purchase Entity
 *      ↓
 * PurchaseMapper
 *      ↓
 * PurchaseSummaryResponse
 *      ↓
 * Purchase List / Search
 */

import java.math.BigDecimal;
import java.time.LocalDate;

public class PurchaseSummaryResponse
{
    private Integer purchaseId;

    private Integer supplierId;

    private LocalDate purchaseDate;

    private String invoiceNumber;

    private BigDecimal totalAmount;

    private String paymentStatus;

    private String status;

    private String supplierName;

    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseSummaryResponse()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

        public String getSupplierName()
    {
        return supplierName;
    }

    public void setSupplierName(String supplierName)
    {
        this.supplierName = supplierName;
    }



    public Integer getPurchaseId()
    {
        return purchaseId;
    }

    public void setPurchaseId(Integer purchaseId)
    {
        this.purchaseId = purchaseId;
    }

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
        this.invoiceNumber = invoiceNumber;
    }

    public BigDecimal getTotalAmount()
    {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount)
    {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus()
    {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus)
    {
        this.paymentStatus = paymentStatus;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}