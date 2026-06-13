package com.example.backend.controller;

import com.example.backend.dto.ProfileResponseDto;
import com.example.backend.payload.ProfileRequestPayload;
import com.example.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // 取得個人資料
    @GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile() {
        ProfileResponseDto profileResponseDto = profileService.getProfile();
        return ResponseEntity.ok(profileResponseDto);
    }

    // 更新個人資料
    @PutMapping
    public ResponseEntity<ProfileResponseDto> updateProfile(@Validated @RequestBody ProfileRequestPayload profileRequestPayload) {
        ProfileResponseDto profileResponseDto = profileService.updateProfile(profileRequestPayload);
        return ResponseEntity.ok(profileResponseDto);
    }
}
