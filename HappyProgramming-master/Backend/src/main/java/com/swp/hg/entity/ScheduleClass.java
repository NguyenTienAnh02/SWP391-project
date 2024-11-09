package com.swp.hg.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.swp.hg.config.StatusClassAttendance;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "schedule_class")
public class ScheduleClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    @JsonBackReference
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private User mentee;

    @Column(name = "attendance_status", nullable = false)
    private int attendanceStatus = StatusClassAttendance.ABSENT.getValue();

}
