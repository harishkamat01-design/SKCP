package com.skcp.dto.request.purchaseitem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PurchaseItemCreateRequest
{
    // ============================================================
    // RAW MATERIAL ID
    // ============================================================

    @NotNull(message = "Raw Material ID is required")
    private Integer rawMaterialId;


    // ============================================================
    // QUANTITY
    // ============================================================

    @NotNull(message = "Quantity is required")
    @DecimalMin(
            value = "0.01",
            message = "Quantity must be greater than 0"
    )
    private BigDecimal quantity;


    // ============================================================
    // UNIT
    // ============================================================

    @NotBlank(message = "Unit is required")
    private String unit;


    // ============================================================
    // UNIT PRICE
    // ============================================================

    @NotNull(message = "Unit price is required")
    @DecimalMin(
            value = "0.00",
            message = "Unit price cannot be negative"
    )
    private BigDecimal unitPrice;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseItemCreateRequest()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getRawMaterialId()
    {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId)
    {
        this.rawMaterialId = rawMaterialId;
    }

    public BigDecimal getQuantity()
    {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity)
    {
        this.quantity = quantity;
    }

    public String getUnit()
    {
        return unit;
    }

    public void setUnit(String unit)
    {
        this.unit = unit;
    }

    public BigDecimal getUnitPrice()
    {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice)
    {
        this.unitPrice = unitPrice;
    }

    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
    }
}