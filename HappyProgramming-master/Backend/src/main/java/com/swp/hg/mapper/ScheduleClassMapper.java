package com.swp.hg.mapper;

import com.swp.hg.dto.MentorSkillDTO;
import com.swp.hg.dto.ScheduleClassDTO;
import com.swp.hg.entity.MentorSkill;
import com.swp.hg.entity.ScheduleClass;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Service
@Getter
public class ScheduleClassMapper {
    public ScheduleClassDTO convertToDTO(ScheduleClass scheduleClass) {
        ScheduleClassDTO dto = new ScheduleClassDTO();
        dto.setId(scheduleClass.getId());
        dto.setSchedule(scheduleClass.getSchedule());
        dto.setMentee(scheduleClass.getMentee());
        dto.setAttendanceStatus(scheduleClass.getAttendanceStatus());
        return dto;
    }
}
