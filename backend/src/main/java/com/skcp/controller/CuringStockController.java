package com.skcp.controller;

import com.skcp.dto.request.curingstock.CuringStockCreateRequest;
import com.skcp.dto.request.curingstock.CuringStockUpdateRequest;
import com.skcp.common.ApiResponse;
import com.skcp.dto.response.curingstock.CuringStockResponse;
import com.skcp.dto.response.curingstock.CuringStockSummaryResponse;
import com.skcp.service.CuringStockService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curing-stock")
public class CuringStockController {

    private final CuringStockService curingStockService;

    public CuringStockController(
            CuringStockService curingStockService) {

        this.curingStockService = curingStockService;
    }

    // ==========================================================
    // GET ALL ACTIVE CURING STOCK
    // ==========================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<CuringStockSummaryResponse>>>
    getAllCuringStock() {

        List<CuringStockSummaryResponse> curingStockList =
                curingStockService.getAllCuringStock();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Curing stock records retrieved successfully",
                        curingStockList
                )
        );
    }

    // ==========================================================
    // GET ACTIVE CURING STOCK BY ID
    // ==========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CuringStockResponse>>
    getCuringStockById(@PathVariable Integer id) {

        CuringStockResponse curingStock =
                curingStockService.getCuringStockById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Curing stock record retrieved successfully",
                        curingStock
                )
        );
    }

    // ==========================================================
    // CREATE CURING STOCK
    // ==========================================================

    @PostMapping
    public ResponseEntity<ApiResponse<CuringStockResponse>>
    createCuringStock(
            @Valid @RequestBody CuringStockCreateRequest request) {

        CuringStockResponse response =
                curingStockService.createCuringStock(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Curing stock created successfully",
                                response
                        )
                );
    }

    // ==========================================================
    // UPDATE CURING STOCK
    // ==========================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CuringStockResponse>>
    updateCuringStock(
            @PathVariable Integer id,
            @Valid @RequestBody CuringStockUpdateRequest request) {

        CuringStockResponse response =
                curingStockService.updateCuringStock(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Curing stock updated successfully",
                        response
                )
        );
    }

    // ==========================================================
    // SOFT DELETE CURING STOCK
    // ==========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deleteCuringStock(@PathVariable Integer id) {

        curingStockService.deleteCuringStock(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Curing stock deleted successfully",
                        null
                )
        );
    }
}