package com.skcp.service;

import com.skcp.entity.RawMaterial;
import com.skcp.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialService {

    // Dependency Injection
    private final RawMaterialRepository rawMaterialRepository;

    // Constructor Injection
    public RawMaterialService(RawMaterialRepository rawMaterialRepository) {
        this.rawMaterialRepository = rawMaterialRepository;
    }

    // Get all raw materials
    public List<RawMaterial> getAllRawMaterials() {
        return rawMaterialRepository.findAll();
    }

    // Save raw material
    public RawMaterial saveRawMaterial(RawMaterial rawMaterial) {
        return rawMaterialRepository.save(rawMaterial);
    }

    // Find raw material by ID
    public RawMaterial getRawMaterialById(Integer id) {
        return rawMaterialRepository.findById(id).orElse(null);
    }

    // Delete raw material
    public void deleteRawMaterial(Integer id) {
        rawMaterialRepository.deleteById(id);
    }
}