package com.example.BackEnd.controller;

import com.example.BackEnd.dto.ProfileResponseDto;
import com.example.BackEnd.payload.ProfileRequestPayload;
import com.example.BackEnd.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile() {
        ProfileResponseDto profileResponseDto = profileService.getProfile();
        return ResponseEntity.ok(profileResponseDto);
    }

    @PutMapping
    public ResponseEntity<ProfileResponseDto> updateProfile(@Validated @RequestBody ProfileRequestPayload profileRequestPayload) {
        ProfileResponseDto profileResponseDto = profileService.updateProfile(profileRequestPayload);
        return ResponseEntity.ok(profileResponseDto);
    }
}
