package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.supplier.SupplierCreateRequest;
import com.skcp.dto.request.supplier.SupplierUpdateRequest;
import com.skcp.dto.response.supplier.SupplierResponse;
import com.skcp.dto.response.supplier.SupplierSummaryResponse;
import com.skcp.service.SupplierService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController
{

    private final SupplierService supplierService;


    // Constructor Injection
    public SupplierController(SupplierService supplierService)
    {
        this.supplierService = supplierService;
    }


    // ============================================================
    // GET ALL SUPPLIERS
    // ============================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierSummaryResponse>>> getAllSuppliers()
    {
        List<SupplierSummaryResponse> suppliers =
                supplierService.getAllSuppliers();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Suppliers retrieved successfully",
                        suppliers
                )
        );
    }


    // ============================================================
    // GET SUPPLIER BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponse>> getSupplierById(
            @PathVariable Integer id
    )
    {
        SupplierResponse supplier =
                supplierService.getSupplierById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Supplier retrieved successfully",
                        supplier
                )
        );
    }


    // ============================================================
    // CREATE SUPPLIER
    // ============================================================

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierResponse>> createSupplier(
            @Valid @RequestBody SupplierCreateRequest request
    )
    {
        SupplierResponse savedSupplier =
                supplierService.createSupplier(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Supplier created successfully",
                        savedSupplier
                )
        );
    }


    // ============================================================
    // UPDATE SUPPLIER
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponse>> updateSupplier(
            @PathVariable Integer id,
            @Valid @RequestBody SupplierUpdateRequest request
    )
    {
        SupplierResponse updatedSupplier =
                supplierService.updateSupplier(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Supplier updated successfully",
                        updatedSupplier
                )
        );
    }


    // ============================================================
    // DELETE SUPPLIER
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(
            @PathVariable Integer id
    )
    {
        supplierService.deleteSupplier(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Supplier deleted successfully",
                        null
                )
        );
    }
}