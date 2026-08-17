package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerSummaryResponse>>> getAllCustomers()
    {
        List<CustomerSummaryResponse> customers =
                customerService.getAllCustomers();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customers retrieved successfully",
                        customers
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(
            @PathVariable Integer id
    )
    {
        CustomerResponse customer =
                customerService.getCustomerById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer retrieved successfully",
                        customer
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request
    )
    {
        CustomerResponse savedCustomer =
                customerService.createCustomer(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Customer created successfully",
                        savedCustomer
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request
    )
    {
        CustomerResponse updatedCustomer =
                customerService.updateCustomer(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer updated successfully",
                        updatedCustomer
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> deleteCustomer(
            @PathVariable Integer id
    )
    {
        CustomerResponse deletedCustomer =
                customerService.deleteCustomer(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer marked as inactive successfully",
                        deletedCustomer
                )
        );
    }
}








/* 
package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerSummaryResponse>>> getAllCustomers()
    {
        List<CustomerSummaryResponse> customers =
                customerService.getAllCustomers();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customers retrieved successfully",
                        customers
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(
            @PathVariable Integer id
    )
    {
        CustomerResponse customer =
                customerService.getCustomerById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer retrieved successfully",
                        customer
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request
    )
    {
        CustomerResponse savedCustomer =
                customerService.createCustomer(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Customer created successfully",
                        savedCustomer
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request
    )
    {
        CustomerResponse updatedCustomer =
                customerService.updateCustomer(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer updated successfully",
                        updatedCustomer
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Integer id
    )
    {
        customerService.deleteCustomer(id);

        return ResponseEntity.noContent().build();
    }
}

*/

/* Below code is changed and updated with above code after the common ApiResponse.java file and ExceptionHandler.
   This ApiResponse.java file will now create one reusable response wrapper for every successful API response.

package com.skcp.controller;

import com.skcp.dto.request.customer.CustomerCreateRequest;
import com.skcp.dto.request.customer.CustomerUpdateRequest;
import com.skcp.dto.response.customer.CustomerResponse;
import com.skcp.dto.response.customer.CustomerSummaryResponse;
import com.skcp.service.CustomerService;
import jakarta.validation.Valid;
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

    @GetMapping
    public ResponseEntity<List<CustomerSummaryResponse>> getAllCustomers() {
        List<CustomerSummaryResponse> customers = customerService.getAllCustomers();

        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(
            @PathVariable Integer id
    ) {
        CustomerResponse customer = customerService.getCustomerById(id);

        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request
    ) {
        CustomerResponse savedCustomer = customerService.createCustomer(request);

        return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request
    ) {
        CustomerResponse updatedCustomer = customerService.updateCustomer(id, request);

        if (updatedCustomer == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
        @PathVariable Integer id
        ) 
        
        {
            boolean isDeleted = customerService.deleteCustomer(id);

            if (!isDeleted) 
                {
                    return ResponseEntity.notFound().build();
                }

            return ResponseEntity.noContent().build();
        }
}

*/


/*
The major difference is this: @Valid @RequestBody CustomerCreateRequest request
@RequestBody reads JSON from Postman.
CustomerCreateRequest accepts only allowed creation fields.
@Valid activates the validation rules we wrote, such as mobile number and pincode rules.

Before, we used: @RequestBody Customer customer 
That gave Postman access to the database entity. Now Postman sends a request DTO instead.

Also notice this import is gone:    import com.skcp.entity.Customer;
The controller should no longer know or use the Customer entity. 
Its work is now strictly: Request DTO → Service → Response DTO

*/

//==============================================================================================//

/* 

Below code is before the implementation of DTO and Mapper concept.

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

*/
