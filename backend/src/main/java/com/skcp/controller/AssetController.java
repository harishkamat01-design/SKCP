package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.asset.AssetCreateRequest;
import com.skcp.dto.request.asset.AssetUpdateRequest;
import com.skcp.dto.response.asset.AssetResponse;
import com.skcp.dto.response.asset.AssetSummaryResponse;
import com.skcp.service.AssetService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController
{

    private final AssetService assetService;


    // Constructor Injection
    public AssetController(AssetService assetService)
    {
        this.assetService = assetService;
    }


    // ============================================================
    // GET ALL ASSETS
    // ============================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetSummaryResponse>>> getAllAssets()
    {
        List<AssetSummaryResponse> assets =
                assetService.getAllAssets();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Assets retrieved successfully",
                        assets
                )
        );
    }


    // ============================================================
    // GET ASSET BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> getAssetById(
            @PathVariable Integer id
    )
    {
        AssetResponse asset =
                assetService.getAssetById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Asset retrieved successfully",
                        asset
                )
        );
    }


    // ============================================================
    // CREATE ASSET
    // ============================================================

    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(
            @Valid @RequestBody AssetCreateRequest request
    )
    {
        AssetResponse savedAsset =
                assetService.createAsset(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Asset created successfully",
                        savedAsset
                )
        );
    }


    // ============================================================
    // UPDATE ASSET
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> updateAsset(
            @PathVariable Integer id,
            @Valid @RequestBody AssetUpdateRequest request
    )
    {
        AssetResponse updatedAsset =
                assetService.updateAsset(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Asset updated successfully",
                        updatedAsset
                )
        );
    }


    // ============================================================
    // DELETE ASSET
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(
            @PathVariable Integer id
    )
    {
        assetService.deleteAsset(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Asset deleted successfully",
                        null
                )
        );
    }

}