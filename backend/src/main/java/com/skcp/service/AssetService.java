package com.skcp.service;

import com.skcp.dto.request.asset.AssetCreateRequest;
import com.skcp.dto.request.asset.AssetUpdateRequest;
import com.skcp.dto.response.asset.AssetResponse;
import com.skcp.dto.response.asset.AssetSummaryResponse;
import com.skcp.entity.Asset;
import com.skcp.exception.DuplicateResourceException;
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
         * AssetMapper.updateEntity() does NOT update:
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
         * Prevent repeated soft deletion.
         *
         * If the asset is already inactive,
         * return a duplicate/conflict response.
         */
        if ("INACTIVE".equals(asset.getStatus()))
        {
            throw new DuplicateResourceException(
                    "Asset is already inactive with id: " + id
            );
        }

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