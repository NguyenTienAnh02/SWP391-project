package com.swp.hg.service;

import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.request.CreateScheduleRequest;

import java.util.List;
import java.util.Optional;

public interface ScheduleService {
    List<ScheduleDTO> getScheduleByUser(int userId, String startDate, String endDate);
    Optional<ScheduleDTO> createSchedule(CreateScheduleRequest request);
    boolean deleteSchedule(int id);
}
