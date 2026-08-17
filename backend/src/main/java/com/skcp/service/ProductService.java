package com.skcp.service;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.dto.request.product.ProductCreateRequest;
import com.skcp.dto.request.product.ProductUpdateRequest;
import com.skcp.dto.response.product.ProductResponse;
import com.skcp.dto.response.product.ProductSummaryResponse;
import com.skcp.entity.Product;
import com.skcp.mapper.ProductMapper;
import com.skcp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public ProductService(
            ProductRepository productRepository,
            ProductMapper     productMapper) 
            {

            this.productRepository = productRepository;
            this.productMapper = productMapper;
             }


    // ============================================================
    // CREATE PRODUCT
    // ============================================================

    public ProductResponse createProduct(
            ProductCreateRequest request) 
            {

            Product product = productMapper.toEntity(request);

            Product savedProduct = productRepository.save(product);

            return productMapper.toResponse(savedProduct);
            }


    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================

    public List<ProductSummaryResponse> getAllProducts() 
    {

        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(productMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================

    public ProductResponse getProductById(
            Integer productId) 
            {

                Product product = productRepository.findById(productId)
                .orElseThrow(() ->
        new ResourceNotFoundException(
                "Product not found with id: "
                        + productId));

            return productMapper.toResponse(product);
            }


    // ============================================================
    // UPDATE PRODUCT
    // ============================================================

    public ProductResponse updateProduct(
            Integer productId,
            ProductUpdateRequest request) 
            {

                Product product = productRepository.findById(productId)
                        .orElseThrow(() ->
        new ResourceNotFoundException(
                "Product not found with id: "
                        + productId));

                productMapper.updateEntity(request, product);

                Product updatedProduct =
                        productRepository.save(product);

                return productMapper.toResponse(updatedProduct);
           }


        // ============================================================
        // DELETE / INACTIVATE PRODUCT (SOFT DELETE)
        // ============================================================

        public void deleteProduct(Integer productId) {

            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
        new ResourceNotFoundException(
                "Product not found with id: "
                        + productId));

            product.setStatus("INACTIVE");

            productRepository.save(product);
            }
}




/*
                 PRODUCT MASTER
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      CREATE         UPDATE         DELETE
        │              │              │
        ▼              ▼              ▼
     ACTIVE         ACTIVE        INACTIVE
        │              │              │
        └──────────────┼──────────────┘
                       │
                  PostgreSQL
                       │
             Row remains forever

*/




/*
package com.skcp.service;

import com.skcp.entity.Product;
import com.skcp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    // Dependency Injection
    private final ProductRepository productRepository;

    // Constructor Injection
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Save product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Find product by ID
    public Product getProductById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    // Delete product
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}

*/