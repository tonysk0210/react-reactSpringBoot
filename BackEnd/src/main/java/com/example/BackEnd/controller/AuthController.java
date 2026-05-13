package com.example.BackEnd.controller;

import com.example.BackEnd.dto.AddressDto;
import com.example.BackEnd.dto.LoginResponseDto;
import com.example.BackEnd.dto.UserDto;
import com.example.BackEnd.entity.Customer;
import com.example.BackEnd.entity.Role;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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

            // 1. 取得使用者輸入的帳號密碼，並包成一個 AuthenticationToken 物件 ( 還未通過驗證)
            Authentication authenticationToken = new UsernamePasswordAuthenticationToken(loginRequestPayload.userName(), loginRequestPayload.password());

            // 2. 由自訂義的 AuthenticationManager bean 來執行驗證剛包好的 Authentication 物件 ( 若驗證成功產生已通過驗證的 Authentication 物件)
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            // 驗證錯誤丟出 org.springframework.security.authentication.BadCredentialsException: 憑證錯誤

            // 3. 從 Authentication 物件中取出通過驗證的使用者物件，並包在 UserDto 物件中
            var loggedInUser = (Customer) authentication.getPrincipal(); // 「目前通過驗證的主要身份」
            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(loggedInUser, userDto);

            userDto.setRole(loggedInUser.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.joining(","))); // 取得使用者角色 (source: Customer entity)

            // 3.1 如果使用者有地址資料，則將地址資料包在 UserDto 物件中 (loggedInUser 是從 MyAuthenticationProvider 來的，登入時用 email 從資料庫查出來的 Customer)
            if (loggedInUser.getAddress() != null) {
                AddressDto addressDto = new AddressDto();
                BeanUtils.copyProperties(loggedInUser.getAddress(), addressDto);
                userDto.setAddress(addressDto);
            }

            // 4. 用 Authentication 物件 生成 JWT Token 並回傳給前端
            String jwtToken = jwtUtil.generateJwtToken(authentication); // JWT 內容可以被看見，但不能被隨便修改。
            // JWT 可以用來證明「這個使用者之前已經登入成功」。只要 token 還沒過期，前端就可以帶著它呼叫 API，後端驗證 token 成功後，就不用要求使用者重新登入。

            // 5. 回傳 LoginResponseDto 物件給前端包含了 「使用者資料」 和 「JWT Token」
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponseDto(HttpStatus.OK.getReasonPhrase(), userDto, jwtToken));
        } catch (BadCredentialsException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()); // 排除 global exception handler (500) 攔截防止轉向 ErrorPage.jsx
        } catch (AuthenticationException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()); // status 401
            // 其餘 Exception 轉由 Global Exception Handler 處理
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
        Role role = new Role(); // 建立 Role Entity
        role.setName("ROLE_USER");
        customer.getRoles().add(role); // 將 Role Entity 加入 Customer Entity 的 roles 集合
        customerRepo.save(customer); // 將 Customer Entity 儲存到資料庫

        return ResponseEntity
                .status(HttpStatus.CREATED) // status 201
                .body("帳號註冊成功");
    }
}
