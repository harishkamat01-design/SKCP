package com.skcp.controller;

import com.skcp.entity.RawMaterial;
import com.skcp.service.RawMaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {

    // Dependency Injection
    private final RawMaterialService rawMaterialService;

    // Constructor Injection
    public RawMaterialController(RawMaterialService rawMaterialService) {
        this.rawMaterialService = rawMaterialService;
    }

    // Get all raw materials
    @GetMapping
    public ResponseEntity<List<RawMaterial>> getAllRawMaterials() {

        List<RawMaterial> rawMaterials = rawMaterialService.getAllRawMaterials();

        return ResponseEntity.ok(rawMaterials);
    }

    // Get raw material by ID
    @GetMapping("/{id}")
    public ResponseEntity<RawMaterial> getRawMaterialById(@PathVariable Integer id) {

        RawMaterial rawMaterial = rawMaterialService.getRawMaterialById(id);

        if (rawMaterial == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rawMaterial);
    }

    // Create raw material
    @PostMapping
    public ResponseEntity<RawMaterial> createRawMaterial(@RequestBody RawMaterial rawMaterial) {

        RawMaterial savedRawMaterial = rawMaterialService.saveRawMaterial(rawMaterial);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRawMaterial);
    }

  // Update raw material
@PutMapping("/{id}")
public ResponseEntity<RawMaterial> updateRawMaterial(
        @PathVariable Integer id,
        @RequestBody RawMaterial rawMaterial) {

    RawMaterial existingRawMaterial = rawMaterialService.getRawMaterialById(id);

    if (existingRawMaterial == null) {
        return ResponseEntity.notFound().build();
    }

    // Update only editable fields
    existingRawMaterial.setMaterialName(rawMaterial.getMaterialName());
    existingRawMaterial.setMaterialCategory(rawMaterial.getMaterialCategory());
    existingRawMaterial.setDescription(rawMaterial.getDescription());
    existingRawMaterial.setStatus(rawMaterial.getStatus());

    RawMaterial updatedRawMaterial =
            rawMaterialService.saveRawMaterial(existingRawMaterial);

    return ResponseEntity.ok(updatedRawMaterial);
}

    // Delete raw material
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRawMaterial(@PathVariable Integer id) {

        RawMaterial existingRawMaterial = rawMaterialService.getRawMaterialById(id);

        if (existingRawMaterial == null) {
            return ResponseEntity.notFound().build();
        }

        rawMaterialService.deleteRawMaterial(id);

        return ResponseEntity.noContent().build();
    }
}