package com.skcp.mapper;

import com.skcp.dto.request.production.ProductionCreateRequest;
import com.skcp.dto.request.production.ProductionUpdateRequest;
import com.skcp.dto.response.production.ProductionResponse;
import com.skcp.dto.response.production.ProductionSummaryResponse;
import com.skcp.entity.Production;

public final class ProductionMapper 
{

    private ProductionMapper() 
    {

    }

    public static Production toEntity(ProductionCreateRequest request) 
    {
        Production production = new Production();

        production.setProductionDate(request.getProductionDate());

        production.setQuantityProduced(request.getQuantityProduced());

        production.setMorningCementBags(request.getMorningCementBags());

        production.setAfternoonCementBags(request.getAfternoonCementBags());

        production.setNotes(request.getNotes());

        return production;
    }

    public static void updateEntity(
            Production production,
            ProductionUpdateRequest request) 
    {
        production.setProductionDate(request.getProductionDate());

        production.setQuantityProduced(request.getQuantityProduced());

        production.setMorningCementBags(request.getMorningCementBags());

        production.setAfternoonCementBags(request.getAfternoonCementBags());

        production.setNotes(request.getNotes());
    }

    public static ProductionResponse toResponse(Production production) 
    {
        ProductionResponse response = new ProductionResponse();

        response.setProductionId(production.getProductionId());

        response.setProductionDate(production.getProductionDate());

        if (production.getProduct() != null) 
            {
            response.setProductId(production.getProduct().getProductId());

            response.setProductCode(production.getProduct().getProductCode());

            response.setProductName(production.getProduct().getProductName());

            response.setProductSize(production.getProduct().getSize());
            }

        response.setQuantityProduced(production.getQuantityProduced());

        response.setMorningCementBags(production.getMorningCementBags());

        response.setAfternoonCementBags(production.getAfternoonCementBags());

        response.setTotalCementBags(production.getTotalCementBags());

        if (production.getAsset() != null) 
            {
            response.setAssetId(production.getAsset().getAssetId());

            response.setAssetName(production.getAsset().getAssetName());

            response.setAssetCategory(production.getAsset().getAssetCategory());
        
            }

        response.setNotes(production.getNotes());

        response.setStatus(
                production.getStatus() == null
                        ? null
                        : production.getStatus().name());
        response.setCreatedAt(production.getCreatedAt());

        return response;
    }

    public static ProductionSummaryResponse toSummaryResponse(Production production) 
    {
        ProductionSummaryResponse response =   new ProductionSummaryResponse();

        response.setProductionId(production.getProductionId());

        response.setProductionDate(production.getProductionDate());

        if (production.getProduct() != null) 
            {
            response.setProductId(production.getProduct().getProductId());

            response.setProductName(production.getProduct().getProductName());

            response.setProductSize(production.getProduct().getSize());
            }

        response.setQuantityProduced(production.getQuantityProduced());

        response.setTotalCementBags(production.getTotalCementBags());

        if (production.getAsset() != null) 
            {
            response.setAssetId(production.getAsset().getAssetId());

            response.setAssetName(production.getAsset().getAssetName());
           }

        response.setStatus(
                production.getStatus() == null
                        ? null
                        : production.getStatus().name());

        return response;
    }
}
