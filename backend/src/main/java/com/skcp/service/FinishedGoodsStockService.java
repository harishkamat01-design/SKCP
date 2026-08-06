package com.skcp.service;

import com.skcp.entity.FinishedGoodsStock;
import com.skcp.repository.FinishedGoodsStockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FinishedGoodsStockService {

    // Dependency Injection
    private final FinishedGoodsStockRepository finishedGoodsStockRepository;

    // Constructor Injection
    public FinishedGoodsStockService(FinishedGoodsStockRepository finishedGoodsStockRepository) {
        this.finishedGoodsStockRepository = finishedGoodsStockRepository;
    }

    // Get All Finished Goods Stock
    public List<FinishedGoodsStock> getAllFinishedGoodsStock() {
        return finishedGoodsStockRepository.findAll();
    }

    // Save Finished Goods Stock
    public FinishedGoodsStock saveFinishedGoodsStock(FinishedGoodsStock finishedGoodsStock) {

        // Maintain audit field
        finishedGoodsStock.setLastUpdatedDate(LocalDate.now());

        return finishedGoodsStockRepository.save(finishedGoodsStock);
    }

    // Find by ID
    public FinishedGoodsStock getFinishedGoodsStockById(Integer id) {
        return finishedGoodsStockRepository.findById(id).orElse(null);
    }

    // Update Finished Goods Stock
    public FinishedGoodsStock updateFinishedGoodsStock(Integer id,
                                                       FinishedGoodsStock updatedStock) {

        FinishedGoodsStock existingStock =
                finishedGoodsStockRepository.findById(id).orElse(null);

        if (existingStock != null) {

            existingStock.setProduct(updatedStock.getProduct());
            existingStock.setCurrentStockLevel(updatedStock.getCurrentStockLevel());
            existingStock.setMinimumStockLevel(updatedStock.getMinimumStockLevel());
            existingStock.setStatus(updatedStock.getStatus());
            existingStock.setNotes(updatedStock.getNotes());

            // Always update inventory timestamp
            existingStock.setLastUpdatedDate(LocalDate.now());

            return finishedGoodsStockRepository.save(existingStock);
        }

        return null;
    }

    // Delete
    public void deleteFinishedGoodsStock(Integer id) {
        finishedGoodsStockRepository.deleteById(id);
    }

}