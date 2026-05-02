package com.example.BackEnd.controller;

import com.example.BackEnd.dto.LoginResponseDto;
import com.example.BackEnd.payload.LoginRequestPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestPayload loginRequestPayload) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new LoginResponseDto(HttpStatus.OK.getReasonPhrase(), null, null));
    }
}
