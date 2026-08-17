package com.skcp.controller;

import com.skcp.dto.request.curringstock.CuringStockRequest;
import com.skcp.dto.response.curringstock.CuringStockResponse;
import com.skcp.service.CuringStockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curing-stock")
@CrossOrigin(origins = "*")
public class CuringStockController {

    private final CuringStockService curingStockService;

    public CuringStockController(
            CuringStockService curingStockService) {
        this.curingStockService = curingStockService;
    }

    @GetMapping
    public ResponseEntity<List<CuringStockResponse>>
    getAllCuringStock() {

        return ResponseEntity.ok(
                curingStockService.getAllCuringStock()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuringStockResponse>
    getCuringStockById(@PathVariable Integer id) {

        return ResponseEntity.ok(
                curingStockService.getCuringStockById(id)
        );
    }

    @PostMapping
    public ResponseEntity<CuringStockResponse>
    createCuringStock(
            @Valid @RequestBody CuringStockRequest request) {

        CuringStockResponse response =
                curingStockService.createCuringStock(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuringStockResponse>
    updateCuringStock(
            @PathVariable Integer id,
            @Valid @RequestBody CuringStockRequest request) {

        CuringStockResponse response =
                curingStockService.updateCuringStock(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteCuringStock(@PathVariable Integer id) {

        curingStockService.deleteCuringStock(id);

        return ResponseEntity.noContent().build();
    }
}