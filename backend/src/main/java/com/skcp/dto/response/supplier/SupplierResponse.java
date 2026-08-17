package com.skcp.dto.response.supplier;

import java.time.LocalDateTime;

/*
 * Response DTO.
 *
 * No validation annotations are required here because
 * this class is used to send data from the backend to the client.
 *
 * Supplier Entity
 *      ↓
 * SupplierMapper
 *      ↓
 * SupplierResponse
 *      ↓
 * Controller
 *      ↓
 * Postman / Frontend
 */

public class SupplierResponse
{

    private Integer supplierId;

    private String supplierName;

    private String contactPerson;

    private String phone;

    private String whatsapp;

    private String address;

    private String gstNumber;

    /*
     * status and createdAt are backend-controlled fields.
     *
     * They are excluded from request DTOs because the client
     * must not directly control them.
     *
     * They are included here because the backend can return
     * this information to the client.
     */
    private String status;

    private LocalDateTime createdAt;


    // Default constructor
    public SupplierResponse()
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

    public String getContactPerson()
    {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson)
    {
        this.contactPerson = contactPerson;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getWhatsapp()
    {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp)
    {
        this.whatsapp = whatsapp;
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public String getGstNumber()
    {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber)
    {
        this.gstNumber = gstNumber;
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
}