package com.skcp.controller;

import com.skcp.entity.Product;
import com.skcp.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    // Dependency Injection
    private final ProductService productService;

    // Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        List<Product> products = productService.getAllProducts();

        return ResponseEntity.ok(products);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {

        Product product = productService.getProductById(id);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    // Create product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {

        Product savedProduct = productService.saveProduct(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestBody Product product) {

        Product existingProduct = productService.getProductById(id);

        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        // Preserve immutable fields
        product.setProductId(id);
        product.setCreatedAt(existingProduct.getCreatedAt());

        Product updatedProduct = productService.saveProduct(product);

        return ResponseEntity.ok(updatedProduct);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {

        Product existingProduct = productService.getProductById(id);

        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();
    }
}