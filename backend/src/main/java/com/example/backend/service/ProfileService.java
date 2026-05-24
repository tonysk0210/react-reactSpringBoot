package com.example.backend.service;

import com.example.backend.dto.ProfileResponseDto;
import com.example.backend.payload.ProfileRequestPayload;

public interface ProfileService {
    ProfileResponseDto getProfile();

    ProfileResponseDto updateProfile(ProfileRequestPayload profileRequestPayload);
}
