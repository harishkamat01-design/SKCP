package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.rawmaterialstock.RawMaterialStockCreateRequest;
import com.skcp.dto.request.rawmaterialstock.RawMaterialStockUpdateRequest;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockResponse;
import com.skcp.dto.response.rawmaterialstock.RawMaterialStockSummaryResponse;
import com.skcp.service.RawMaterialStockService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-material-stock")
public class RawMaterialStockController {


    // ============================================================
    // DEPENDENCY INJECTION
    // ============================================================

    private final RawMaterialStockService rawMaterialStockService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public RawMaterialStockController(
            RawMaterialStockService rawMaterialStockService) {

        this.rawMaterialStockService =
                rawMaterialStockService;
    }


    // ============================================================
    // GET ALL ACTIVE RAW MATERIAL STOCK
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<RawMaterialStockSummaryResponse>>
            > getAllRawMaterialStock() {

        List<RawMaterialStockSummaryResponse> stockList =
                rawMaterialStockService.getAllRawMaterialStock();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw material stock records retrieved successfully",
                        stockList
                )
        );
    }


    // ============================================================
    // GET RAW MATERIAL STOCK BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<RawMaterialStockResponse>
            > getRawMaterialStockById(
                    @PathVariable Integer id) {

        RawMaterialStockResponse stock =
                rawMaterialStockService
                        .getRawMaterialStockById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw material stock record retrieved successfully",
                        stock
                )
        );
    }


    // ============================================================
    // CREATE RAW MATERIAL STOCK
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<RawMaterialStockResponse>
            > createRawMaterialStock(
                    @Valid
                    @RequestBody RawMaterialStockCreateRequest request) {

        RawMaterialStockResponse savedStock =
                rawMaterialStockService
                        .createRawMaterialStock(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Raw material stock record created successfully",
                                savedStock
                        )
                );
    }


    // ============================================================
    // UPDATE RAW MATERIAL STOCK
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<RawMaterialStockResponse>
            > updateRawMaterialStock(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody RawMaterialStockUpdateRequest request) {

        RawMaterialStockResponse updatedStock =
                rawMaterialStockService
                        .updateRawMaterialStock(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw material stock record updated successfully",
                        updatedStock
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteRawMaterialStock(
                    @PathVariable Integer id) {

        rawMaterialStockService
                .deleteRawMaterialStock(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Raw material stock record deleted successfully",
                        null
                )
        );
    }
}