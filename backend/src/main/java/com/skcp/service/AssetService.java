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