package com.skcp.service;

import com.skcp.dto.request.rawmaterial.RawMaterialCreateRequest;
import com.skcp.dto.request.rawmaterial.RawMaterialUpdateRequest;
import com.skcp.dto.response.rawmaterial.RawMaterialResponse;
import com.skcp.dto.response.rawmaterial.RawMaterialSummaryResponse;
import com.skcp.entity.RawMaterial;
import com.skcp.enums.RawMaterialUnit;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.RawMaterialMapper;
import com.skcp.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;
    private final RawMaterialMapper rawMaterialMapper;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public RawMaterialService(
            RawMaterialRepository rawMaterialRepository,
            RawMaterialMapper rawMaterialMapper) {

        this.rawMaterialRepository = rawMaterialRepository;
        this.rawMaterialMapper = rawMaterialMapper;
    }


    // ============================================================
    // CREATE RAW MATERIAL
    // ============================================================

    public RawMaterialResponse createRawMaterial(
            RawMaterialCreateRequest request) {

        // --------------------------------------------------------
        // BUSINESS VALIDATION
        // --------------------------------------------------------

        validateUnit(
                request.getMaterialName(),
                request.getUnit()
        );


        // --------------------------------------------------------
        // MAP REQUEST → ENTITY
        // --------------------------------------------------------

        RawMaterial rawMaterial =
                rawMaterialMapper.toEntity(request);


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        RawMaterial savedRawMaterial =
                rawMaterialRepository.save(rawMaterial);


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return rawMaterialMapper.toResponse(
                savedRawMaterial);
    }


    // ============================================================
    // GET ALL RAW MATERIALS
    // ============================================================

    public List<RawMaterialSummaryResponse> getAllRawMaterials() {

        List<RawMaterial> rawMaterials =
                rawMaterialRepository.findAll();

        return rawMaterials.stream()
                .map(rawMaterialMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET RAW MATERIAL BY ID
    // ============================================================

    public RawMaterialResponse getRawMaterialById(
            Integer rawMaterialId) {

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(rawMaterialId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material not found with id: "
                                                + rawMaterialId
                                )
                        );

        return rawMaterialMapper.toResponse(rawMaterial);
    }


    // ============================================================
    // UPDATE RAW MATERIAL
    // ============================================================

    public RawMaterialResponse updateRawMaterial(
            Integer rawMaterialId,
            RawMaterialUpdateRequest request) {

        // --------------------------------------------------------
        // FIND EXISTING RAW MATERIAL
        // --------------------------------------------------------

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(rawMaterialId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material not found with id: "
                                                + rawMaterialId
                                )
                        );


        // --------------------------------------------------------
        // BUSINESS VALIDATION
        // --------------------------------------------------------

        validateUnit(
                request.getMaterialName(),
                request.getUnit()
        );


        // --------------------------------------------------------
        // UPDATE ENTITY
        // --------------------------------------------------------

        rawMaterialMapper.updateEntity(
                request,
                rawMaterial
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        RawMaterial updatedRawMaterial =
                rawMaterialRepository.save(rawMaterial);


        // --------------------------------------------------------
        // ENTITY → RESPONSE
        // --------------------------------------------------------

        return rawMaterialMapper.toResponse(
                updatedRawMaterial);
    }


    // ============================================================
    // DELETE / INACTIVATE RAW MATERIAL
    // ============================================================

    public void deleteRawMaterial(Integer id) {

        RawMaterial rawMaterial =
                rawMaterialRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Raw material not found with id: "
                                                + id
                                )
                        );

        /*
         * Raw material master records are historical
         * business data.
         *
         * Therefore we use soft delete.
         */

        rawMaterial.setStatus("INACTIVE");

        rawMaterialRepository.save(rawMaterial);
    }


    // ============================================================
    // RAW MATERIAL UNIT BUSINESS VALIDATION
    // ============================================================

    /*
     * SKCP uses strict unit mapping.
     *
     * Cement   → BAG
     * Sand     → CUBIC_METER
     * Fly Ash  → TON
     * Jelly    → CUBIC_METER
     * Water    → LITRE
     * Hardner  → LITRE
     *
     * Material name comparison is case-insensitive and
     * ignores leading/trailing spaces.
     */

    private void validateUnit(
            String materialName,
            RawMaterialUnit unit) {

        if (materialName == null || materialName.isBlank()) {
            return;
        }

        String normalizedMaterialName =
                materialName.trim().toLowerCase();


        // --------------------------------------------------------
        // UNIT REQUIRED
        // --------------------------------------------------------

        if (unit == null) {

            throw new IllegalArgumentException(
                    "Unit is required for raw material: "
                            + materialName
            );
        }


        // --------------------------------------------------------
        // CEMENT → BAG
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("cement")
                && unit != RawMaterialUnit.BAG) {

            throw new IllegalArgumentException(
                    "Cement must use unit BAG"
            );
        }


        // --------------------------------------------------------
        // SAND → CUBIC_METER
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("sand")
                && unit != RawMaterialUnit.CUBIC_METER) {

            throw new IllegalArgumentException(
                    "Sand must use unit CUBIC_METER"
            );
        }


        // --------------------------------------------------------
        // FLY ASH → TON
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("fly ash")
                && unit != RawMaterialUnit.TON) {

            throw new IllegalArgumentException(
                    "Fly Ash must use unit TON"
            );
        }


        // --------------------------------------------------------
        // JELLY → CUBIC_METER
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("jelly")
                && unit != RawMaterialUnit.CUBIC_METER) {

            throw new IllegalArgumentException(
                    "Jelly must use unit CUBIC_METER"
            );
        }


        // --------------------------------------------------------
        // WATER → LITRE
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("water")
                && unit != RawMaterialUnit.LITRE) {

            throw new IllegalArgumentException(
                    "Water must use unit LITRE"
            );
        }


        // --------------------------------------------------------
        // HARDNER → LITRE
        // --------------------------------------------------------

        if (normalizedMaterialName.equals("hardner")
                && unit != RawMaterialUnit.LITRE) {

            throw new IllegalArgumentException(
                    "Hardner must use unit LITRE"
            );
        }
    }
}


/*
Service responsibility:
The flow is now:
Controller
    ↓
Service
    ↓
Mapper
    ↓
Repository
    ↓
Database

The Service handles the business operation, 
while:
Mapper → converts Entity ↔ DTO
Repository → communicates with PostgreSQL
Controller → handles HTTP requests/responses




*/


/*

package com.skcp.service;

import com.skcp.entity.RawMaterial;
import com.skcp.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialService {

    // Dependency Injection
    private final RawMaterialRepository rawMaterialRepository;

    // Constructor Injection
    public RawMaterialService(RawMaterialRepository rawMaterialRepository) {
        this.rawMaterialRepository = rawMaterialRepository;
    }

    // Get all raw materials
    public List<RawMaterial> getAllRawMaterials() {
        return rawMaterialRepository.findAll();
    }

    // Save raw material
    public RawMaterial saveRawMaterial(RawMaterial rawMaterial) {
        return rawMaterialRepository.save(rawMaterial);
    }

    // Find raw material by ID
    public RawMaterial getRawMaterialById(Integer id) {
        return rawMaterialRepository.findById(id).orElse(null);
    }

    // Delete raw material
    public void deleteRawMaterial(Integer id) {
        rawMaterialRepository.deleteById(id);
    }
}



*/
