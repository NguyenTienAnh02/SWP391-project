package com.swp.hg.dto;

import com.swp.hg.entity.ScheduleClass;
import com.swp.hg.entity.SkillCategory;
import com.swp.hg.entity.Slot;
import com.swp.hg.entity.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class ScheduleDTO {
    private int id;
    private User mentor;
    private String date;
    private Slot slot;
    private SkillCategory skill;
    private List<ScheduleClass> scheduleClasses;
}
