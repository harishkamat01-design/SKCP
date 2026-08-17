package com.skcp.dto.request.supplier;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SupplierUpdateRequest
{

    @NotBlank(message = "Supplier name is required")
    @Size(min = 2, max = 100, message = "Supplier name must be between 2 and 100 characters")
    private String supplierName;

    @Size(max = 100, message = "Contact person must not exceed 100 characters")
    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone number must be 10 digits and start with 6, 7, 8, or 9"
    )
    private String phone;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "WhatsApp number must be 10 digits and start with 6, 7, 8, or 9"
    )
    private String whatsapp;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$",
            message = "GST number must be a valid 15-character GSTIN"
    )
    private String gstNumber;


    // Default constructor
    public SupplierUpdateRequest()
    {
    }


    // Getters and Setters

    public String getSupplierName()
    {
        return supplierName;
    }

    public void setSupplierName(String supplierName)
    {
        this.supplierName = normalize(supplierName);
    }

    public String getContactPerson()
    {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson)
    {
        this.contactPerson = normalize(contactPerson);
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = normalize(phone);
    }

    public String getWhatsapp()
    {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp)
    {
        this.whatsapp = normalize(whatsapp);
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = normalize(address);
    }

    public String getGstNumber()
    {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber)
    {
        String normalizedGstNumber = normalize(gstNumber);

        this.gstNumber = normalizedGstNumber == null
                ? null
                : normalizedGstNumber.toUpperCase();
    }


    // Private normalization helper
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