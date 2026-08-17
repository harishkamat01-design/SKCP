
package com.skcp.mapper;

import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
//import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.entity.Attendance;

public class AttendanceMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Attendance toEntity(
            AttendanceCreateRequest request
    )
    {
        Attendance attendance =
                new Attendance();

        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );

        attendance.setAttendanceStatus(
                request.getAttendanceStatus()
        );

        attendance.setLeaveReason(
                request.getLeaveReason()
        );

        attendance.setRemarks(
                request.getRemarks()
        );

        /*
         * Labour is resolved by Service.
         *
         * dailyRate is backend-controlled.
         *
         * dailyAmount is backend-controlled.
         *
         * status is backend-controlled.
         */

        return attendance;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            Attendance attendance,
            AttendanceUpdateRequest request
    )
    {
        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );

        attendance.setAttendanceStatus(
                request.getAttendanceStatus()
        );

        attendance.setLeaveReason(
                request.getLeaveReason()
        );

        attendance.setRemarks(
                request.getRemarks()
        );

        /*
         * Labour is resolved by Service.
         *
         * dailyRate is recalculated by Service.
         *
         * dailyAmount is recalculated by Service.
         *
         * status is NOT changed during normal update.
         */
    }


    // ============================================================
    // ENTITY → RESPONSE
    // ============================================================

    public static AttendanceResponse toResponse(
            Attendance attendance
    )
    {
        AttendanceResponse response =
                new AttendanceResponse();

        response.setAttendanceId(
                attendance.getAttendanceId()
        );

        response.setAttendanceDate(
                attendance.getAttendanceDate()
        );

        response.setAttendanceStatus(
                attendance.getAttendanceStatus()
        );

        response.setLeaveReason(
                attendance.getLeaveReason()
        );


        if (attendance.getLabour() != null)
        {
            response.setLabourId(
                    attendance.getLabour().getLabourId()
            );

            response.setLabourName(
                    attendance.getLabour().getLabourName()
            );
        }


        response.setDailyRate(
                attendance.getDailyRate()
        );

        response.setDailyAmount(
                attendance.getDailyAmount()
        );

        response.setRemarks(
                attendance.getRemarks()
        );

        response.setStatus(
                attendance.getStatus()
        );

        response.setCreatedAt(
                attendance.getCreatedAt()
        );

        return response;
    }
}











/*
package com.skcp.mapper;

import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.entity.Attendance;

public class AttendanceMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static Attendance toEntity(
            AttendanceCreateRequest request
    )
    {
        Attendance attendance = new Attendance();

        /*
         * Labour entity is NOT mapped here.
         *
         * Request contains labourId.
         *
         * Service will retrieve the actual Labour
         * entity from LabourRepository.
         */
/*
        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );

        attendance.setAttendanceStatus(
                request.getAttendanceStatus()
        );

        attendance.setLeaveReason(
                request.getLeaveReason()
        );

        attendance.setRemarks(
                request.getRemarks()
        );

        return attendance;
    }
        /*
         * dailyRate is NOT mapped.
         *
         * dailyAmount is NOT mapped.
         *
         * Both are backend-controlled.
         */




    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================
/*
    public static void updateEntity(
            Attendance attendance,
            AttendanceUpdateRequest request
    )
    {
        /*
         * Labour is NOT mapped here.
         *
         * Service retrieves Labour using labourId.
         */


/* 

        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );

        attendance.setAttendanceStatus(
                request.getAttendanceStatus()
        );

        attendance.setLeaveReason(
                request.getLeaveReason()
        );

        attendance.setRemarks(
                request.getRemarks()
        );
}
        /*
         * dailyRate and dailyAmount are NOT updated
         * from the request.
         *
         * Service recalculates them.
         */
    


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================
/*
    public static AttendanceResponse toResponse(
            Attendance attendance
    )
    {
        AttendanceResponse response =
                new AttendanceResponse();

        response.setAttendanceId(
                attendance.getAttendanceId()
        );

        response.setAttendanceDate(
                attendance.getAttendanceDate()
        );

        response.setAttendanceStatus(
                attendance.getAttendanceStatus()
        );

        response.setLeaveReason(
                attendance.getLeaveReason()
        );

        if (attendance.getLabour() != null)
        {
            response.setLabourId(
                    attendance.getLabour().getLabourId()
            );

            response.setLabourName(
                    attendance.getLabour().getLabourName()
            );
        }

        response.setDailyRate(
                attendance.getDailyRate()
        );

        response.setDailyAmount(
                attendance.getDailyAmount()
        );

        response.setRemarks(
                attendance.getRemarks()
        );

        response.setCreatedAt(
                attendance.getCreatedAt()
        );

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public static AttendanceSummaryResponse toSummaryResponse(
            Attendance attendance
    )
    {
        AttendanceSummaryResponse response =
                new AttendanceSummaryResponse();

        response.setAttendanceId(
                attendance.getAttendanceId()
        );

        response.setAttendanceDate(
                attendance.getAttendanceDate()
        );

        response.setAttendanceStatus(
                attendance.getAttendanceStatus()
        );

        response.setDailyAmount(
                attendance.getDailyAmount()
        );

        if (attendance.getLabour() != null)
        {
            response.setLabourId(
                    attendance.getLabour().getLabourId()
            );

            response.setLabourName(
                    attendance.getLabour().getLabourName()
            );
        }

        return response;
    }
}

*/