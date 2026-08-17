package com.skcp.dto.response.customer;

import java.time.LocalDateTime;   // This is needed because createdAt is a date-and-time field.

/* There are no validation annotations here because this class only sends data out: 
    Customer Entity → CustomerResponse → Postman / React       */


public class CustomerResponse 
{

    private Integer customerId;     // The response includes the ID because the backend is showing an existing customer record.

    private String customerName;

    private String mobileNumber;

    private String alternateMobile;

    private String address;

    private String village;

    private String city;

    private String pincode;

    private String gstNumber;

    private String remarks;

    // Below status and createdAt fields appear in a response because the backend owns and returns them. 
    // They were correctly excluded from create and update requests because the client must not control them.
    private String status;
   
    private LocalDateTime createdAt;

    //default constructor
    public CustomerResponse() 
    {
    }

    public Integer getCustomerId() 
    {
        return customerId;
    }

    public void setCustomerId(Integer customerId) 
    {
        this.customerId = customerId;
    }

    public String getCustomerName() 
    {
        return customerName;
    }

    public void setCustomerName(String customerName) 
    {
        this.customerName = customerName;
    }

    public String getMobileNumber() 
    {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) 
    {
        this.mobileNumber = mobileNumber;
    }

    public String getAlternateMobile() 
    {
        return alternateMobile;
    }

    public void setAlternateMobile(String alternateMobile) 
    {
        this.alternateMobile = alternateMobile;
    }

    public String getAddress() 
    {
        return address;
    }

    public void setAddress(String address) 
    {
        this.address = address;
    }

    public String getVillage() 
    {
        return village;
    }

    public void setVillage(String village) 
    {
        this.village = village;
    }

    public String getCity() 
    {
        return city;
    }

    public void setCity(String city) 
    {
        this.city = city;
    }

    public String getPincode() 
    {
        return pincode;
    }

    public void setPincode(String pincode) 
    {
        this.pincode = pincode;
    }

    public String getGstNumber() 
    {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) 
    {
        this.gstNumber = gstNumber;
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
}