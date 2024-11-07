package com.swp.hg.repository;

import com.swp.hg.entity.Schedule;
import com.swp.hg.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query("SELECT s FROM Schedule s WHERE s.mentor.id = :mentorId AND s.date BETWEEN :startDate AND :endDate")
    List<Schedule> findByMentorAndDateRange(
            @Param("mentorId") int mentorId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );
    boolean existsScheduleByDateAndSlot(String date, Slot slot);

    @Query("SELECT s FROM Schedule s " +
            "JOIN RequestSkill rs ON rs.skillCategory.skillID = s.skill.skillID " +  // Join Schedule with RequestSkill by SkillCategory
            "JOIN Request r ON r.requestID = rs.request.requestID " +  // Join Request via RequestSkill
            "WHERE r.users.id = :menteeId " +  // Filter by Mentee's ID
            "AND s.date BETWEEN :startDate AND :endDate " +  // Filter by date range
            "AND r.status = 0")  // Filter for request status 0
    List<Schedule> findByMenteeAndRequestStatus(
            @Param("menteeId") int menteeId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);
}
