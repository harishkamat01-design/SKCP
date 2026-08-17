package com.skcp.dto.request.purchase;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PurchaseCreateRequest
{
    @NotNull(message = "Supplier is required")
    private Integer supplierId;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @Size(
            max = 50,
            message = "Invoice number must not exceed 50 characters"
    )
    private String invoiceNumber;

    @Size(
            max = 500,
            message = "Remarks must not exceed 500 characters"
    )
   

    @NotEmpty(message = "At least one purchase item is required")
    @Valid
    private List<PurchaseItemCreateRequest> items =
            new ArrayList<>();

    private String paymentStatus;

     private String remarks;

    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseCreateRequest()
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

    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = normalize(remarks);
    }

    public List<PurchaseItemCreateRequest> getItems()
    {
        return items;
    }

    public void setItems(
            List<PurchaseItemCreateRequest> items
    )
    {
        this.items = items;
    }

    public String getPaymentStatus() 
    {
    return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) 
    {
    this.paymentStatus = paymentStatus;
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