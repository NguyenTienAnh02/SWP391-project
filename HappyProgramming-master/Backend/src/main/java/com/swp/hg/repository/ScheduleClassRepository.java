package com.swp.hg.repository;

import com.swp.hg.entity.ScheduleClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleClassRepository extends JpaRepository<ScheduleClass, Integer> {
    List<ScheduleClass> findAllBySchedule_Id(int id);
}
