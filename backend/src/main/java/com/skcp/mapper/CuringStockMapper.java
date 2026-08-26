package com.skcp.mapper;

import com.skcp.dto.response.curingstock.CuringStockResponse;
import com.skcp.dto.response.curingstock.CuringStockSummaryResponse;
import com.skcp.entity.CuringStock;

import org.springframework.stereotype.Component;

@Component
public class CuringStockMapper {

    // ============================================================
    // DETAIL RESPONSE MAPPING
    // ============================================================

    public CuringStockResponse toResponse(
            CuringStock entity) {

        CuringStockResponse dto =
                new CuringStockResponse();

        // --------------------------------------------------------
        // CURING STOCK
        // --------------------------------------------------------

        dto.setCuringStockId(
                entity.getCuringStockId()
        );

        // --------------------------------------------------------
        // PRODUCTION
        // --------------------------------------------------------

        if (entity.getProduction() != null) {

            dto.setProductionId(
                    entity.getProduction()
                            .getProductionId()
            );
        }

        // --------------------------------------------------------
        // PRODUCT
        // --------------------------------------------------------

        if (entity.getProduct() != null) {

            dto.setProductId(
                    entity.getProduct()
                            .getProductId()
            );
        }

        // --------------------------------------------------------
        // STOCK DETAILS
        // --------------------------------------------------------

        dto.setQuantity(
                entity.getQuantity()
        );

        dto.setProductionDate(
                entity.getProductionDate()
        );

        dto.setExpectedReadyDate(
                entity.getExpectedReadyDate()
        );

        // --------------------------------------------------------
        // LIFECYCLE STATUS
        // --------------------------------------------------------

        dto.setStatus(
                entity.getStatus()
        );

        // --------------------------------------------------------
        // OTHER DETAILS
        // --------------------------------------------------------

        dto.setRemarks(
                entity.getRemarks()
        );

        dto.setRecordStatus(
                entity.getRecordStatus()
        );

        dto.setCreatedAt(
                entity.getCreatedAt()
        );

        return dto;
    }

    // ============================================================
    // SUMMARY RESPONSE MAPPING
    // ============================================================

    public CuringStockSummaryResponse toSummaryResponse(
            CuringStock entity) {

        CuringStockSummaryResponse dto =
                new CuringStockSummaryResponse();

        // --------------------------------------------------------
        // CURING STOCK
        // --------------------------------------------------------

        dto.setCuringStockId(
                entity.getCuringStockId()
        );

        // --------------------------------------------------------
        // PRODUCTION
        // --------------------------------------------------------

        if (entity.getProduction() != null) {

            dto.setProductionId(
                    entity.getProduction()
                            .getProductionId()
            );
        }

        // --------------------------------------------------------
        // PRODUCT
        // --------------------------------------------------------

        if (entity.getProduct() != null) {

            dto.setProductId(
                    entity.getProduct()
                            .getProductId()
            );

            // IMPORTANT:
            // Product name is now included in the summary.
            dto.setProductName(
                    entity.getProduct()
                            .getProductName()
            );
        }

        // --------------------------------------------------------
        // STOCK DETAILS
        // --------------------------------------------------------

        dto.setQuantity(
                entity.getQuantity()
        );

        dto.setProductionDate(
                entity.getProductionDate()
        );

        dto.setExpectedReadyDate(
                entity.getExpectedReadyDate()
        );

        // --------------------------------------------------------
        // LIFECYCLE STATUS
        // --------------------------------------------------------

        dto.setStatus(
                entity.getStatus()
        );

        // --------------------------------------------------------
        // RECORD STATUS
        // --------------------------------------------------------

        dto.setRecordStatus(
                entity.getRecordStatus()
        );

        return dto;
    }
}
