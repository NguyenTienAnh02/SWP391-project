package com.swp.hg.filter;

import com.swp.hg.request.AuthenticationRequest;
import com.swp.hg.response.AuthenticationResponse;
import com.swp.hg.entity.Role;
import com.swp.hg.entity.User;
import com.swp.hg.repository.RoleCustomRepo;
import com.swp.hg.service.Impl.JwtService;
import com.swp.hg.service.Impl.UserImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final RoleCustomRepo roleCustomRepo;
    private final JwtService jwtService;
    private final UserImpl userImpl;

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getUsername(),
                            authenticationRequest.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            return AuthenticationResponse.builder().message("Failed to authenticate").build();
        }

        // Retrieve the user and roles
        User user = userImpl.takeUserByUsername(authenticationRequest.getUsername());
        List<Role> roles = user != null ? roleCustomRepo.getRole(user) : new ArrayList<>();

        if (roles.isEmpty()) {
            return AuthenticationResponse.builder().message("No roles assigned").build();
        }

        // Debug: Print roles to confirm they are correct
        roles.forEach(role -> System.out.println("Role: " + role.getName() + " (ID: " + role.getId() + ")"));

        // Determine targetPage based on the role ID
        String targetPage = roles.stream().anyMatch(role -> role.getId() == 1) ? "/dashboard" : "/";

        // Debug: Print targetPage to confirm it's set correctly
        System.out.println("targetPage set to: " + targetPage);

        // Generate tokens
        var jwtToken = jwtService.createToken(user, roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList()));
        var jwtRefreshToken = jwtService.createRefreshToken(user);

        // Return response with targetPage
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(jwtRefreshToken)
                .message("Logged in successfully")
                .targetPage(targetPage)
                .build();
    }


}
