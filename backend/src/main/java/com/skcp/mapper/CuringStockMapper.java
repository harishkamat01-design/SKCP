package com.skcp.mapper;

import com.skcp.dto.response.curringstock.CuringStockResponse;
import com.skcp.entity.CuringStock;
import org.springframework.stereotype.Component;

@Component
public class CuringStockMapper {

    public CuringStockResponse toResponse(CuringStock entity) {

        CuringStockResponse dto = new CuringStockResponse();

        dto.setCuringStockId(entity.getCuringStockId());

        if (entity.getProduction() != null) {
            dto.setProductionId(
                    entity.getProduction().getProductionId()
            );
        }

        if (entity.getProduct() != null) {
            dto.setProductId(
                    entity.getProduct().getProductId()
            );
        }

        dto.setQuantity(entity.getQuantity());
        dto.setProductionDate(entity.getProductionDate());
        dto.setExpectedReadyDate(entity.getExpectedReadyDate());
        dto.setStatus(entity.getStatus());
        dto.setRemarks(entity.getRemarks());
        dto.setRecordStatus(entity.getRecordStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }
}