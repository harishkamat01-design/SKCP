package com.skcp.controller;

import com.skcp.entity.CuringStock;
import com.skcp.service.CuringStockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curing-stock")
@CrossOrigin(origins = "*")
public class CuringStockController {

    // Dependency Injection
    private final CuringStockService curingStockService;

    // Constructor Injection
    public CuringStockController(CuringStockService curingStockService) {
        this.curingStockService = curingStockService;
    }

    // ==========================================================
    // GET ALL CURING STOCK
    // ==========================================================
    @GetMapping
    public ResponseEntity<List<CuringStock>> getAllCuringStock() {
        List<CuringStock> curingStockList = curingStockService.getAllCuringStock();
        return ResponseEntity.ok(curingStockList);
    }

    // ==========================================================
    // GET CURING STOCK BY ID
    // ==========================================================
    @GetMapping("/{id}")
    public ResponseEntity<CuringStock> getCuringStockById(@PathVariable Integer id) {

        CuringStock curingStock = curingStockService.getCuringStockById(id);

        if (curingStock == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(curingStock);
    }

    // ==========================================================
    // CREATE CURING STOCK
    // ==========================================================
    @PostMapping
    public ResponseEntity<CuringStock> createCuringStock(@RequestBody CuringStock curingStock) {

        CuringStock savedCuringStock = curingStockService.saveCuringStock(curingStock);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCuringStock);
    }

    // ==========================================================
    // UPDATE CURING STOCK
    // ==========================================================
    @PutMapping("/{id}")
    public ResponseEntity<CuringStock> updateCuringStock(
            @PathVariable Integer id,
            @RequestBody CuringStock curingStock) {

        CuringStock existingCuringStock = curingStockService.getCuringStockById(id);

        if (existingCuringStock == null) {
            return ResponseEntity.notFound().build();
        }

        existingCuringStock.setProduction(curingStock.getProduction());
        existingCuringStock.setProduct(curingStock.getProduct());
        existingCuringStock.setQuantity(curingStock.getQuantity());
        existingCuringStock.setProductionDate(curingStock.getProductionDate());
        existingCuringStock.setStatus(curingStock.getStatus());
        existingCuringStock.setRemarks(curingStock.getRemarks());

        // expectedReadyDate is automatically recalculated in the Service

        CuringStock updatedCuringStock =
                curingStockService.saveCuringStock(existingCuringStock);

        return ResponseEntity.ok(updatedCuringStock);
    }

    // ==========================================================
    // DELETE CURING STOCK
    // ==========================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuringStock(@PathVariable Integer id) {

        CuringStock existingCuringStock = curingStockService.getCuringStockById(id);

        if (existingCuringStock == null) {
            return ResponseEntity.notFound().build();
        }

        curingStockService.deleteCuringStock(id);

        return ResponseEntity.noContent().build();
    }
}