package com.skcp.service;

import com.skcp.entity.Orders;
import com.skcp.repository.OrdersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdersService {

    // Dependency Injection
    private final OrdersRepository ordersRepository;

    // Constructor Injection
    public OrdersService(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }

    // Get all Orders
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    // Save Order
    public Orders saveOrders(Orders orders) {
        return ordersRepository.save(orders);
    }

    // Find Order by ID
    public Orders getOrdersById(Integer id) {
        return ordersRepository.findById(id).orElse(null);
    }

    // Delete Order
    public void deleteOrders(Integer id) {
        ordersRepository.deleteById(id);
    }
}