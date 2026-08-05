package com.skcp.service;

import com.skcp.entity.Labour;
import com.skcp.repository.LabourRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabourService {

    // Dependency Injection
    private final LabourRepository labourRepository;

    // Constructor Injection
    public LabourService(LabourRepository labourRepository) {
        this.labourRepository = labourRepository;
    }

    // Get all labour
    public List<Labour> getAllLabours() {
        return labourRepository.findAll();
    }

    // Save labour
    public Labour saveLabour(Labour labour) {
        return labourRepository.save(labour);
    }

    // Find labour by ID
    public Labour getLabourById(Integer id) {
        return labourRepository.findById(id).orElse(null);
    }

    // Delete labour
    public void deleteLabour(Integer id) {
        labourRepository.deleteById(id);
    }
}