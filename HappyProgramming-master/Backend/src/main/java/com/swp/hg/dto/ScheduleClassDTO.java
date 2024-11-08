package com.swp.hg.dto;

import com.swp.hg.entity.Schedule;
import com.swp.hg.entity.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ScheduleClassDTO {
    private int id;
    private Schedule schedule;
    private User mentee;
    private int attendanceStatus;
}
