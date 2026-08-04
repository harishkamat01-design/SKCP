package com.skcp.controller;

import com.skcp.entity.Customer;
import com.skcp.service.CustomerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);                                        // HTTP 200 OK
    }

    // Create customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);
        return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);             // HTTP 201 OK
    }

    // Update customer
@PutMapping("/{id}")
public ResponseEntity<Customer> updateCustomer(
        @PathVariable Integer id,
        @RequestBody Customer customer) {

    Customer existingCustomer = customerService.getCustomerById(id);

    if (existingCustomer == null) {
        return ResponseEntity.notFound().build();
    }

    // Update only editable fields
    existingCustomer.setCustomerName(customer.getCustomerName());
    existingCustomer.setMobileNumber(customer.getMobileNumber());
    existingCustomer.setAlternateMobile(customer.getAlternateMobile());
    existingCustomer.setAddress(customer.getAddress());
    existingCustomer.setVillage(customer.getVillage());
    existingCustomer.setCity(customer.getCity());
    existingCustomer.setPincode(customer.getPincode());
    existingCustomer.setGstNumber(customer.getGstNumber());
    existingCustomer.setRemarks(customer.getRemarks());
    existingCustomer.setStatus(customer.getStatus());

    Customer updatedCustomer = customerService.saveCustomer(existingCustomer);

    return ResponseEntity.ok(updatedCustomer);
}

    // Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();                                  // HTTP 204 No Content
    }
}

