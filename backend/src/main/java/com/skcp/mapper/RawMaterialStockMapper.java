package com.skcp.mapper;

import com.skcp.dto.request.rawmaterialstock.RawMaterialStockCreateRequest;
import com.skcp.dto.request.rawmaterialstock.RawMaterialStockUpdateRequest;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockResponse;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockSummaryResponse;
import com.skcp.entity.RawMaterialStock;

public final class RawMaterialStockMapper {

    private RawMaterialStockMapper() {
    }


    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static RawMaterialStock toEntity(
            RawMaterialStockCreateRequest request) {

        RawMaterialStock stock = new RawMaterialStock();

        stock.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        stock.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        stock.setNotes(
                request.getNotes()
        );

        /*
         * rawMaterial is NOT mapped here.
         *
         * Service will retrieve RawMaterial using:
         *
         * request.getRawMaterialId()
         *
         * System-managed fields are NOT mapped:
         *
         * - rawMaterialStockId
         * - lastUpdatedDate
         * - stockStatus
         * - recordStatus
         * - createdAt
         */

        return stock;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            RawMaterialStock stock,
            RawMaterialStockUpdateRequest request) {

        stock.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        stock.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        stock.setNotes(
                request.getNotes()
        );

        /*
         * Do NOT update:
         *
         * - rawMaterialStockId
         * - rawMaterial
         * - lastUpdatedDate
         * - stockStatus
         * - recordStatus
         * - createdAt
         *
         * These are controlled by the backend.
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public static RawMaterialStockResponse toResponse(
            RawMaterialStock stock) {

        RawMaterialStockResponse response =
                new RawMaterialStockResponse();


        // --------------------------------------------------------
        // STOCK ID
        // --------------------------------------------------------

        response.setRawMaterialStockId(
                stock.getRawMaterialStockId()
        );


        // --------------------------------------------------------
        // RAW MATERIAL
        // --------------------------------------------------------

        if (stock.getRawMaterial() != null) {

            response.setRawMaterialId(
                    stock.getRawMaterial()
                            .getRawMaterialId()
            );

            response.setRawMaterialName(
                    stock.getRawMaterial()
                            .getMaterialName()
            );

            response.setRawMaterialUnit(
                    stock.getRawMaterial()
                            .getUnit() == null
                            ? null
                            : stock.getRawMaterial()
                                    .getUnit()
                                    .name()
            );
        }


        // --------------------------------------------------------
        // STOCK DETAILS
        // --------------------------------------------------------

        response.setCurrentStockLevel(
                stock.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                stock.getMinimumStockLevel()
        );

        response.setLastUpdatedDate(
                stock.getLastUpdatedDate()
        );


        // --------------------------------------------------------
        // STOCK STATUS
        // --------------------------------------------------------

        response.setStockStatus(
                stock.getStockStatus() == null
                        ? null
                        : stock.getStockStatus().name()
        );


        // --------------------------------------------------------
        // RECORD STATUS
        // --------------------------------------------------------

        response.setRecordStatus(
                stock.getRecordStatus() == null
                        ? null
                        : stock.getRecordStatus().name()
        );


        // --------------------------------------------------------
        // OTHER DETAILS
        // --------------------------------------------------------

        response.setNotes(
                stock.getNotes()
        );

        response.setCreatedAt(
                stock.getCreatedAt()
        );


        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public static RawMaterialStockSummaryResponse
    toSummaryResponse(
            RawMaterialStock stock) {

        RawMaterialStockSummaryResponse response =
                new RawMaterialStockSummaryResponse();


        // --------------------------------------------------------
        // STOCK ID
        // --------------------------------------------------------

        response.setRawMaterialStockId(
                stock.getRawMaterialStockId()
        );


        // --------------------------------------------------------
        // RAW MATERIAL
        // --------------------------------------------------------

        if (stock.getRawMaterial() != null) {

            response.setRawMaterialId(
                    stock.getRawMaterial()
                            .getRawMaterialId()
            );

            response.setRawMaterialName(
                    stock.getRawMaterial()
                            .getMaterialName()
            );

            response.setRawMaterialUnit(
                    stock.getRawMaterial()
                            .getUnit() == null
                            ? null
                            : stock.getRawMaterial()
                                    .getUnit()
                                    .name()
            );
        }


        // --------------------------------------------------------
        // STOCK
        // --------------------------------------------------------

        response.setCurrentStockLevel(
                stock.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                stock.getMinimumStockLevel()
        );


        // --------------------------------------------------------
        // STOCK STATUS
        // --------------------------------------------------------

        response.setStockStatus(
                stock.getStockStatus() == null
                        ? null
                        : stock.getStockStatus().name()
        );


        // --------------------------------------------------------
        // RECORD STATUS
        // --------------------------------------------------------

        response.setRecordStatus(
                stock.getRecordStatus() == null
                        ? null
                        : stock.getRecordStatus().name()
        );


        return response;
    }
}