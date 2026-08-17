/*
This is the main business-logic file.
 */

package com.skcp.service;

import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.entity.Attendance;
import com.skcp.entity.Labour;
import com.skcp.enums.RecordStatus;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.AttendanceMapper;
import com.skcp.repository.AttendanceRepository;
import com.skcp.repository.LabourRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService
{

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final AttendanceRepository attendanceRepository;

    private final LabourRepository labourRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            LabourRepository labourRepository
    )
    {
        this.attendanceRepository =
                attendanceRepository;

        this.labourRepository =
                labourRepository;
    }


    // ============================================================
    // GET ALL ACTIVE ATTENDANCE
    // ============================================================

    public List<AttendanceResponse> getAllAttendance()
    {
        return attendanceRepository
                .findByStatus(
                        RecordStatus.ACTIVE
                )
                .stream()
                .map(AttendanceMapper::toResponse)
                .toList();
    }


    // ============================================================
    // GET ACTIVE ATTENDANCE BY ID
    // ============================================================

    public AttendanceResponse getAttendanceById(
            Integer id
    )
    {
        Attendance attendance =
                attendanceRepository
                        .findByAttendanceIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: "
                                                + id
                                )
                        );

        return AttendanceMapper.toResponse(
                attendance
        );
    }


    // ============================================================
    // CREATE ATTENDANCE
    // ============================================================

    @Transactional
    public AttendanceResponse createAttendance(
            AttendanceCreateRequest request
    )
    {

        // --------------------------------------------------------
        // FIND LABOUR
        // --------------------------------------------------------

        Labour labour =
                labourRepository
                        .findById(
                                request.getLabourId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Labour not found with id: "
                                                + request.getLabourId()
                                )
                        );


        // --------------------------------------------------------
        // CHECK LABOUR STATUS
        // --------------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(
                labour.getStatus()
        ))
        {
            throw new IllegalArgumentException(
                    "Attendance cannot be recorded for an inactive labour"
            );
        }


        // --------------------------------------------------------
        // CHECK DUPLICATE ACTIVE ATTENDANCE
        // --------------------------------------------------------

        boolean alreadyExists =
                attendanceRepository
                        .findByLabourLabourIdAndAttendanceDateAndStatus(
                                request.getLabourId(),
                                request.getAttendanceDate(),
                                RecordStatus.ACTIVE
                        )
                        .isPresent();

        if (alreadyExists)
        {
            throw new IllegalArgumentException(
                    "Attendance already exists for this labour on "
                            + request.getAttendanceDate()
            );
        }


        // --------------------------------------------------------
        // MAP REQUEST → ENTITY
        // --------------------------------------------------------

        Attendance attendance =
                AttendanceMapper.toEntity(
                        request
                );


        // --------------------------------------------------------
        // SET LABOUR
        // --------------------------------------------------------

        attendance.setLabour(
                labour
        );


        // --------------------------------------------------------
        // BACKEND-CONTROLLED DAILY RATE
        // --------------------------------------------------------

        attendance.setDailyRate(
                labour.getDailyRate()
        );


        // --------------------------------------------------------
        // CALCULATE DAILY AMOUNT
        // --------------------------------------------------------

        calculateDailyAmount(
                attendance
        );


        // --------------------------------------------------------
        // BACKEND-CONTROLLED RECORD STATUS
        // --------------------------------------------------------

        attendance.setStatus(
                RecordStatus.ACTIVE
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Attendance savedAttendance =
                attendanceRepository.save(
                        attendance
                );


        // --------------------------------------------------------
        // RETURN
        // --------------------------------------------------------

        return AttendanceMapper.toResponse(
                savedAttendance
        );
    }


    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    @Transactional
    public AttendanceResponse updateAttendance(
            Integer id,
            AttendanceUpdateRequest request
    )
    {

        // --------------------------------------------------------
        // FIND ACTIVE ATTENDANCE
        // --------------------------------------------------------

        Attendance existingAttendance =
                attendanceRepository
                        .findByAttendanceIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // FIND LABOUR
        // --------------------------------------------------------

        Labour labour =
                labourRepository
                        .findById(
                                request.getLabourId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Labour not found with id: "
                                                + request.getLabourId()
                                )
                        );


        // --------------------------------------------------------
        // CHECK LABOUR STATUS
        // --------------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(
                labour.getStatus()
        ))
        {
            throw new IllegalArgumentException(
                    "Attendance cannot be assigned to an inactive labour"
            );
        }


        // --------------------------------------------------------
        // CHECK DUPLICATE ACTIVE ATTENDANCE
        // --------------------------------------------------------

        boolean duplicateExists =
                attendanceRepository
                        .findByLabourLabourIdAndAttendanceDateAndAttendanceIdNotAndStatus(
                                request.getLabourId(),
                                request.getAttendanceDate(),
                                id,
                                RecordStatus.ACTIVE
                        )
                        .isPresent();

        if (duplicateExists)
        {
            throw new IllegalArgumentException(
                    "Attendance already exists for this labour on "
                            + request.getAttendanceDate()
            );
        }


        // --------------------------------------------------------
        // UPDATE EDITABLE FIELDS
        // --------------------------------------------------------

        AttendanceMapper.updateEntity(
                existingAttendance,
                request
        );


        // --------------------------------------------------------
        // SET LABOUR
        // --------------------------------------------------------

        existingAttendance.setLabour(
                labour
        );


        // --------------------------------------------------------
        // REFRESH DAILY RATE
        // --------------------------------------------------------

        existingAttendance.setDailyRate(
                labour.getDailyRate()
        );


        // --------------------------------------------------------
        // RECALCULATE DAILY AMOUNT
        // --------------------------------------------------------

        calculateDailyAmount(
                existingAttendance
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Attendance updatedAttendance =
                attendanceRepository.save(
                        existingAttendance
                );


        // --------------------------------------------------------
        // RETURN
        // --------------------------------------------------------

        return AttendanceMapper.toResponse(
                updatedAttendance
        );
    }


    // ============================================================
    // DELETE ATTENDANCE — SOFT DELETE
    // ============================================================

    @Transactional
    public void deleteAttendance(
            Integer id
    )
    {

        Attendance attendance =
                attendanceRepository
                        .findByAttendanceIdAndStatus(
                                id,
                                RecordStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: "
                                                + id
                                )
                        );


        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * attendanceRepository.delete(...)
         *
         * or:
         *
         * attendanceRepository.deleteById(...)
         *
         * Attendance follows SKCP Soft Delete.
         */

        attendance.setStatus(
                RecordStatus.INACTIVE
        );

        attendanceRepository.save(
                attendance
        );
    }


    // ============================================================
    // WEEKLY ATTENDANCE SUMMARY
    // ============================================================

    public AttendanceSummaryResponse getWeeklySummary(
            Integer labourId,
            LocalDate weekStartDate
    )
    {

        // --------------------------------------------------------
        // FIND LABOUR
        // --------------------------------------------------------

        Labour labour =
                labourRepository
                        .findById(
                                labourId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Labour not found with id: "
                                                + labourId
                                )
                        );


        // --------------------------------------------------------
        // NORMALIZE WEEK START
        // --------------------------------------------------------

        LocalDate normalizedWeekStart =
                weekStartDate
                        .with(
                                DayOfWeek.MONDAY
                        );


        // --------------------------------------------------------
        // CALCULATE WEEK END
        // --------------------------------------------------------

        LocalDate weekEndDate =
                normalizedWeekStart
                        .plusDays(6);


        // --------------------------------------------------------
        // GET ACTIVE ATTENDANCE
        // --------------------------------------------------------

        List<Attendance> attendanceList =
                attendanceRepository
                        .findByLabourLabourIdAndAttendanceDateBetweenAndStatus(
                                labourId,
                                normalizedWeekStart,
                                weekEndDate,
                                RecordStatus.ACTIVE
                        );


        // --------------------------------------------------------
        // COUNT PRESENT
        // --------------------------------------------------------

        long presentDays =
                attendanceList
                        .stream()
                        .filter(attendance ->
                                "PRESENT".equalsIgnoreCase(
                                        attendance.getAttendanceStatus()
                                )
                        )
                        .count();


        // --------------------------------------------------------
        // COUNT ABSENT
        // --------------------------------------------------------

        long absentDays =
                attendanceList
                        .stream()
                        .filter(attendance ->
                                "ABSENT".equalsIgnoreCase(
                                        attendance.getAttendanceStatus()
                                )
                        )
                        .count();


        // --------------------------------------------------------
        // COUNT HOLIDAY
        // --------------------------------------------------------

        long holidayDays =
                attendanceList
                        .stream()
                        .filter(attendance ->
                                "HOLIDAY".equalsIgnoreCase(
                                        attendance.getAttendanceStatus()
                                )
                        )
                        .count();


        // --------------------------------------------------------
        // WEEKLY AMOUNT
        // --------------------------------------------------------

        BigDecimal weeklyAmount =
                attendanceList
                        .stream()
                        .map(Attendance::getDailyAmount)
                        .filter(amount ->
                                amount != null
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        // --------------------------------------------------------
        // CREATE SUMMARY RESPONSE
        // --------------------------------------------------------

        AttendanceSummaryResponse response =
                new AttendanceSummaryResponse();

        response.setLabourId(
                labour.getLabourId()
        );

        response.setLabourName(
                labour.getLabourName()
        );

        response.setWeekStartDate(
                normalizedWeekStart
        );

        response.setWeekEndDate(
                weekEndDate
        );

        response.setPresentDays(
                presentDays
        );

        response.setAbsentDays(
                absentDays
        );

        response.setHolidayDays(
                holidayDays
        );

        response.setDailyRate(
                labour.getDailyRate()
        );

        response.setWeeklyAmount(
                weeklyAmount
        );

        return response;
    }


    // ============================================================
    // DAILY AMOUNT BUSINESS RULE
    // ============================================================

    private void calculateDailyAmount(
            Attendance attendance
    )
    {

        if ("PRESENT".equalsIgnoreCase(
                attendance.getAttendanceStatus()
        ))
        {
            attendance.setDailyAmount(
                    attendance.getDailyRate()
            );
        }
        else
        {
            attendance.setDailyAmount(
                    BigDecimal.ZERO
            );
        }
    }
}



