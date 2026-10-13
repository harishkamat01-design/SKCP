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

        stock.setStockDate(request.getStockDate());

        stock.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        stock.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        stock.setNotes(request.getNotes());

        return stock;
    }

    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            RawMaterialStock stock,
            RawMaterialStockUpdateRequest request) {

        stock.setStockDate(request.getStockDate());

        stock.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        stock.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        stock.setNotes(request.getNotes());
    }

    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public static RawMaterialStockResponse toResponse(
            RawMaterialStock stock) {

        RawMaterialStockResponse response =
                new RawMaterialStockResponse();

        response.setRawMaterialStockId(
                stock.getRawMaterialStockId()
        );

        if (stock.getRawMaterial() != null) {
            response.setRawMaterialId(
                    stock.getRawMaterial().getRawMaterialId()
            );

            response.setRawMaterialName(
                    stock.getRawMaterial().getMaterialName()
            );

            response.setRawMaterialUnit(
                    stock.getRawMaterial().getUnit() == null
                            ? null
                            : stock.getRawMaterial()
                                    .getUnit()
                                    .name()
            );
        }

        response.setStockDate(stock.getStockDate());

        response.setCurrentStockLevel(
                stock.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                stock.getMinimumStockLevel()
        );

        response.setLastUpdatedDate(
                stock.getLastUpdatedDate()
        );

        response.setStockStatus(
                stock.getStockStatus() == null
                        ? null
                        : stock.getStockStatus().name()
        );

        response.setRecordStatus(
                stock.getRecordStatus() == null
                        ? null
                        : stock.getRecordStatus().name()
        );

        response.setNotes(stock.getNotes());
        response.setCreatedAt(stock.getCreatedAt());

        return response;
    }

    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public static RawMaterialStockSummaryResponse toSummaryResponse(
            RawMaterialStock stock) {

        RawMaterialStockSummaryResponse response =
                new RawMaterialStockSummaryResponse();

        response.setRawMaterialStockId(
                stock.getRawMaterialStockId()
        );

        if (stock.getRawMaterial() != null) {
            response.setRawMaterialId(
                    stock.getRawMaterial().getRawMaterialId()
            );

            response.setRawMaterialName(
                    stock.getRawMaterial().getMaterialName()
            );

            response.setRawMaterialUnit(
                    stock.getRawMaterial().getUnit() == null
                            ? null
                            : stock.getRawMaterial()
                                    .getUnit()
                                    .name()
            );
        }

        response.setStockDate(stock.getStockDate());

        response.setLastUpdatedDate(
                stock.getLastUpdatedDate()
        );

        response.setCurrentStockLevel(
                stock.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                stock.getMinimumStockLevel()
        );

        response.setStockStatus(
                stock.getStockStatus() == null
                        ? null
                        : stock.getStockStatus().name()
        );

        response.setRecordStatus(
                stock.getRecordStatus() == null
                        ? null
                        : stock.getRecordStatus().name()
        );

        return response;
    }
}
