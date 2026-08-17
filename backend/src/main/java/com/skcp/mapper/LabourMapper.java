package com.skcp.mapper;

import com.skcp.dto.request.labour.LabourCreateRequest;
import com.skcp.dto.request.labour.LabourUpdateRequest;
import com.skcp.dto.response.labour.LabourResponse;
import com.skcp.dto.response.labour.LabourSummaryResponse;
import com.skcp.entity.Labour;

public class LabourMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Labour toEntity(
            LabourCreateRequest request
    )
    {
        Labour labour = new Labour();

        labour.setLabourName(request.getLabourName());
        labour.setPhone(request.getPhone());
        labour.setAddress(request.getAddress());
        labour.setJoiningDate(request.getJoiningDate());
        labour.setSkillType(request.getSkillType());
        labour.setDailyRate(request.getDailyRate());

        return labour;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Labour labour,
            LabourUpdateRequest request
    )
    {
        labour.setLabourName(request.getLabourName());
        labour.setPhone(request.getPhone());
        labour.setAddress(request.getAddress());
        labour.setJoiningDate(request.getJoiningDate());
        labour.setSkillType(request.getSkillType());
        labour.setDailyRate(request.getDailyRate());

        /*
         * Notice that labourId, status and createdAt
         * are NOT updated here.
         *
         * These fields are controlled by the backend.
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE DTO
    // ============================================================

    public static LabourResponse toResponse(
            Labour labour
    )
    {
        LabourResponse response = new LabourResponse();

        response.setLabourId(labour.getLabourId());
        response.setLabourName(labour.getLabourName());
        response.setPhone(labour.getPhone());
        response.setAddress(labour.getAddress());
        response.setJoiningDate(labour.getJoiningDate());
        response.setSkillType(labour.getSkillType());
        response.setDailyRate(labour.getDailyRate());
        response.setStatus(labour.getStatus());
        response.setCreatedAt(labour.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE DTO
    // ============================================================

    public static LabourSummaryResponse toSummaryResponse(
            Labour labour
    )
    {
        LabourSummaryResponse response =
                new LabourSummaryResponse();

        response.setLabourId(labour.getLabourId());
        response.setLabourName(labour.getLabourName());
        response.setPhone(labour.getPhone());
        response.setSkillType(labour.getSkillType());
        response.setStatus(labour.getStatus());

        return response;
    }
}