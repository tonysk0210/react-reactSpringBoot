package com.example.BackEnd.dto;

public record LoginResponseDto(String message, UserDto user, String jwtToken) {
}
