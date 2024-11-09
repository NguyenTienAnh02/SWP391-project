package com.swp.hg.mapper;

import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.entity.Schedule;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Service
@Getter
public class ScheduleMapper {
    public ScheduleDTO convertToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setMentor(schedule.getMentor());
        dto.setSkill(schedule.getSkill());
        dto.setDate(schedule.getDate());
        dto.setSlot(schedule.getSlot());
        dto.setScheduleClasses(schedule.getScheduleClasses());
        return dto;
    }
}
