package com.skcp.mapper;

import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockCreateRequest;
import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockUpdateRequest;
import com.skcp.dto.response.finishedgoodsstock.FinishedGoodsStockResponse;
import com.skcp.dto.response.finishedgoodsstock.FinishedGoodsStockSummaryResponse;
import com.skcp.entity.FinishedGoodsStock;
import org.springframework.stereotype.Component;

@Component
public class FinishedGoodsStockMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public FinishedGoodsStock toEntity(
            FinishedGoodsStockCreateRequest request) {

        FinishedGoodsStock entity =
                new FinishedGoodsStock();

        entity.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        entity.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        entity.setNotes(
                request.getNotes()
        );

        return entity;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public void updateEntity(
            FinishedGoodsStock entity,
            FinishedGoodsStockUpdateRequest request) {

        entity.setCurrentStockLevel(
                request.getCurrentStockLevel()
        );

        entity.setMinimumStockLevel(
                request.getMinimumStockLevel()
        );

        entity.setNotes(
                request.getNotes()
        );
    }


    // ============================================================
    // ENTITY → FULL RESPONSE DTO
    // ============================================================

    public FinishedGoodsStockResponse toResponse(
            FinishedGoodsStock entity) {

        FinishedGoodsStockResponse response =
                new FinishedGoodsStockResponse();

        response.setFinishedGoodsStockId(
                entity.getFinishedGoodsStockId()
        );

        response.setProductId(
                entity.getProduct().getProductId()
        );

        response.setCurrentStockLevel(
                entity.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                entity.getMinimumStockLevel()
        );

        response.setLastUpdatedDate(
                entity.getLastUpdatedDate()
        );

        response.setStatus(
                entity.getStatus()
        );

        response.setNotes(
                entity.getNotes()
        );

        response.setCreatedAt(
                entity.getCreatedAt()
        );

        /*
         * recordStatus is intentionally not mapped here unless
         * FinishedGoodsStockResponse contains a recordStatus field.
         *
         * The database still maintains:
         *
         * ACTIVE   → normal active record
         * INACTIVE → soft-deleted record
         *
         * DELETE returns the mapped entity with HTTP 200 OK.
         */

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE DTO
    // ============================================================

    public FinishedGoodsStockSummaryResponse toSummaryResponse(
            FinishedGoodsStock entity) {

        FinishedGoodsStockSummaryResponse response =
                new FinishedGoodsStockSummaryResponse();

        response.setFinishedGoodsStockId(
                entity.getFinishedGoodsStockId()
        );

        response.setProductId(
                entity.getProduct().getProductId()
        );

        response.setCurrentStockLevel(
                entity.getCurrentStockLevel()
        );

        response.setMinimumStockLevel(
                entity.getMinimumStockLevel()
        );

        response.setStatus(
                entity.getStatus()
        );

        return response;
    }
}