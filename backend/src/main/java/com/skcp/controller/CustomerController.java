package com.skcp.controller;

import com.skcp.entity.Customer;
import com.skcp.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
    
@RestController
@RequestMapping("/api/customers")
public class CustomerController 

{
    private final CustomerService customerService;  

    public CustomerController(CustomerService customerService)
    {
        this.customerService = customerService;
    }

    // Get all customers
    @GetMapping
    public List<Customer> getAllCustomers()
    {
        return customerService.getAllCustomers();
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Integer id)
    {
        return customerService.getCustomerById(id);
    }

    // Create customer
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer)
    {
        return customerService.saveCustomer(customer);
    }

    // Update customer
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Integer id,
                                   @RequestBody Customer customer) 
    {
        customer.setCustomerId(id);
        return customerService.saveCustomer(customer);
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Integer id) 
    {
        customerService.deleteCustomer(id);
    }

}