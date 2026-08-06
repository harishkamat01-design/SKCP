package com.skcp.service;

import com.skcp.entity.CuringStock;
import com.skcp.repository.CuringStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuringStockService {

    // Dependency Injection
    private final CuringStockRepository curingStockRepository;

    // Constructor Injection
    public CuringStockService(CuringStockRepository curingStockRepository) {
        this.curingStockRepository = curingStockRepository;
    }

    // Get all curing stock records
    public List<CuringStock> getAllCuringStock() {
        return curingStockRepository.findAll();
    }

    // Save curing stock
    public CuringStock saveCuringStock(CuringStock curingStock) {

        // Business Rule:
        // Expected Ready Date = Production Date + 3 Days
        if (curingStock.getProductionDate() != null) {
            curingStock.setExpectedReadyDate(
                    curingStock.getProductionDate().plusDays(3)
            );
        }

        return curingStockRepository.save(curingStock);
    }

    // Find curing stock by ID
    public CuringStock getCuringStockById(Integer id) {
        return curingStockRepository.findById(id).orElse(null);
    }

    // Delete curing stock
    public void deleteCuringStock(Integer id) {
        curingStockRepository.deleteById(id);
    }
}