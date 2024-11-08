package com.swp.hg.service.Impl;

import com.swp.hg.dto.ScheduleClassDTO;
import com.swp.hg.entity.Schedule;
import com.swp.hg.entity.ScheduleClass;
import com.swp.hg.mapper.ScheduleClassMapper;
import com.swp.hg.repository.ScheduleClassRepository;
import com.swp.hg.repository.ScheduleRepository;
import com.swp.hg.request.UpdateScheduleClassReq;
import com.swp.hg.service.ScheduleClassService;
import com.swp.hg.validate.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleClassServiceImpl implements ScheduleClassService {

    @Autowired
    private ScheduleClassRepository scheduleClassRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ScheduleClassMapper scheduleClassMapper;

    public List<ScheduleClassDTO> findAllByScheduleId(int id) {
        List<ScheduleClass> list = scheduleClassRepository.findAllBySchedule_Id(id);

        return list.stream()
                .map(scheduleClass -> scheduleClassMapper.convertToDTO(scheduleClass))
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleClassDTO> updateScheduleClasses(List<UpdateScheduleClassReq.ScheduleClassUpdate> updates, int scheduleId) {
        List<ScheduleClassDTO> updatedScheduleClasses = new ArrayList<>();
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        // Parse the schedule date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Use appropriate date format
        LocalDate scheduleDate;
        try {
            scheduleDate = LocalDate.parse(schedule.getDate(), formatter);
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid date format for schedule: " + schedule.getDate());
        }

        // Check if the schedule's date is more than one day before the current date
        if (scheduleDate.isBefore(LocalDate.now().minusDays(Constants.NUMBER_OF_DAYS_UPDATE_ATTENDANCE_STATUS))) {
            throw new RuntimeException("Cannot update schedule classes for dates more than "+ Constants.NUMBER_OF_DAYS_UPDATE_ATTENDANCE_STATUS +" day old.");
        }

        for (UpdateScheduleClassReq.ScheduleClassUpdate update : updates) {
            ScheduleClass scheduleClass = scheduleClassRepository.findById(update.getId())
                    .orElseThrow(() -> new RuntimeException("Schedule class not found with id: " + update.getId()));

            scheduleClass.setAttendanceStatus(update.getStatus());
            ScheduleClass updatedScheduleClass = scheduleClassRepository.save(scheduleClass);
            updatedScheduleClasses.add(scheduleClassMapper.convertToDTO(updatedScheduleClass));
        }

        return updatedScheduleClasses;
    }
}
