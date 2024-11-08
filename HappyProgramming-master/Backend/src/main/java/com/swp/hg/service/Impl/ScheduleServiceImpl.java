package com.swp.hg.service.Impl;

import com.swp.hg.config.StatusRequestConfig;
import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.entity.*;
import com.swp.hg.mapper.ScheduleMapper;
import com.swp.hg.repository.*;
import com.swp.hg.request.CreateScheduleRequest;
import com.swp.hg.service.ScheduleService;
import com.swp.hg.util.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private SkillCategoryRepository skillCategoryRepository;
    @Autowired
    private MentorSkillRepository mentorSkillRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private ScheduleClassRepository scheduleClassRepository;

    @Autowired
    private Utils utils;

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Override
    public List<ScheduleDTO> getScheduleByUser(int userId, String startDate, String endDate) {
        User user = utils.getCurrentUser();

        // Check if user is an admin
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("USER_ADMIN"));

        // Check if user is a mentor
        boolean isMentor = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("USER_MENTOR"));

        // Check if user is a mentee
        boolean isMentee = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("USER_MENTEE"));

        List<Schedule> schedules = new ArrayList<>();

        if (isAdmin) {
            // Admin: Get all schedules for the given mentor ID
            schedules = scheduleRepository.findByMentorAndDateRange(userId, startDate, endDate);
        } else if (isMentor) {
            // Mentor: Get schedules associated with the mentor
            schedules = scheduleRepository.findByMentorAndDateRange(userId, startDate, endDate);
        } else if (isMentee) {
            // Mentee: Get schedules where the mentee's requests have status 0
            schedules = scheduleRepository.findByMenteeAndRequestStatus(user.getId(), startDate, endDate);
        }

        return schedules.stream()
                .map(schedule -> scheduleMapper.convertToDTO(schedule))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ScheduleDTO> createSchedule(CreateScheduleRequest request) {
        Schedule schedule = new Schedule();

        // Retrieve the mentor entity and validate
        User mentor = userRepository.findUserById(request.getMentorId());
        if (mentor == null) {
            throw new RuntimeException("Mentor not found with ID: " + request.getMentorId());
        }

        // Retrieve the slot entity and validate
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Retrieve the skill entity and validate
        SkillCategory skill = skillCategoryRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found "));

        // Validate that the skill belongs to the mentor
        if (!mentorSkillRepository.existsMentorSkillByMentorProfile_MentorProfileAndSkillCategory(mentor, skill)) {
            throw new RuntimeException("The specified skill does not belong to the mentor");
        }

        // Parse and validate the date
        LocalDate scheduleDate;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            scheduleDate = LocalDate.parse(request.getDate(), formatter);
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid date format. Expected format is yyyy-MM-dd.");
        }

        if (scheduleDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Schedule date must be today or in the future");
        }

        if(scheduleRepository.existsScheduleByDateAndSlot(request.getDate(), slot)) {
            throw new RuntimeException("Duplicate date, and slot");
        }

        // Set properties and save the schedule
        schedule.setMentor(mentor);
        schedule.setSlot(slot);
        schedule.setSkill(skill);
        schedule.setDate(request.getDate());

        // Save the schedule and convert to DTO
        Schedule savedSchedule = scheduleRepository.save(schedule);

        List<Request> requests = requestRepository.findRequestsByConditions(skill.getSkillID(), mentor.getId(), StatusRequestConfig.OPEN.getValue());

        for(Request request1 : requests) {
            User mentee = userRepository.findUserById(request1.getUsers().getId());
            ScheduleClass scheduleClass = new ScheduleClass();
            scheduleClass.setSchedule(schedule);
            scheduleClass.setMentee(mentee);
            scheduleClassRepository.save(scheduleClass);
        }

        return Optional.of(scheduleMapper.convertToDTO(savedSchedule));
    }

    @Override
    public boolean deleteSchedule(int id) {
        try {
            scheduleRepository.deleteById(id);
            return true;
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }
}
