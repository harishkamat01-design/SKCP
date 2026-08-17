package com.skcp.service;

import com.skcp.dto.request.labour.LabourCreateRequest;
import com.skcp.dto.request.labour.LabourUpdateRequest;
import com.skcp.dto.response.labour.LabourResponse;
import com.skcp.dto.response.labour.LabourSummaryResponse;
import com.skcp.entity.Labour;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.LabourMapper;
import com.skcp.repository.LabourRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabourService
{

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final LabourRepository labourRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public LabourService(LabourRepository labourRepository)
    {
        this.labourRepository = labourRepository;
    }


    // ============================================================
    // GET ALL LABOURS
    // ============================================================

    public List<LabourSummaryResponse> getAllLabours()
    {
        return labourRepository.findAll()
                .stream()
                .map(LabourMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET LABOUR BY ID
    // ============================================================

    public LabourResponse getLabourById(Integer id)
    {
        Labour labour = labourRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Labour not found with id: " + id
                        )
                );

        return LabourMapper.toResponse(labour);
    }


    // ============================================================
    // CREATE LABOUR
    // ============================================================

    public LabourResponse createLabour(
            LabourCreateRequest request
    )
    {
        Labour labour = LabourMapper.toEntity(request);

        // Backend-controlled field
        labour.setStatus("ACTIVE");

        Labour savedLabour =
                labourRepository.save(labour);

        return LabourMapper.toResponse(savedLabour);
    }


    // ============================================================
    // UPDATE LABOUR
    // ============================================================

    public LabourResponse updateLabour(
            Integer id,
            LabourUpdateRequest request
    )
    {
        Labour existingLabour =
                labourRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Labour not found with id: " + id
                                )
                        );

        LabourMapper.updateEntity(
                existingLabour,
                request
        );

        /*
         * Notice that LabourMapper.updateEntity()
         * should NOT update:
         *
         * - labourId
         * - status
         * - createdAt
         *
         * These fields remain backend-controlled.
         */

        Labour updatedLabour =
                labourRepository.save(existingLabour);

        return LabourMapper.toResponse(updatedLabour);
    }


    // ============================================================
    // DELETE LABOUR - SOFT DELETE
    // ============================================================

    public void deleteLabour(Integer id)
    {
        Labour labour =
                labourRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Labour not found with id: " + id
                                )
                        );

        /*
         * Do NOT physically delete the labour record.
         *
         * Labour records may be useful for:
         *
         * - historical records
         * - attendance history
         * - production analysis
         * - payroll/payment history
         * - business reporting
         */

        labour.setStatus("INACTIVE");

        labourRepository.save(labour);
    }
}






















/* 


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


*/