/*
package com.skcp.service;

import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.entity.Attendance;
import com.skcp.entity.Labour;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.AttendanceMapper;
import com.skcp.repository.AttendanceRepository;
import com.skcp.repository.LabourRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AttendanceService
{

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final AttendanceRepository attendanceRepository;

    private final LabourRepository labourRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            LabourRepository labourRepository
    )
    {
        this.attendanceRepository = attendanceRepository;
        this.labourRepository = labourRepository;
    }


    // ============================================================
    // GET ALL ATTENDANCE
    // ============================================================

    public List<AttendanceSummaryResponse> getAllAttendance()
    {
        return attendanceRepository.findAll()
                .stream()
                .map(AttendanceMapper::toSummaryResponse)
                .toList();
    }


    // ============================================================
    // GET ATTENDANCE BY ID
    // ============================================================

    public AttendanceResponse getAttendanceById(
            Integer id
    )
    {
        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: " + id
                                )
                        );

        return AttendanceMapper.toResponse(
                attendance
        );
    }


    // ============================================================
    // CREATE ATTENDANCE
    // ============================================================

    public AttendanceResponse createAttendance(
            AttendanceCreateRequest request
    )
    {

        // --------------------------------------------------------
        // FIND LABOUR
        // --------------------------------------------------------

        Labour labour =
                labourRepository.findById(
                        request.getLabourId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Labour not found with id: "
                                        + request.getLabourId()
                        )
                );


        // --------------------------------------------------------
        // CHECK LABOUR STATUS
        // --------------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(
                labour.getStatus()
        ))
        {
            throw new IllegalArgumentException(
                    "Attendance cannot be recorded for an inactive labour"
            );
        }


        // --------------------------------------------------------
        // CHECK DUPLICATE ATTENDANCE
        // --------------------------------------------------------

        boolean alreadyExists =
                attendanceRepository
                        .findByLabourLabourIdAndAttendanceDate(
                                request.getLabourId(),
                                request.getAttendanceDate()
                        )
                        .isPresent();

        if (alreadyExists)
        {
            throw new IllegalArgumentException(
                    "Attendance already exists for this labour on "
                            + request.getAttendanceDate()
            );
        }


        // --------------------------------------------------------
        // MAP REQUEST → ENTITY
        // --------------------------------------------------------

        Attendance attendance =
                AttendanceMapper.toEntity(request);


        // --------------------------------------------------------
        // SET LABOUR
        // --------------------------------------------------------

        attendance.setLabour(labour);


        // --------------------------------------------------------
        // BACKEND-CONTROLLED DAILY RATE
        // --------------------------------------------------------

        attendance.setDailyRate(
                labour.getDailyRate()
        );


        // --------------------------------------------------------
        // CALCULATE DAILY AMOUNT
        // --------------------------------------------------------

        calculateDailyAmount(attendance);


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Attendance savedAttendance =
                attendanceRepository.save(attendance);


        // --------------------------------------------------------
        // RETURN RESPONSE
        // --------------------------------------------------------

        return AttendanceMapper.toResponse(
                savedAttendance
        );
    }


    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    public AttendanceResponse updateAttendance(
            Integer id,
            AttendanceUpdateRequest request
    )
    {

        // --------------------------------------------------------
        // FIND EXISTING ATTENDANCE
        // --------------------------------------------------------

        Attendance existingAttendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: " + id
                                )
                        );


        // --------------------------------------------------------
        // FIND LABOUR
        // --------------------------------------------------------

        Labour labour =
                labourRepository.findById(
                        request.getLabourId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Labour not found with id: "
                                        + request.getLabourId()
                        )
                );


        // --------------------------------------------------------
        // CHECK LABOUR STATUS
        // --------------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(
                labour.getStatus()
        ))
        {
            throw new IllegalArgumentException(
                    "Attendance cannot be assigned to an inactive labour"
            );
        }


        // --------------------------------------------------------
        // CHECK DUPLICATE DATE
        // --------------------------------------------------------

        boolean duplicateExists =
                attendanceRepository
                        .findByLabourLabourIdAndAttendanceDateAndAttendanceIdNot(
                                request.getLabourId(),
                                request.getAttendanceDate(),
                                id
                        )
                        .isPresent();

        if (duplicateExists)
        {
            throw new IllegalArgumentException(
                    "Attendance already exists for this labour on "
                            + request.getAttendanceDate()
            );
        }


        // --------------------------------------------------------
        // MAP EDITABLE FIELDS
        // --------------------------------------------------------

        AttendanceMapper.updateEntity(
                existingAttendance,
                request
        );


        // --------------------------------------------------------
        // SET LABOUR
        // --------------------------------------------------------

        existingAttendance.setLabour(
                labour
        );


        // --------------------------------------------------------
        // REFRESH DAILY RATE
        // --------------------------------------------------------

        existingAttendance.setDailyRate(
                labour.getDailyRate()
        );


        // --------------------------------------------------------
        // RECALCULATE DAILY AMOUNT
        // --------------------------------------------------------

        calculateDailyAmount(
                existingAttendance
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Attendance updatedAttendance =
                attendanceRepository.save(
                        existingAttendance
                );


        // --------------------------------------------------------
        // RETURN RESPONSE
        // --------------------------------------------------------

        return AttendanceMapper.toResponse(
                updatedAttendance
        );
    }


    // ============================================================
    // DELETE ATTENDANCE
    // ============================================================

    public void deleteAttendance(
            Integer id
    )
    {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found with id: "
                                                + id
                                )
                        );

        attendanceRepository.delete(
                attendance
        );
    }


    // ============================================================
    // BUSINESS RULE
    // ============================================================

    
     // PRESENT → Daily amount = Labour daily rate
     
     // ABSENT → Daily amount = 0
     
     // LEAVE → Daily amount = 0
     
    private void calculateDailyAmount(
            Attendance attendance
    )
    {

        if ("PRESENT".equalsIgnoreCase(
                attendance.getAttendanceStatus()
        ))
        {
            attendance.setDailyAmount(
                    attendance.getDailyRate()
            );
        }
        else
        {
            attendance.setDailyAmount(
                    BigDecimal.ZERO
            );
        }
    }
}


*/


/*
package com.skcp.service;

import com.skcp.entity.Attendance;
import com.skcp.entity.Labour;
import com.skcp.repository.AttendanceRepository;
import com.skcp.repository.LabourRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final LabourRepository labourRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             LabourRepository labourRepository) {
        this.attendanceRepository = attendanceRepository;
        this.labourRepository = labourRepository;
    }

    // Get all attendance
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get attendance by ID
    public Attendance getAttendanceById(Integer id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    // Save attendance
    public Attendance saveAttendance(Attendance attendance) {

        Labour labour =
                labourRepository.findById(attendance.getLabour().getLabourId())
                        .orElseThrow(() ->
                                new RuntimeException("Labour not found"));

        attendance.setLabour(labour);

        // Automatically copy Labour Daily Rate
        attendance.setDailyRate(labour.getDailyRate());

        // Business Rule
        if ("PRESENT".equalsIgnoreCase(attendance.getAttendanceStatus())) {
            attendance.setDailyAmount(labour.getDailyRate());
        } else {
            attendance.setDailyAmount(BigDecimal.ZERO);
        }

        return attendanceRepository.save(attendance);
    }

    // Delete attendance
    public void deleteAttendance(Integer id) {
        attendanceRepository.deleteById(id);
    }
}
    */