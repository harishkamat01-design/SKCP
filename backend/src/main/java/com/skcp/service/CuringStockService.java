package com.skcp.service;

import com.skcp.exception.ResourceNotFoundException;
import com.skcp.dto.request.curringstock.CuringStockRequest;
import com.skcp.dto.response.curringstock.CuringStockResponse;
import com.skcp.entity.CuringStock;
import com.skcp.entity.Product;
import com.skcp.entity.Production;
import com.skcp.enums.RecordStatus;
import com.skcp.mapper.CuringStockMapper;
import com.skcp.repository.CuringStockRepository;
import com.skcp.repository.ProductRepository;
import com.skcp.repository.ProductionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuringStockService {

    private final CuringStockRepository curingStockRepository;
    private final ProductionRepository productionRepository;
    private final ProductRepository productRepository;
    private final CuringStockMapper curingStockMapper;

    public CuringStockService(
            CuringStockRepository curingStockRepository,
            ProductionRepository productionRepository,
            ProductRepository productRepository,
            CuringStockMapper curingStockMapper) {

        this.curingStockRepository = curingStockRepository;
        this.productionRepository = productionRepository;
        this.productRepository = productRepository;
        this.curingStockMapper = curingStockMapper;
    }

    public List<CuringStockResponse> getAllCuringStock() {

        return curingStockRepository
                .findByRecordStatus(RecordStatus.ACTIVE.name())
                .stream()
                .map(curingStockMapper::toResponse)
                .toList();
    }

    public CuringStockResponse getCuringStockById(Integer id) {

        CuringStock curingStock =
                curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
        new ResourceNotFoundException(
                "Curing stock not found with id: " + id
        )
);

        return curingStockMapper.toResponse(curingStock);
    }

    public CuringStockResponse createCuringStock(
            CuringStockRequest request) {

        Production production =
                productionRepository.findById(request.getProductionId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Production not found with id: "
                                                + request.getProductionId()
                                ));

        Product product =
                productRepository.findById(request.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                ));

        CuringStock curingStock = new CuringStock();

        curingStock.setProduction(production);
        curingStock.setProduct(product);
        curingStock.setQuantity(request.getQuantity());
        curingStock.setProductionDate(request.getProductionDate());
        curingStock.setRemarks(request.getRemarks());

        // Server-controlled lifecycle state
        curingStock.setStatus("CURING");

        // Server-controlled record state
        curingStock.setRecordStatus(
                RecordStatus.ACTIVE.name()
        );

        // Business rule
        curingStock.setExpectedReadyDate(
                request.getProductionDate().plusDays(3)
        );

        CuringStock saved =
                curingStockRepository.save(curingStock);

        return curingStockMapper.toResponse(saved);
    }

    public CuringStockResponse updateCuringStock(
            Integer id,
            CuringStockRequest request) {

        CuringStock existing =
                curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
        new ResourceNotFoundException(
                "Curing stock not found with id: " + id
        )
);

        Production production =
                productionRepository.findById(request.getProductionId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Production not found with id: "
                                                + request.getProductionId()
                                ));

        Product product =
                productRepository.findById(request.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: "
                                                + request.getProductId()
                                ));

        existing.setProduction(production);
        existing.setProduct(product);
        existing.setQuantity(request.getQuantity());
        existing.setProductionDate(request.getProductionDate());
        existing.setRemarks(request.getRemarks());

        // Recalculate derived field
        existing.setExpectedReadyDate(
                request.getProductionDate().plusDays(3)
        );

        // DO NOT take status from request.
        // Existing lifecycle status remains unchanged.

        CuringStock updated =
                curingStockRepository.save(existing);

        return curingStockMapper.toResponse(updated);
    }

    public void deleteCuringStock(Integer id) {

        CuringStock existing =
                curingStockRepository
                        .findByCuringStockIdAndRecordStatus(
                                id,
                                RecordStatus.ACTIVE.name()
                        )
                        .orElseThrow(() ->
        new ResourceNotFoundException(
                "Curing stock not found with id: " + id
        )
);

        existing.setRecordStatus(
                RecordStatus.INACTIVE.name()
        );

        curingStockRepository.save(existing);
    }
}