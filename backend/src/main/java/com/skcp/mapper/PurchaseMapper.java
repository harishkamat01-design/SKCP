package com.skcp.mapper;

import com.skcp.dto.request.purchase.PurchaseCreateRequest;
import com.skcp.dto.request.purchase.PurchaseUpdateRequest;
import com.skcp.dto.response.purchase.PurchaseResponse;
import com.skcp.dto.response.purchase.PurchaseSummaryResponse;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.Purchase;

import java.util.List;

public class PurchaseMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Purchase toEntity(
            PurchaseCreateRequest request
    )
    {
        Purchase purchase = new Purchase();

        purchase.setPurchaseDate(
                request.getPurchaseDate()
        );

        purchase.setInvoiceNumber(
                request.getInvoiceNumber()
        );

        /*
         * totalAmount is backend-controlled.
         *
         * PurchaseService calculates it from
         * PurchaseItems.
         */

        purchase.setPaymentStatus(
                request.getPaymentStatus()
        );

        purchase.setRemarks(
                request.getRemarks()
        );

        /*
         * supplier is backend-controlled.
         *
         * PurchaseService retrieves Supplier
         * using supplierId.
         */

        /*
         * status is backend-controlled.
         *
         * PurchaseService sets ACTIVE.
         */

        return purchase;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Purchase purchase,
            PurchaseUpdateRequest request
    )
    {
        purchase.setPurchaseDate(
                request.getPurchaseDate()
        );

        purchase.setInvoiceNumber(
                request.getInvoiceNumber()
        );

        /*
         * totalAmount is NOT updated from request.
         *
         * It is calculated from PurchaseItems.
         */

        purchase.setPaymentStatus(
                request.getPaymentStatus()
        );

        purchase.setRemarks(
                request.getRemarks()
        );

        /*
         * These remain backend-controlled:
         *
         * purchaseId
         * supplier
         * totalAmount
         * status
         * createdAt
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE DTO
    // ============================================================

    public static PurchaseResponse toResponse(
            Purchase purchase
    )
    {
        PurchaseResponse response =
                new PurchaseResponse();

        // --------------------------------------------------------
        // PURCHASE BASIC INFORMATION
        // --------------------------------------------------------

        response.setPurchaseId(
                purchase.getPurchaseId()
        );

        response.setPurchaseDate(
                purchase.getPurchaseDate()
        );

        response.setInvoiceNumber(
                purchase.getInvoiceNumber()
        );

        response.setTotalAmount(
                purchase.getTotalAmount()
        );

        response.setPaymentStatus(
                purchase.getPaymentStatus()
        );

        response.setRemarks(
                purchase.getRemarks()
        );

        response.setStatus(
                purchase.getStatus()
        );

        response.setCreatedAt(
                purchase.getCreatedAt()
        );


        // --------------------------------------------------------
        // SUPPLIER INFORMATION
        // --------------------------------------------------------

        if (purchase.getSupplier() != null)
        {
            response.setSupplierId(
                    purchase.getSupplier().getSupplierId()
            );

            response.setSupplierName(
                    purchase.getSupplier().getSupplierName()
            );
        }


        // --------------------------------------------------------
        // PURCHASE ITEMS
        // --------------------------------------------------------

        if (purchase.getPurchaseItems() != null)
        {
            List<PurchaseItemResponse> purchaseItems =
                    purchase.getPurchaseItems()
                            .stream()
                            .map(PurchaseItemMapper::toResponse)
                            .toList();

            response.setPurchaseItems(
                    purchaseItems
            );
        }
        else
        {
            response.setPurchaseItems(
                    List.of()
            );
        }


        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE DTO
    // ============================================================

    public static PurchaseSummaryResponse toSummaryResponse(
            Purchase purchase
    )
    {
        PurchaseSummaryResponse response =
                new PurchaseSummaryResponse();

        response.setPurchaseId(
                purchase.getPurchaseId()
        );

        if (purchase.getSupplier() != null)
        {
            response.setSupplierId(
                    purchase.getSupplier().getSupplierId()
            );

            response.setSupplierName(
                    purchase.getSupplier().getSupplierName()
            );
        }

        response.setPurchaseDate(
                purchase.getPurchaseDate()
        );

        response.setInvoiceNumber(
                purchase.getInvoiceNumber()
        );

        response.setTotalAmount(
                purchase.getTotalAmount()
        );

        response.setPaymentStatus(
                purchase.getPaymentStatus()
        );

        response.setStatus(
                purchase.getStatus()
        );

        return response;
    }
}