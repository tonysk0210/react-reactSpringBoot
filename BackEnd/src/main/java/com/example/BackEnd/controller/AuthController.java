package com.example.BackEnd.controller;

import com.example.BackEnd.dto.LoginResponseDto;
import com.example.BackEnd.dto.UserDto;
import com.example.BackEnd.payload.LoginRequestPayload;
import com.example.BackEnd.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestPayload loginRequestPayload) {
        try {
            // 手動執行登入驗證: 我要用 username + password 嘗試登入
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestPayload.userName(),
                            loginRequestPayload.password()));
            // org.springframework.security.authentication.BadCredentialsException: 憑證錯誤
            // 這是 GlobalExceptionHandler 接管並給上 500

            var loggedInUser = (User) authentication.getPrincipal(); // 「目前通過驗證的主要身份」
            UserDto userDto = new UserDto();
            userDto.setName(loggedInUser.getUsername());// 從登入成功的使用者物件中拿出 username

            // JWT 可以用來證明「這個使用者之前已經登入成功」。只要 token 還沒過期，前端就可以帶著它呼叫 API，後端驗證 token 成功後，就不用要求使用者重新登入。
            String jwtToken = jwtUtil.generateJwtToken(authentication); // JWT 內容可以被看見，但不能被隨便修改。

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponseDto(HttpStatus.OK.getReasonPhrase(), userDto, jwtToken));
        } catch (BadCredentialsException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, "帳號密碼不一致"); // 排除 global exception handler (500) 攔截防止轉向 ErrorPage.jsx
        } catch (AuthenticationException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, "驗證失敗"); // status 401
            // 其餘 Excpetion 轉由 Global Exception Handler 處理
        }
    }

    //
    private ResponseEntity<LoginResponseDto> buildErrorResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new LoginResponseDto(message, null, null));
    }
}
