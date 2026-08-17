package com.skcp.mapper;

import com.skcp.dto.request.asset.AssetCreateRequest;
import com.skcp.dto.request.asset.AssetUpdateRequest;
import com.skcp.dto.response.asset.AssetResponse;
import com.skcp.dto.response.asset.AssetSummaryResponse;
import com.skcp.entity.Asset;

public class AssetMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Asset toEntity(AssetCreateRequest request)
    {
        Asset asset = new Asset();

        asset.setAssetName(request.getAssetName());
        asset.setAssetCategory(request.getAssetCategory());
        asset.setManufacturer(request.getManufacturer());
        asset.setModelNumber(request.getModelNumber());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setInstallationDate(request.getInstallationDate());
        asset.setLocation(request.getLocation());
        asset.setNotes(request.getNotes());

        return asset;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Asset asset,
            AssetUpdateRequest request
    )
    {
        asset.setAssetName(request.getAssetName());
        asset.setAssetCategory(request.getAssetCategory());
        asset.setManufacturer(request.getManufacturer());
        asset.setModelNumber(request.getModelNumber());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setInstallationDate(request.getInstallationDate());
        asset.setLocation(request.getLocation());
        asset.setNotes(request.getNotes());

        /*
         * Notice that assetId, status and createdAt
         * are NOT updated here.
         *
         * These fields are controlled by the backend.
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE DTO
    // ============================================================

    public static AssetResponse toResponse(Asset asset)
    {
        AssetResponse response = new AssetResponse();

        response.setAssetId(asset.getAssetId());
        response.setAssetName(asset.getAssetName());
        response.setAssetCategory(asset.getAssetCategory());
        response.setManufacturer(asset.getManufacturer());
        response.setModelNumber(asset.getModelNumber());
        response.setSerialNumber(asset.getSerialNumber());
        response.setPurchaseDate(asset.getPurchaseDate());
        response.setInstallationDate(asset.getInstallationDate());
        response.setLocation(asset.getLocation());
        response.setStatus(asset.getStatus());
        response.setLastMaintenanceDate(
                asset.getLastMaintenanceDate()
        );
        response.setNextMaintenanceDate(
                asset.getNextMaintenanceDate()
        );
        response.setNotes(asset.getNotes());
        response.setCreatedAt(asset.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE DTO
    // ============================================================

    public static AssetSummaryResponse toSummaryResponse(
            Asset asset
    )
    {
        AssetSummaryResponse response =
                new AssetSummaryResponse();

        response.setAssetId(asset.getAssetId());
        response.setAssetName(asset.getAssetName());
        response.setAssetCategory(asset.getAssetCategory());
        response.setLocation(asset.getLocation());
        response.setStatus(asset.getStatus());

        return response;
    }
}