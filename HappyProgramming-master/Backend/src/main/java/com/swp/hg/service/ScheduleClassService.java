package com.swp.hg.service;

import com.swp.hg.dto.ScheduleClassDTO;
import com.swp.hg.request.UpdateScheduleClassReq;

import java.util.List;

public interface ScheduleClassService {
    List<ScheduleClassDTO> findAllByScheduleId(int id);
    List<ScheduleClassDTO> updateScheduleClasses(List<UpdateScheduleClassReq.ScheduleClassUpdate> updates, int scheduleId);
}