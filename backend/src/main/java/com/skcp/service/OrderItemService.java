package com.skcp.service;

import com.skcp.entity.OrderItem;
import com.skcp.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    // Dependency Injection
    private final OrderItemRepository orderItemRepository;

    // Constructor Injection
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    // Get All Order Items
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Save Order Item
    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Find Order Item by ID
    public OrderItem getOrderItemById(Integer id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    // Delete Order Item
    public void deleteOrderItem(Integer id) {
        orderItemRepository.deleteById(id);
    }
}