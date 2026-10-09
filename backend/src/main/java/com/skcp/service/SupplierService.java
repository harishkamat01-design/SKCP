package com.skcp.service;

import com.skcp.dto.request.supplier.SupplierCreateRequest;
import com.skcp.dto.request.supplier.SupplierUpdateRequest;
import com.skcp.dto.response.supplier.SupplierResponse;
import com.skcp.dto.response.supplier.SupplierSummaryResponse;
import com.skcp.entity.Supplier;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.SupplierMapper;
import com.skcp.repository.SupplierRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService
{

    // Dependency Injection
    private final SupplierRepository supplierRepository;


    // Constructor Injection
    public SupplierService(SupplierRepository supplierRepository)
    {
        this.supplierRepository = supplierRepository;
    }


    // ============================================================
    // GET ALL SUPPLIERS
    // ============================================================

    /*public List<SupplierSummaryResponse> getAllSuppliers()
    {
        return supplierRepository.findAll()
                .stream()
                .map(SupplierMapper::toSummaryResponse)
                .toList();
    }*/

    public List<SupplierSummaryResponse> getAllSuppliers()
    {
        List<Supplier> suppliers = supplierRepository.findAll();

        suppliers.forEach(supplier ->
                System.out.println(
                        "SUPPLIER DEBUG -> ID: "
                        + supplier.getSupplierId()
                        + " | NAME: "
                        + supplier.getSupplierName()
                        + " | REMARKS: "
                        + supplier.getRemarks()
                )
        );

        return suppliers.stream()
                .map(SupplierMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET SUPPLIER BY ID
    // ============================================================

    public SupplierResponse getSupplierById(Integer id)
    {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id: " + id
                        )
                );

        return SupplierMapper.toResponse(supplier);
    }


    // ============================================================
    // CREATE SUPPLIER
    // ============================================================

    public SupplierResponse createSupplier(
            SupplierCreateRequest request
    )
    {
        if (supplierRepository.existsByPhoneAndStatus(
                request.getPhone(),
                "ACTIVE"))
        {
            throw new DuplicateResourceException(
                    "Supplier with phone number "
                            + request.getPhone()
                            + " already exists"
            );
        }

        Supplier supplier = SupplierMapper.toEntity(request);

        Supplier savedSupplier = supplierRepository.save(supplier);

        return SupplierMapper.toResponse(savedSupplier);
    }


    // ============================================================
    // UPDATE SUPPLIER
    // ============================================================

    public SupplierResponse updateSupplier(
            Integer id,
            SupplierUpdateRequest request
    )
    {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id: " + id
                        )
                );

        if (supplierRepository.existsByPhoneAndStatusAndSupplierIdNot(
                request.getPhone(),
                "ACTIVE",
                id))
        {
            throw new DuplicateResourceException(
                    "Supplier with phone number "
                            + request.getPhone()
                            + " already exists"
            );
        }

        SupplierMapper.updateEntity(
                existingSupplier,
                request
        );

        Supplier updatedSupplier =
                supplierRepository.save(existingSupplier);

        return SupplierMapper.toResponse(updatedSupplier);
    }


    // ============================================================
    // DELETE SUPPLIER - SOFT DELETE
    // ============================================================

    public void deleteSupplier(Integer id)
    {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id: " + id
                        )
                );

        supplier.setStatus("INACTIVE");

        supplierRepository.save(supplier);
    }

}