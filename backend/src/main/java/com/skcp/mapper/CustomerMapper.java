package com.skcp.mapper;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper
{
    private final ModelMapper modelMapper;

    public CustomerMapper(ModelMapper modelMapper)
    {
        this.modelMapper = modelMapper;
    }

    public Customer toEntity(CustomerCreateRequest request)
    {
        return modelMapper.map(
                request,
                Customer.class
        );
    }

    public void updateEntity(
            CustomerUpdateRequest request,
            Customer customer
    )
    {
        modelMapper.map(
                request,
                customer
        );
    }

    public CustomerResponse toResponse(Customer customer)
    {
        return modelMapper.map(
                customer,
                CustomerResponse.class
        );
    }

    public CustomerSummaryResponse toSummaryResponse(
            Customer customer
    )
    {
        return modelMapper.map(
                customer,
                CustomerSummaryResponse.class
        );
    }
}




/* 

package com.skcp.mapper;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    private final ModelMapper modelMapper;

    public CustomerMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Customer toEntity(CustomerCreateRequest request) {
        return modelMapper.map(request, Customer.class);
    }

    public void updateEntity(CustomerUpdateRequest request, Customer customer) {
        modelMapper.map(request, customer);
    }

    public CustomerResponse toResponse(Customer customer) {
        return modelMapper.map(customer, CustomerResponse.class);
    }

    public CustomerSummaryResponse toSummaryResponse(Customer customer) {
        return modelMapper.map(customer, CustomerSummaryResponse.class);
    }
}

*/

/*
Related to above code:

What changed?
Answer:  Before, we manually wrote every copy operation:
        customer.setCustomerName(request.getCustomerName());
        customer.setMobileNumber(request.getMobileNumber());
        many more lines

Now ModelMapper does it automatically because the field names match:
customerName → customerName
mobileNumber → mobileNumber
village      → village
status       → status

This line: return modelMapper.map(request, Customer.class);
means: 
Take CustomerCreateRequest
        ↓
Copy matching fields
        ↓
Create and return Customer entity

This line: modelMapper.map(request, customer);
means:
Take CustomerUpdateRequest
        ↓
Copy matching editable fields
        ↓
Update the existing Customer entity
It still protects customerId, status, and createdAt, because those fields do not exist in either request DTO.

*/




/*  
    - We added the config file and added the ModelMapper dependency in the pom.xml file 
      So we are simplifing the below code and adding the new simplified above code.

    - The ModelMapper project’s official setup uses this Maven dependency pattern; 
      the current Maven Central listing shows version 3.2.6. ModelMapper setup, version listing


package com.skcp.mapper;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import org.springframework.stereotype.Component;

@Component   // This tells Spring Boot: Create one CustomerMapper object automatically.
             // Later, CustomerService can receive and use it.
public class CustomerMapper 
{

    public Customer toEntity(CustomerCreateRequest request)    //This converts:   CustomerCreateRequest → Customer entity
                                                               //It creates a new empty Customer: Customer customer = new Customer();
    {
        Customer customer = new Customer();

        customer.setCustomerName(request.getCustomerName());
        customer.setMobileNumber(request.getMobileNumber());
        customer.setAlternateMobile(request.getAlternateMobile());
        customer.setAddress(request.getAddress());
        customer.setVillage(request.getVillage());
        customer.setCity(request.getCity());
        customer.setPincode(request.getPincode());
        customer.setGstNumber(request.getGstNumber());
        customer.setRemarks(request.getRemarks());

        return customer;
    }

    public void updateEntity(CustomerUpdateRequest request, Customer customer) 
    {
        customer.setCustomerName(request.getCustomerName());
        customer.setMobileNumber(request.getMobileNumber());
        customer.setAlternateMobile(request.getAlternateMobile());
        customer.setAddress(request.getAddress());
        customer.setVillage(request.getVillage());
        customer.setCity(request.getCity());
        customer.setPincode(request.getPincode());
        customer.setGstNumber(request.getGstNumber());
        customer.setRemarks(request.getRemarks());
    }

    public CustomerResponse toResponse(Customer customer) 
    {
        CustomerResponse response = new CustomerResponse();

        response.setCustomerId(customer.getCustomerId());
        response.setCustomerName(customer.getCustomerName());
        response.setMobileNumber(customer.getMobileNumber());
        response.setAlternateMobile(customer.getAlternateMobile());
        response.setAddress(customer.getAddress());
        response.setVillage(customer.getVillage());
        response.setCity(customer.getCity());
        response.setPincode(customer.getPincode());
        response.setGstNumber(customer.getGstNumber());
        response.setRemarks(customer.getRemarks());
        response.setStatus(customer.getStatus());
        response.setCreatedAt(customer.getCreatedAt());

        return response;
    }

    public CustomerSummaryResponse toSummaryResponse(Customer customer) 
    {
        CustomerSummaryResponse summaryResponse = new CustomerSummaryResponse();

        summaryResponse.setCustomerId(customer.getCustomerId());
        summaryResponse.setCustomerName(customer.getCustomerName());
        summaryResponse.setMobileNumber(customer.getMobileNumber());
        summaryResponse.setVillage(customer.getVillage());
        summaryResponse.setCity(customer.getCity());
        summaryResponse.setStatus(customer.getStatus());

        return summaryResponse;
    }
}

/*

public Customer toEntity(CustomerCreateRequest request)

This converts: CustomerCreateRequest → Customer entity
It creates a new empty Customer: Customer customer = new Customer();

Then copies only client-editable fields from the request into that entity.
Notice that it does not set: 
customerId
status
createdAt
 - customerId → database generates it.
 - status → service will set it to ACTIVE.
 - createdAt → @PrePersist in your entity sets it automatically.
---

public void updateEntity(CustomerUpdateRequest request, Customer customer)
This updates an existing Customer entity.
 
CustomerUpdateRequest → existing Customer entity

It intentionally preserves: 
customerId
status
createdAt
because we copy only editable fields.
---

public CustomerResponse toResponse(Customer customer)
This converts: Customer entity → CustomerResponse
Customer entity → CustomerResponse
Use it after creating, updating, or fetching one customer.
---

public CustomerSummaryResponse toSummaryResponse(Customer customer)
This converts:  Customer entity → CustomerSummaryResponse
Use it for a customer list or search result.
---

For this first DTO phase, we are mapping manually so every conversion is visible and understandable. 
In the next ModelMapper phase, we can simplify this class without changing its responsibility.

*/