package com.skcp.dto.response.purchase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;

/*
 * Detailed response DTO for a Purchase.
 *
 * Purchase Entity
 *      ↓
 * PurchaseMapper
 *      ↓
 * PurchaseResponse
 *      ↓
 * Controller
 *      ↓
 * Postman / Frontend
 *
 * A Purchase is the parent record.
 *
 * Supplier
 *      ↓
 * Purchase
 *      ↓
 * Purchase Items
 *
 * The Supplier entity itself is NOT exposed.
 * We expose supplierId instead.
 */

public class PurchaseResponse
{
    private Integer purchaseId;

    private Integer supplierId;

    private LocalDate purchaseDate;

    private String invoiceNumber;

    private BigDecimal totalAmount;

    private String paymentStatus;

    private String remarks;

    private String status;

    private LocalDateTime createdAt;

    private String supplierName;

    /*
     * Child records belonging to this Purchase.
     */
    private List<PurchaseItemResponse> purchaseItems;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseResponse()
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

    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public List<PurchaseItemResponse> getPurchaseItems()
    {
        return purchaseItems;
    }

    public void setPurchaseItems(
            List<PurchaseItemResponse> purchaseItems
    )
    {
        this.purchaseItems = purchaseItems;
    }
}