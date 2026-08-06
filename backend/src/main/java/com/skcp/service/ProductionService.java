package com.skcp.service;

import com.skcp.entity.Production;
import com.skcp.repository.ProductionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductionService {

    // Dependency Injection
    private final ProductionRepository productionRepository;

    // Constructor Injection
    public ProductionService(ProductionRepository productionRepository) {
        this.productionRepository = productionRepository;
    }

    // Get all production records
    public List<Production> getAllProductions() {
        return productionRepository.findAll();
    }

    // Save production
    public Production saveProduction(Production production) {
        return productionRepository.save(production);
    }

    // Find production by ID
    public Production getProductionById(Integer id) {
        return productionRepository.findById(id).orElse(null);
    }

    // Delete production
    public void deleteProduction(Integer id) {
        productionRepository.deleteById(id);
    }
}