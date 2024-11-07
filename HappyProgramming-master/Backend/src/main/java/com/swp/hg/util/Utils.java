package com.swp.hg.util;

import com.swp.hg.entity.User;
import com.swp.hg.repository.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Getter
public class Utils {

    @Autowired
    private UserRepository userRepository;

    public Date convertToDate(String dateStr, String format) throws ParseException {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }

        if (format == null || format.isEmpty()) {
            format = "yyyy-MM-dd";
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        Date parsedDate = dateFormat.parse(dateStr);
        return new Date(parsedDate.getTime());
    }

    public User getCurrentUser() {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        // Get the principal (typically the username)
        String username = (String) authentication.getPrincipal();

        // Find the user by username (you can modify this based on your User entity)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }
}
