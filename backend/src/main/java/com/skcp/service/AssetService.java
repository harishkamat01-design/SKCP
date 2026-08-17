package com.skcp.service;

import com.skcp.dto.request.asset.AssetCreateRequest;
import com.skcp.dto.request.asset.AssetUpdateRequest;
import com.skcp.dto.response.asset.AssetResponse;
import com.skcp.dto.response.asset.AssetSummaryResponse;
import com.skcp.entity.Asset;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.AssetMapper;
import com.skcp.repository.AssetRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService
{

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final AssetRepository assetRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public AssetService(AssetRepository assetRepository)
    {
        this.assetRepository = assetRepository;
    }


    // ============================================================
    // GET ALL ASSETS
    // ============================================================

    public List<AssetSummaryResponse> getAllAssets()
    {
        return assetRepository.findAll()
                .stream()
                .map(AssetMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET ASSET BY ID
    // ============================================================

    public AssetResponse getAssetById(Integer id)
    {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Asset not found with id: " + id
                        )
                );

        return AssetMapper.toResponse(asset);
    }


    // ============================================================
    // CREATE ASSET
    // ============================================================

        public AssetResponse createAsset(
                AssetCreateRequest request
        )
        {
        Asset asset = AssetMapper.toEntity(request);

        // Backend-controlled field
        asset.setStatus("ACTIVE");

        Asset savedAsset = assetRepository.save(asset);

        return AssetMapper.toResponse(savedAsset);
}


    // ============================================================
    // UPDATE ASSET
    // ============================================================

    public AssetResponse updateAsset(
            Integer id,
            AssetUpdateRequest request
    )
    {
        Asset existingAsset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Asset not found with id: " + id
                        )
                );

        AssetMapper.updateEntity(
                existingAsset,
                request
        );

        /*
         * Notice that AssetMapper.updateEntity()
         * does NOT update:
         *
         * - assetId
         * - status
         * - createdAt
         *
         * These fields remain backend-controlled.
         */

        Asset updatedAsset =
                assetRepository.save(existingAsset);

        return AssetMapper.toResponse(updatedAsset);
    }


    // ============================================================
    // DELETE ASSET - SOFT DELETE
    // ============================================================

    public void deleteAsset(Integer id)
    {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Asset not found with id: " + id
                        )
                );

        /*
         * Do NOT physically delete the asset.
         *
         * Assets are business records that may be useful
         * for historical maintenance and operational analysis.
         */

        asset.setStatus("INACTIVE");

        assetRepository.save(asset);
    }
}




/*
package com.skcp.service;

import com.skcp.entity.Asset;
import com.skcp.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    // Dependency Injection
    private final AssetRepository assetRepository;

    // Constructor Injection
    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    // Get all assets
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    // Save asset
    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    // Find asset by ID
    public Asset getAssetById(Integer id) {
        return assetRepository.findById(id).orElse(null);
    }

    // Delete asset
    public void deleteAsset(Integer id) {
        assetRepository.deleteById(id);
    }
}
*/