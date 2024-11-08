package com.swp.hg.request;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Getter
public class UpdateScheduleClassReq {
    private List<ScheduleClassUpdate> scheduleClassUpdates;
    private int scheduleId;

    @Data
    public static class ScheduleClassUpdate {
        private int id;
        private int status;
    }
}
