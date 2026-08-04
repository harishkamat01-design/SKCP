package com.skcp.service;

import com.skcp.entity.Supplier;
import com.skcp.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    // Dependency Injection
    private final SupplierRepository supplierRepository;

    // Constructor Injection
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Get all suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Save supplier
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Find supplier by ID
    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id).orElse(null);
    }

    // Delete supplier
    public void deleteSupplier(Integer id) {
        supplierRepository.deleteById(id);
    }
}