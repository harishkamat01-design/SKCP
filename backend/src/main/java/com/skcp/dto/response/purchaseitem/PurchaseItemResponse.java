package com.skcp.dto.response.purchaseitem;

import com.skcp.enums.RecordStatus;

import java.math.BigDecimal;

public class PurchaseItemResponse
{

    // ============================================================
    // IDENTIFIER
    // ============================================================

    private Integer purchaseItemId;


    // ============================================================
    // PARENT PURCHASE
    // ============================================================

    private Integer purchaseId;


    // ============================================================
    // RAW MATERIAL
    // ============================================================

    private Integer rawMaterialId;

    private String rawMaterialName;


    // ============================================================
    // PURCHASE ITEM DETAILS
    // ============================================================

    private BigDecimal quantity;

    private String unit;

    private BigDecimal unitPrice;

    private BigDecimal lineAmount;

    private String remarks;


    // ============================================================
    // RECORD STATUS
    // ============================================================

    private RecordStatus status;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseItemResponse()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPurchaseItemId()
    {
        return purchaseItemId;
    }

    public void setPurchaseItemId(
            Integer purchaseItemId
    )
    {
        this.purchaseItemId = purchaseItemId;
    }


    public Integer getPurchaseId()
    {
        return purchaseId;
    }

    public void setPurchaseId(
            Integer purchaseId
    )
    {
        this.purchaseId = purchaseId;
    }


    public Integer getRawMaterialId()
    {
        return rawMaterialId;
    }

    public void setRawMaterialId(
            Integer rawMaterialId
    )
    {
        this.rawMaterialId = rawMaterialId;
    }


    public String getRawMaterialName()
    {
        return rawMaterialName;
    }

    public void setRawMaterialName(
            String rawMaterialName
    )
    {
        this.rawMaterialName = rawMaterialName;
    }


    public BigDecimal getQuantity()
    {
        return quantity;
    }

    public void setQuantity(
            BigDecimal quantity
    )
    {
        this.quantity = quantity;
    }


    public String getUnit()
    {
        return unit;
    }

    public void setUnit(
            String unit
    )
    {
        this.unit = unit;
    }


    public BigDecimal getUnitPrice()
    {
        return unitPrice;
    }

    public void setUnitPrice(
            BigDecimal unitPrice
    )
    {
        this.unitPrice = unitPrice;
    }


    public BigDecimal getLineAmount()
    {
        return lineAmount;
    }

    public void setLineAmount(
            BigDecimal lineAmount
    )
    {
        this.lineAmount = lineAmount;
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(
            String remarks
    )
    {
        this.remarks = remarks;
    }


    public RecordStatus getStatus()
    {
        return status;
    }

    public void setStatus(
            RecordStatus status
    )
    {
        this.status = status;
    }

}




/* 
package com.skcp.dto.response.purchaseitem;

import java.math.BigDecimal;

public class PurchaseItemResponse
{

    // ============================================================
    // IDENTIFIER
    // ============================================================

    private Integer purchaseItemId;


    // ============================================================
    // PARENT PURCHASE
    // ============================================================

    private Integer purchaseId;


    // ============================================================
    // RAW MATERIAL
    // ============================================================

    private Integer rawMaterialId;

    private String rawMaterialName;


    // ============================================================
    // PURCHASE ITEM DETAILS
    // ============================================================

    private BigDecimal quantity;

    private String unit;

    private BigDecimal unitPrice;

    private BigDecimal lineAmount;

    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public PurchaseItemResponse()
    {

    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPurchaseItemId()
    {
        return purchaseItemId;
    }

    public void setPurchaseItemId(Integer purchaseItemId)
    {
        this.purchaseItemId = purchaseItemId;
    }


    public Integer getPurchaseId()
    {
        return purchaseId;
    }

    public void setPurchaseId(Integer purchaseId)
    {
        this.purchaseId = purchaseId;
    }


    public Integer getRawMaterialId()
    {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId)
    {
        this.rawMaterialId = rawMaterialId;
    }


    public String getRawMaterialName()
    {
        return rawMaterialName;
    }

    public void setRawMaterialName(String rawMaterialName)
    {
        this.rawMaterialName = rawMaterialName;
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


    public BigDecimal getLineAmount()
    {
        return lineAmount;
    }

    public void setLineAmount(BigDecimal lineAmount)
    {
        this.lineAmount = lineAmount;
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
     */