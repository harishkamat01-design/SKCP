package com.skcp.dto.response.customer;

public class CustomerSummaryResponse 
{

    private Integer customerId;

    private String customerName;

    private String mobileNumber;

    private String village;

    private String city;

    private String status;


    //default constructor
    public CustomerSummaryResponse() 
    {
    }

    //getter and setter methods
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

    public String getStatus() 
    {
        return status;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }
}

/*

Why only these fields?
customerId     → identifies the selected customer
customerName   → shows who the customer is
mobileNumber   → quick contact/identification
village, city  → distinguishes customers with similar names
status         → shows whether the customer is active

We intentionally exclude detailed information:
alternateMobile
address
pincode
gstNumber
remarks
createdAt

This keeps list and search API responses lightweight:
Customer Entity
      ↓
CustomerSummaryResponse
      ↓
GET /api/customers
GET /api/customers/search?keyword=Ramesh


*/