package com.skcp.service;

import com.skcp.entity.RawMaterialStock;
import com.skcp.repository.RawMaterialStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialStockService {

    // Dependency Injection
    private final RawMaterialStockRepository rawMaterialStockRepository;

    // Constructor Injection
    public RawMaterialStockService(RawMaterialStockRepository rawMaterialStockRepository) {
        this.rawMaterialStockRepository = rawMaterialStockRepository;
    }

    // Get all Raw Material Stock records
    public List<RawMaterialStock> getAllRawMaterialStock() {
        return rawMaterialStockRepository.findAll();
    }

    // Save Raw Material Stock
    public RawMaterialStock saveRawMaterialStock(RawMaterialStock rawMaterialStock) {
        return rawMaterialStockRepository.save(rawMaterialStock);
    }

    // Find Raw Material Stock by ID
    public RawMaterialStock getRawMaterialStockById(Integer id) {
        return rawMaterialStockRepository.findById(id).orElse(null);
    }

    // Delete Raw Material Stock
    public void deleteRawMaterialStock(Integer id) {
        rawMaterialStockRepository.deleteById(id);
    }
}