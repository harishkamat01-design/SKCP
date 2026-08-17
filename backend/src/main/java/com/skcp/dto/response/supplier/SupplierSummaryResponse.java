package com.skcp.dto.response.supplier;

/*
 * Lightweight response DTO used for supplier lists and search results.
 *
 * Detailed supplier information is intentionally excluded.
 *
 * Supplier Entity
 *      ↓
 * SupplierMapper
 *      ↓
 * SupplierSummaryResponse
 *      ↓
 * Supplier List / Search
 */

public class SupplierSummaryResponse
{

    private Integer supplierId;

    private String supplierName;

    private String phone;

    private String status;


    // Default constructor
    public SupplierSummaryResponse()
    {
    }


    // Getters and Setters

    public Integer getSupplierId()
    {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId)
    {
        this.supplierId = supplierId;
    }

    public String getSupplierName()
    {
        return supplierName;
    }

    public void setSupplierName(String supplierName)
    {
        this.supplierName = supplierName;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
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