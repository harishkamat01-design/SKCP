package com.skcp.controller;

import com.skcp.entity.Asset;
import com.skcp.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    // Dependency Injection
    private final AssetService assetService;

    // Constructor Injection
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    // Get all assets
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {

        List<Asset> assetList = assetService.getAllAssets();

        return ResponseEntity.ok(assetList);
    }

    // Get asset by ID
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Integer id) {

        Asset asset = assetService.getAssetById(id);

        if (asset == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(asset);
    }

    // Create asset
    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {

        Asset savedAsset = assetService.saveAsset(asset);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAsset);
    }

    // Update asset
    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable Integer id,
            @RequestBody Asset asset) {

        Asset existingAsset = assetService.getAssetById(id);

        if (existingAsset == null) {
            return ResponseEntity.notFound().build();
        }

        // Update editable fields
        existingAsset.setAssetName(asset.getAssetName());
        existingAsset.setAssetCategory(asset.getAssetCategory());
        existingAsset.setManufacturer(asset.getManufacturer());
        existingAsset.setModelNumber(asset.getModelNumber());
        existingAsset.setSerialNumber(asset.getSerialNumber());
        existingAsset.setPurchaseDate(asset.getPurchaseDate());
        existingAsset.setInstallationDate(asset.getInstallationDate());
        existingAsset.setLocation(asset.getLocation());
        existingAsset.setStatus(asset.getStatus());
        existingAsset.setLastMaintenanceDate(asset.getLastMaintenanceDate());
        existingAsset.setNextMaintenanceDate(asset.getNextMaintenanceDate());
        existingAsset.setNotes(asset.getNotes());

        Asset updatedAsset = assetService.saveAsset(existingAsset);

        return ResponseEntity.ok(updatedAsset);
    }

    // Delete asset
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Integer id) {

        Asset existingAsset = assetService.getAssetById(id);

        if (existingAsset == null) {
            return ResponseEntity.notFound().build();
        }

        assetService.deleteAsset(id);

        return ResponseEntity.noContent().build();
    }
}