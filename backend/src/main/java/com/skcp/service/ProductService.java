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