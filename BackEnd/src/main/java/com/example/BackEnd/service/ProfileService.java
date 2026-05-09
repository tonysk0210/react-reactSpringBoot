package com.example.BackEnd.service;

import com.example.BackEnd.dto.ProfileResponseDto;
import com.example.BackEnd.payload.ProfileRequestPayload;

public interface ProfileService {
    ProfileResponseDto getProfile();

    ProfileResponseDto updateProfile(ProfileRequestPayload profileRequestPayload);
}
