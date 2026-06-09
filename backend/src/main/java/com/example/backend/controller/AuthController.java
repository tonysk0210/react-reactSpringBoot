package com.example.backend.controller;

import com.example.backend.dto.AddressDto;
import com.example.backend.dto.LoginResponseDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import com.example.backend.payload.LoginRequestPayload;
import com.example.backend.payload.RegisterRequestPayload;
import com.example.backend.repository.CustomerRepo;
import com.example.backend.repository.RoleRepo;
import com.example.backend.util.JwtUtil;
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
import java.util.Set;
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
    private final RoleRepo roleRepo;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestPayload loginRequestPayload) {
        try {
            // 1. 將使用者輸入的帳號密碼包成尚未驗證的 Authentication 物件。這裡只是建立驗證請求，還沒有比對資料庫密碼。
            Authentication authenticationToken = new UsernamePasswordAuthenticationToken(loginRequestPayload.userName(), loginRequestPayload.password());

            // 2. 交給 AuthenticationManager 執行驗證。目前會由 MyAuthenticationProvider 呼叫 MyAuthenticationProvider.authenticate(...) 查詢 Customer、比對密碼，成功後回傳已驗證的 Authentication。
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            // 密碼錯誤會丟出 BadCredentialsException；帳號不存在等其他驗證失敗會丟出 AuthenticationException

            // 3. 從已驗證的 Authentication 取出登入使用者。MyAuthenticationProvider 成功時會把 Customer 放進 principal
            var loggedInUser = (Customer) authentication.getPrincipal(); // 「目前通過驗證的主要身份」
            /**
             * loggedInUser 是從 MyAuthenticationProvider 來的，登入時用 email 從資料庫查出來的 Customer
             *
             * 原因在 MyAuthenticationProvider 裡：
             * return new UsernamePasswordAuthenticationToken(
             *         customer,
             *         null,
             *         authorities
             * );
             */

            // 3.1 將登入使用者的資料包在 UserDto 物件中
            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(loggedInUser, userDto);

            // 取得使用者角色 (source: Customer entity)
            userDto.setRole(loggedInUser.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.joining(",")));

            // 3.2 如果使用者有地址資料，則將地址資料包在 UserDto 物件中 (loggedInUser 是從 MyAuthenticationProvider 來的，登入時用 email 從資料庫查出來的 Customer)
            if (loggedInUser.getAddress() != null) {
                AddressDto addressDto = new AddressDto();
                BeanUtils.copyProperties(loggedInUser.getAddress(), addressDto);
                userDto.setAddress(addressDto);
            }

            // 4. 用驗證過的 Authentication 物件產生一個 JWT 給前端保存
            String jwtToken = jwtUtil.generateJwtToken(authentication);

            // 5. 回傳 LoginResponseDto 物件給前端包含了 「使用者資料」 和 「JWT Token」
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new LoginResponseDto(HttpStatus.OK.getReasonPhrase(), userDto, jwtToken));
        } catch (BadCredentialsException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()); // 來自 MyAuthenticationProvider throw new BadCredentialsException("密碼錯誤");
        } catch (AuthenticationException e) {
            return buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()); // 來自 MyAuthenticationProvider 捕捉其他 AuthenticationException 例如 throw new UsernameNotFoundException("無法找到該使用者: " + username)
        }
        // 其他非 AuthenticationException 的例外會交由 Global Exception Handler 處理。
    }

    // 建立一個回應錯誤的 ResponseEntity 物件
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

        // 從 RoleRepo 查找 Role 並加入 Customer Entity 的 roles 集合
        roleRepo.findByName("ROLE_USER").ifPresent(role -> customer.setRoles(Set.of(role)));

        // 改為 @ManyToMany 後 comment
        /*Role role = new Role(); // 建立 Role Entity
        role.setName("ROLE_USER");
        customer.getRoles().add(role); // 將 Role Entity 加入 Customer Entity 的 roles 集合*/

        customerRepo.save(customer); // 將 Customer Entity 儲存到資料庫

        return ResponseEntity
                .status(HttpStatus.CREATED) // status 201
                .body("帳號註冊成功");
    }
}
