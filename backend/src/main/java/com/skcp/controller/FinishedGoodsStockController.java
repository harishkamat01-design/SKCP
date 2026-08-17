package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockCreateRequest;
import com.skcp.dto.request.finishedgoodsstock.FinishedGoodsStockUpdateRequest;
import com.skcp.dto.response.finishedgoodsstock.FinishedGoodsStockResponse;
import com.skcp.service.FinishedGoodsStockService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finished-goods-stock")
public class FinishedGoodsStockController {

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    private final FinishedGoodsStockService finishedGoodsStockService;

    public FinishedGoodsStockController(
            FinishedGoodsStockService finishedGoodsStockService) {

        this.finishedGoodsStockService = finishedGoodsStockService;
    }


    // ============================================================
    // GET ALL ACTIVE FINISHED GOODS STOCK
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<FinishedGoodsStockResponse>>
            > getAllFinishedGoodsStock() {

        List<FinishedGoodsStockResponse> stockList =
                finishedGoodsStockService.getAllFinishedGoodsStock();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Finished goods stock retrieved successfully",
                        stockList
                )
        );
    }


    // ============================================================
    // GET ACTIVE FINISHED GOODS STOCK BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<FinishedGoodsStockResponse>
            > getFinishedGoodsStockById(
                    @PathVariable Integer id) {

        FinishedGoodsStockResponse stock =
                finishedGoodsStockService.getFinishedGoodsStockById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Finished goods stock retrieved successfully",
                        stock
                )
        );
    }


    // ============================================================
    // CREATE FINISHED GOODS STOCK
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<FinishedGoodsStockResponse>
            > createFinishedGoodsStock(
                    @Valid
                    @RequestBody FinishedGoodsStockCreateRequest request) {

        FinishedGoodsStockResponse savedStock =
                finishedGoodsStockService.createFinishedGoodsStock(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Finished goods stock created successfully",
                                savedStock
                        )
                );
    }


    // ============================================================
    // UPDATE FINISHED GOODS STOCK
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<FinishedGoodsStockResponse>
            > updateFinishedGoodsStock(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody FinishedGoodsStockUpdateRequest request) {

        FinishedGoodsStockResponse updatedStock =
                finishedGoodsStockService.updateFinishedGoodsStock(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Finished goods stock updated successfully",
                        updatedStock
                )
        );
    }


    // ============================================================
    // DELETE / DEACTIVATE FINISHED GOODS STOCK
    // ============================================================
    //
    // Soft Delete:
    //
    // ACTIVE → INACTIVE
    //
    // Database row is preserved.
    //
    // API returns:
    //
    // 200 OK
    // {
    //     "data": null,
    //     "message": "Finished goods stock deleted successfully",
    //     "status": "SUCCESS",
    //     "timestamp": "..."
    // }
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteFinishedGoodsStock(
                    @PathVariable Integer id) {

        finishedGoodsStockService.deleteFinishedGoodsStock(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Finished goods stock deleted successfully",
                        null
                )
        );
    }
}
