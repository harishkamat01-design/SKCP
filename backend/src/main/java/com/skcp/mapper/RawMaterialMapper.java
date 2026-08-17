package com.skcp.mapper;

import com.skcp.dto.request.rawmaterial.RawMaterialCreateRequest;
import com.skcp.dto.request.rawmaterial.RawMaterialUpdateRequest;
import com.skcp.dto.response.rawmaterial.RawMaterialResponse;
import com.skcp.dto.response.rawmaterial.RawMaterialSummaryResponse;
import com.skcp.entity.RawMaterial;
import org.springframework.stereotype.Component;

@Component
public class RawMaterialMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public RawMaterial toEntity(
            RawMaterialCreateRequest request) {

        RawMaterial rawMaterial = new RawMaterial();

        rawMaterial.setMaterialName(
                request.getMaterialName());

        rawMaterial.setMaterialCategory(
                request.getMaterialCategory());

        rawMaterial.setUnit(
                request.getUnit());

        rawMaterial.setDescription(
                request.getDescription());

        // Status is backend controlled during creation.
        rawMaterial.setStatus("ACTIVE");

        return rawMaterial;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public void updateEntity(
            RawMaterialUpdateRequest request,
            RawMaterial rawMaterial) {

        rawMaterial.setMaterialName(
                request.getMaterialName());

        rawMaterial.setMaterialCategory(
                request.getMaterialCategory());

        rawMaterial.setUnit(
                request.getUnit());

        rawMaterial.setDescription(
                request.getDescription());

        rawMaterial.setStatus(
                request.getStatus());
    }


    // ============================================================
    // ENTITY → RESPONSE
    // ============================================================

    public RawMaterialResponse toResponse(
            RawMaterial rawMaterial) {

        RawMaterialResponse response =
                new RawMaterialResponse();

        response.setRawMaterialId(
                rawMaterial.getRawMaterialId());

        response.setMaterialName(
                rawMaterial.getMaterialName());

        response.setMaterialCategory(
                rawMaterial.getMaterialCategory());

        response.setUnit(
                rawMaterial.getUnit());

        response.setDescription(
                rawMaterial.getDescription());

        response.setStatus(
                rawMaterial.getStatus());

        response.setCreatedAt(
                rawMaterial.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public RawMaterialSummaryResponse toSummaryResponse(
            RawMaterial rawMaterial) {

        RawMaterialSummaryResponse response =
                new RawMaterialSummaryResponse();

        response.setRawMaterialId(
                rawMaterial.getRawMaterialId());

        response.setMaterialName(
                rawMaterial.getMaterialName());

        response.setMaterialCategory(
                rawMaterial.getMaterialCategory());

        response.setUnit(
                rawMaterial.getUnit());

        response.setStatus(
                rawMaterial.getStatus());

        return response;
    }
}