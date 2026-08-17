package com.skcp.mapper;

import com.skcp.dto.request.supplier.SupplierCreateRequest;
import com.skcp.dto.request.supplier.SupplierUpdateRequest;
import com.skcp.dto.response.supplier.SupplierResponse;
import com.skcp.dto.response.supplier.SupplierSummaryResponse;
import com.skcp.entity.Supplier;

public class SupplierMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Supplier toEntity(SupplierCreateRequest request)
    {
        Supplier supplier = new Supplier();

        supplier.setSupplierName(request.getSupplierName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setPhone(request.getPhone());
        supplier.setWhatsapp(request.getWhatsapp());
        supplier.setAddress(request.getAddress());
        supplier.setGstNumber(request.getGstNumber());

        return supplier;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Supplier supplier,
            SupplierUpdateRequest request
    )
    {
        supplier.setSupplierName(request.getSupplierName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setPhone(request.getPhone());
        supplier.setWhatsapp(request.getWhatsapp());
        supplier.setAddress(request.getAddress());
        supplier.setGstNumber(request.getGstNumber());

        /*
         * Notice that supplierId, status and createdAt
         * are NOT updated here.
         *
         * These fields are controlled by the backend.
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE DTO
    // ============================================================

    public static SupplierResponse toResponse(Supplier supplier)
    {
        SupplierResponse response = new SupplierResponse();

        response.setSupplierId(supplier.getSupplierId());
        response.setSupplierName(supplier.getSupplierName());
        response.setContactPerson(supplier.getContactPerson());
        response.setPhone(supplier.getPhone());
        response.setWhatsapp(supplier.getWhatsapp());
        response.setAddress(supplier.getAddress());
        response.setGstNumber(supplier.getGstNumber());
        response.setStatus(supplier.getStatus());
        response.setCreatedAt(supplier.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE DTO
    // ============================================================

    public static SupplierSummaryResponse toSummaryResponse(
            Supplier supplier
    )
    {
        SupplierSummaryResponse response =
                new SupplierSummaryResponse();

        response.setSupplierId(supplier.getSupplierId());
        response.setSupplierName(supplier.getSupplierName());
        response.setPhone(supplier.getPhone());
        response.setStatus(supplier.getStatus());

        return response;
    }
}