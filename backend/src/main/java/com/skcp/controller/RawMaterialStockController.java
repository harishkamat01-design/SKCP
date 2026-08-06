package com.skcp.controller;

import com.skcp.entity.RawMaterialStock;
import com.skcp.service.RawMaterialStockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-material-stock")
public class RawMaterialStockController {

    // Dependency Injection
    private final RawMaterialStockService rawMaterialStockService;

    // Constructor Injection
    public RawMaterialStockController(RawMaterialStockService rawMaterialStockService) {
        this.rawMaterialStockService = rawMaterialStockService;
    }

    // ===========================
    // GET ALL
    // ===========================
    @GetMapping
    public ResponseEntity<List<RawMaterialStock>> getAllRawMaterialStock() {
        List<RawMaterialStock> stockList = rawMaterialStockService.getAllRawMaterialStock();
        return ResponseEntity.ok(stockList);
    }

    // ===========================
    // GET BY ID
    // ===========================
    @GetMapping("/{id}")
    public ResponseEntity<RawMaterialStock> getRawMaterialStockById(@PathVariable Integer id) {

        RawMaterialStock stock = rawMaterialStockService.getRawMaterialStockById(id);

        if (stock == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(stock);
    }

    // ===========================
    // CREATE
    // ===========================
    @PostMapping
    public ResponseEntity<RawMaterialStock> createRawMaterialStock(
            @RequestBody RawMaterialStock rawMaterialStock) {

        RawMaterialStock savedStock =
                rawMaterialStockService.saveRawMaterialStock(rawMaterialStock);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedStock);
    }

    // ===========================
    // UPDATE
    // ===========================
    @PutMapping("/{id}")
    public ResponseEntity<RawMaterialStock> updateRawMaterialStock(
            @PathVariable Integer id,
            @RequestBody RawMaterialStock updatedStock) {

        RawMaterialStock existingStock =
                rawMaterialStockService.getRawMaterialStockById(id);

        if (existingStock == null) {
            return ResponseEntity.notFound().build();
        }

        updatedStock.setRawMaterialStockId(id);

        RawMaterialStock savedStock =
                rawMaterialStockService.saveRawMaterialStock(updatedStock);

        return ResponseEntity.ok(savedStock);
    }

    // ===========================
    // DELETE
    // ===========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRawMaterialStock(@PathVariable Integer id) {

        RawMaterialStock existingStock =
                rawMaterialStockService.getRawMaterialStockById(id);

        if (existingStock == null) {
            return ResponseEntity.notFound().build();
        }

        rawMaterialStockService.deleteRawMaterialStock(id);

        return ResponseEntity.noContent().build();
    }
}