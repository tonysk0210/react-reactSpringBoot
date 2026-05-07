package com.example.BackEnd.controller;

import com.example.BackEnd.dto.LoginResponseDto;
import com.example.BackEnd.dto.UserDto;
import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.payload.LoginRequestPayload;
import com.example.BackEnd.payload.RegisterRequestPayload;
import com.example.BackEnd.repository.CustomerRepo;
import com.example.BackEnd.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final InMemoryUserDetailsManager inMemoryUserDetailsManager; // 目前Spring Security 將使用者存在 InMemoryUserDetailsManager
    private final PasswordEncoder passwordEncoder; // ByCrpt hash encoder
    private final CustomerRepo customerRepo;
    private final CompromisedPasswordChecker compromisedPasswordChecker;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestPayload loginRequestPayload) {
        try {
            // 手動執行登入驗證: 我要用 username + password 嘗試登入
            // 由 AuthenticationManager 來執行登入驗證，裡面會呼叫 UserDetailsService 來根據 username 拿到使用者資料，然後再比對密碼是否正確。
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

    private ResponseEntity<LoginResponseDto> buildErrorResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new LoginResponseDto(message, null, null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestPayload registerRequestpayload) {

        // 新註冊的使用者加入到記憶體版的使用者管理器。
        /*inMemoryUserDetailsManager.createUser(new User(
                registerRequestpayload.email(),
                passwordEncoder.encode(registerRequestpayload.password()),
                List.of(new SimpleGrantedAuthority("USER"))));*/
        // email 當成 username 使用; 明文密碼先做 BCrypt hash 編碼; 指定這個新使用者擁有的權限

        var error = new HashMap<String, List<String>>(); // 建立一個 HashMap 來存放錯誤信息
        // 0. 檢查密碼是否在「被竊取的密碼清單」裡面
        /*CompromisedPasswordDecision decision = compromisedPasswordChecker.check(registerRequestpayload.password());
        if (decision.isCompromised()) {
            error.put("password", List.of("密碼在被竊取的密碼清單裡面，請使用其他密碼"));
        }*/

        // 1. 先檢查 email 或手機號碼是否已經註冊
        if (customerRepo.existsByEmail(registerRequestpayload.email())) {
            error.put("email", List.of("電子郵件已經註冊"));
        }
        if (customerRepo.existsByMobileNumber(registerRequestpayload.mobileNumber())) {
            error.put("mobileNumber", List.of("手機號碼已經註冊"));
        }
        // 如果有錯誤，則回傳錯誤信息
        if (!error.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }

        // 2. 建立 Customer Entity
        var customer = new Customer(); // 建立 Customer Entity
        BeanUtils.copyProperties(registerRequestpayload, customer); //只會複製「欄位名稱一樣」的屬性
        customer.setPasswordHash(passwordEncoder.encode(registerRequestpayload.password())); // 將密碼做 Bcrypt hash 編碼後存入 Customer Entity
        customerRepo.save(customer); // 將 Customer Entity 儲存到資料庫

        return ResponseEntity
                .status(HttpStatus.CREATED) // status 201
                .body("帳號註冊成功");
    }
}
