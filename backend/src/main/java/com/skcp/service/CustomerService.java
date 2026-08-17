package com.skcp.service;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.CustomerMapper;
import com.skcp.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService
{
    private static final Logger logger =
            LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(
            CustomerRepository customerRepository,
            CustomerMapper customerMapper)
    {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerSummaryResponse> getAllCustomers()
    {
        return customerRepository.findByStatus("ACTIVE")
                .stream()
                .map(customerMapper::toSummaryResponse)
                .toList();
    }

    public CustomerResponse getCustomerById(Integer id)
    {
        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found with id: " + id
                                )
                        );

        return customerMapper.toResponse(customer);
    }

    public CustomerResponse createCustomer(
            CustomerCreateRequest request)
    {
        logger.info(
                "Creating new customer: {}",
                request.getCustomerName()
        );

        Customer customer =
                customerMapper.toEntity(request);

        customer.setStatus("ACTIVE");

        Customer savedCustomer =
                customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);
    }

    public CustomerResponse updateCustomer(
            Integer id,
            CustomerUpdateRequest request)
    {
        Customer existingCustomer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found with id: " + id
                                )
                        );

        customerMapper.updateEntity(
                request,
                existingCustomer
        );

        Customer updatedCustomer =
                customerRepository.save(existingCustomer);

        return customerMapper.toResponse(updatedCustomer);
    }

    public CustomerResponse deleteCustomer(Integer id)
    {
        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found with id: " + id
                                )
                        );

        customer.setStatus("INACTIVE");

        Customer updatedCustomer =
                customerRepository.save(customer);

        return customerMapper.toResponse(updatedCustomer);
    }
}

/* 
package com.skcp.service;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.CustomerMapper;
import com.skcp.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class CustomerService
{
    private static final Logger logger =
            LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(
            CustomerRepository customerRepository,
            CustomerMapper customerMapper)
    {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerSummaryResponse> getAllCustomers()
    {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toSummaryResponse)
                .toList();
    }

    public CustomerResponse getCustomerById(Integer id)
    {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        )
                );

        return customerMapper.toResponse(customer);
    }

    public CustomerResponse createCustomer(CustomerCreateRequest request)
    {
        logger.info(
                "Creating new customer: {}",
                request.getCustomerName()
        );

        Customer customer = customerMapper.toEntity(request);

        customer.setStatus("ACTIVE");

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);
    }

    public CustomerResponse updateCustomer(
            Integer id,
            CustomerUpdateRequest request)
    {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        )
                );

        customerMapper.updateEntity(request, existingCustomer);

        Customer updatedCustomer =
                customerRepository.save(existingCustomer);

        return customerMapper.toResponse(updatedCustomer);
    }

    public void deleteCustomer(Integer id)
    {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        )
                );

        customerRepository.delete(customer);
    }
}

*/

/*

What changed — only 3 things
1. Added import:
import com.skcp.exception.ResourceNotFoundException;

2. getCustomerById() and updateCustomer()
Changed:
.orElse(null)
plus null checking → orElseThrow(...).

3. deleteCustomer()
Changed:
public boolean deleteCustomer(Integer id)
to:
public void deleteCustomer(Integer id)
and missing customers now throw ResourceNotFoundException.

*/

//===================================================================================================================//

/*
package com.skcp.service;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.mapper.CustomerMapper;
import com.skcp.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class CustomerService 
{
    private static final Logger logger =
        LoggerFactory.getLogger(CustomerService.class);


    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(
            CustomerRepository customerRepository,
            CustomerMapper customerMapper) 
    {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }


    public List<CustomerSummaryResponse> getAllCustomers() 
    {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toSummaryResponse)
                .toList();
    }


    public CustomerResponse getCustomerById(Integer id) 
    {
        Customer customer = customerRepository.findById(id).orElse(null);

        if (customer == null) {
            return null;
        }

        return customerMapper.toResponse(customer);
    }


    public CustomerResponse createCustomer(CustomerCreateRequest request) 
    {    
         // logger.info("Creating new customer"); - this line of code replaced by below code
         logger.info("Creating new customer: {}", request.getCustomerName());   // logger added

        Customer customer = customerMapper.toEntity(request);

        customer.setStatus("ACTIVE");

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);
    }


    public CustomerResponse updateCustomer(
            Integer id,
            CustomerUpdateRequest request) 
    {
        Customer existingCustomer = customerRepository.findById(id).orElse(null);

            if (existingCustomer == null) 
            {
                return null;
            }

        customerMapper.updateEntity(request, existingCustomer);

        Customer updatedCustomer = customerRepository.save(existingCustomer);

        return customerMapper.toResponse(updatedCustomer);
    }


    public boolean deleteCustomer(Integer id) 
    {
    Customer customer = customerRepository.findById(id).orElse(null);

        if (customer == null) 
            {
            return false;
            }

        customerRepository.delete(customer);
        return true;
     }
}
   
*/

/*
1. First let's make sure you understand exactly what these three lines mean: Logger, LoggerFactory, CustomerService.class

2. Memory analogy:
        CustomerService
            ↓
        "Give me my official record book"
            ↓
        LoggerFactory
            ↓
        CustomerService Logger
            ↓
        logger.info(...)
        logger.warn(...)
        logger.error(...)
*/

//===================================================================================================================//
/*  
    Below code is before the implementation of DTO and Mapper concept.
    Before DTOs: Controller → Customer entity → Service → Repository
    The controller was directly sending database entities to the service: saveCustomer(Customer customer)
    
    After DTOs: Controller → Request DTO → Service → Mapper → Customer entity → Repository
    and back: Repository → Customer entity → Mapper → Response DTO → Controller

    So the service must change completely because it becomes the central place that uses the mapper.
    
    What stays the same:Customer entity, CustomerRepository, Database table, Database save/find/delete operations

    What changes: 
    getAllCustomers()     → returns summary DTOs, not entities
    getCustomerById()     → returns response DTO, not entity
    createCustomer()      → accepts CustomerCreateRequest
    updateCustomer()      → accepts CustomerUpdateRequest
    saveCustomer()        → is removed, because the controller must not save entities directly

This is a planned refactor—not a random rewrite. The next replacement of CustomerController.java will match this new service exactly.


package com.skcp.service;

import com.skcp.entity.Customer;
import com.skcp.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService 
{
    // Dependency Injection
    private final CustomerRepository customerRepository;

    // Constructor Injection
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Save customer
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Find customer by ID
    public Customer getCustomerById(Integer id) {
        return customerRepository.findById(id).orElse(null);
    }

    // Delete customer
    public void deleteCustomer(Integer id) {   
        customerRepository.deleteById(id);
    }
}
    
*/
//===================================================================================================================//