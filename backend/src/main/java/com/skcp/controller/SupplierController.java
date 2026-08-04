package com.skcp.controller;

import com.skcp.entity.Supplier;
import com.skcp.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    // Dependency Injection
    private final SupplierService supplierService;

    // Constructor Injection
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Get all suppliers
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    // Get supplier by ID
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Integer id) {

        Supplier supplier = supplierService.getSupplierById(id);

        if (supplier == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(supplier);
    }

    // Create supplier
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {

        Supplier savedSupplier = supplierService.saveSupplier(supplier);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSupplier);
    }

    // Update supplier
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Integer id,
            @RequestBody Supplier supplier) {

        Supplier existingSupplier = supplierService.getSupplierById(id);

        if (existingSupplier == null) {
            return ResponseEntity.notFound().build();
        }

        // Update only editable fields
        existingSupplier.setSupplierName(supplier.getSupplierName());
        existingSupplier.setContactPerson(supplier.getContactPerson());
        existingSupplier.setPhone(supplier.getPhone());
        existingSupplier.setWhatsapp(supplier.getWhatsapp());
        existingSupplier.setAddress(supplier.getAddress());
        existingSupplier.setGstNumber(supplier.getGstNumber());
        existingSupplier.setStatus(supplier.getStatus());

        Supplier updatedSupplier = supplierService.saveSupplier(supplier);

        return ResponseEntity.ok(updatedSupplier);
    }

    // Delete supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Integer id) {

        Supplier existingSupplier = supplierService.getSupplierById(id);

        if (existingSupplier == null) {
            return ResponseEntity.notFound().build();
        }

        supplierService.deleteSupplier(id);

        return ResponseEntity.noContent().build();
    }
}