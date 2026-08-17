package com.skcp.dto.request.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CustomerUpdateRequest 
{

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String customerName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
    )
    private String mobileNumber;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Alternate mobile number must be 10 digits and start with 6, 7, 8, or 9"
    )
    private String alternateMobile;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 100, message = "Village must not exceed 100 characters")
    private String village;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Pattern(
            regexp = "^\\d{6}$",
            message = "Pincode must contain exactly 6 digits"
    )
    private String pincode;

    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$",
            message = "GST number must be a valid 15-character GSTIN"
    )
    private String gstNumber;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;

    // default constructor
    public CustomerUpdateRequest() 

    {
    }

    public String getCustomerName() 
    {
        return customerName;
    }

    public void setCustomerName(String customerName) 
    {
        this.customerName = normalize(customerName);
    }

    public String getMobileNumber() 
    {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) 
    {
        this.mobileNumber = normalize(mobileNumber);
    }

    public String getAlternateMobile() {
        return alternateMobile;
    }

    public void setAlternateMobile(String alternateMobile) 
    {
        this.alternateMobile = normalize(alternateMobile);
    }

    public String getAddress() 
    {
        return address;
    }

    public void setAddress(String address) 
    {
        this.address = normalize(address);
    }

    public String getVillage() 
    {
        return village;
    }

    public void setVillage(String village) 
    {
        this.village = normalize(village);
    }

    public String getCity() 
    {
        return city;
    }

    public void setCity(String city) 
    {
        this.city = normalize(city);
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) 
    {
        this.pincode = normalize(pincode);
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

    public String getRemarks() 
    {
        return remarks;
    }

    public void setRemarks(String remarks) 
    {
        this.remarks = normalize(remarks);
    }

    private String normalize(String value) 
    {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();
        return trimmedValue.isEmpty() ? null : trimmedValue;
    }
}