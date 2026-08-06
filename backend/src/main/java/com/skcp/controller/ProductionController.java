package com.skcp.controller;

import com.skcp.entity.Production;
import com.skcp.service.ProductionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productions")
public class ProductionController {

    // Dependency Injection
    private final ProductionService productionService;

    // Constructor Injection
    public ProductionController(ProductionService productionService) {
        this.productionService = productionService;
    }

    // Get all production records
    @GetMapping
    public ResponseEntity<List<Production>> getAllProductions() {

        List<Production> productionList = productionService.getAllProductions();

        return ResponseEntity.ok(productionList);
    }

    // Get production by ID
    @GetMapping("/{id}")
    public ResponseEntity<Production> getProductionById(@PathVariable Integer id) {

        Production production = productionService.getProductionById(id);

        if (production == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(production);
    }

    // Create production
    @PostMapping
    public ResponseEntity<Production> createProduction(@RequestBody Production production) {

        Production savedProduction = productionService.saveProduction(production);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduction);
    }

    // Update production
    @PutMapping("/{id}")
    public ResponseEntity<Production> updateProduction(
            @PathVariable Integer id,
            @RequestBody Production production) {

        Production existingProduction = productionService.getProductionById(id);

        if (existingProduction == null) {
            return ResponseEntity.notFound().build();
        }

        // Update editable fields
        existingProduction.setProductionDate(production.getProductionDate());
        existingProduction.setProduct(production.getProduct());
        existingProduction.setQuantityProduced(production.getQuantityProduced());
        existingProduction.setMorningCementBags(production.getMorningCementBags());
        existingProduction.setAfternoonCementBags(production.getAfternoonCementBags());
        existingProduction.setNotes(production.getNotes());
        existingProduction.setStatus(production.getStatus());
        existingProduction.setAsset(production.getAsset());

        // PostgreSQL automatically calculates total_cement_bags

        Production updatedProduction =
                productionService.saveProduction(existingProduction);

        return ResponseEntity.ok(updatedProduction);
    }

    // Delete production
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduction(@PathVariable Integer id) {

        Production existingProduction = productionService.getProductionById(id);

        if (existingProduction == null) {
            return ResponseEntity.notFound().build();
        }

        productionService.deleteProduction(id);

        return ResponseEntity.noContent().build();
    }
}