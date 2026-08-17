package com.skcp.mapper;

import com.skcp.dto.request.product.ProductCreateRequest;
import com.skcp.dto.request.product.ProductUpdateRequest;
import com.skcp.dto.response.product.ProductResponse;
import com.skcp.dto.response.product.ProductSummaryResponse;
import com.skcp.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public Product toEntity(ProductCreateRequest request) {

        Product product = new Product();

        product.setProductCode(request.getProductCode());
        product.setProductName(request.getProductName());
        product.setSize(request.getSize());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setUnit(request.getUnit());
        product.setDescription(request.getDescription());

        return product;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public void updateEntity(
            ProductUpdateRequest request,
            Product product) {

        product.setProductCode(request.getProductCode());
        product.setProductName(request.getProductName());
        product.setSize(request.getSize());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setUnit(request.getUnit());
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus());
    }


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public ProductResponse toResponse(Product product) {

        ProductResponse response = new ProductResponse();

        response.setProductId(product.getProductId());
        response.setProductCode(product.getProductCode());
        response.setProductName(product.getProductName());
        response.setSize(product.getSize());
        response.setLength(product.getLength());
        response.setWidth(product.getWidth());
        response.setHeight(product.getHeight());
        response.setUnit(product.getUnit());
        response.setDescription(product.getDescription());
        response.setStatus(product.getStatus());
        response.setCreatedAt(product.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public ProductSummaryResponse toSummaryResponse(Product product) {

        ProductSummaryResponse response = new ProductSummaryResponse();

        response.setProductId(product.getProductId());
        response.setProductCode(product.getProductCode());
        response.setProductName(product.getProductName());
        response.setSize(product.getSize());
        response.setStatus(product.getStatus());

        return response;
    }
}