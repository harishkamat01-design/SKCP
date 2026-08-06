package com.skcp.controller;

import com.skcp.entity.FinishedGoodsStock;
import com.skcp.service.FinishedGoodsStockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finished-goods-stock")
public class FinishedGoodsStockController {

    // Dependency Injection
    private final FinishedGoodsStockService finishedGoodsStockService;

    // Constructor Injection
    public FinishedGoodsStockController(FinishedGoodsStockService finishedGoodsStockService) {
        this.finishedGoodsStockService = finishedGoodsStockService;
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<FinishedGoodsStock>> getAllFinishedGoodsStock() {

        List<FinishedGoodsStock> stockList =
                finishedGoodsStockService.getAllFinishedGoodsStock();

        return ResponseEntity.ok(stockList);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<FinishedGoodsStock> getFinishedGoodsStockById(
            @PathVariable Integer id) {

        FinishedGoodsStock stock =
                finishedGoodsStockService.getFinishedGoodsStockById(id);

        if (stock != null) {
            return ResponseEntity.ok(stock);
        }

        return ResponseEntity.notFound().build();
    }

    // CREATE
    @PostMapping
    public ResponseEntity<FinishedGoodsStock> createFinishedGoodsStock(
            @RequestBody FinishedGoodsStock finishedGoodsStock) {

        FinishedGoodsStock savedStock =
                finishedGoodsStockService.saveFinishedGoodsStock(finishedGoodsStock);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedStock);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<FinishedGoodsStock> updateFinishedGoodsStock(
            @PathVariable Integer id,
            @RequestBody FinishedGoodsStock finishedGoodsStock) {

        FinishedGoodsStock updatedStock =
                finishedGoodsStockService.updateFinishedGoodsStock(id, finishedGoodsStock);

        if (updatedStock != null) {
            return ResponseEntity.ok(updatedStock);
        }

        return ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinishedGoodsStock(
            @PathVariable Integer id) {

        FinishedGoodsStock stock =
                finishedGoodsStockService.getFinishedGoodsStockById(id);

        if (stock != null) {

            finishedGoodsStockService.deleteFinishedGoodsStock(id);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

}