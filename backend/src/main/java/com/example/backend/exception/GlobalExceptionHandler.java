package com.example.backend.exception;

import com.example.backend.dto.ExceptionResponseDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice // RestControllerAdvice (Bean) 攔截所有Controller的異常，回傳 JSON 格式的錯誤訊息給前端 @ControllerAdvice + @ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    // Exception.class 表示捕獲所有類型的異常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponseDto> handleGlobalException(Exception e, WebRequest webRequest) {

        log.error("Global Exception Handler: Exception 發生異常: {}", e.getMessage());

        // 1. 建立一個 ExceptionResponseDto 對象，用於存儲錯誤信息
        var responseDto = new ExceptionResponseDto(
                webRequest.getDescription(false), // URI路徑
                HttpStatus.INTERNAL_SERVER_ERROR, // 錯誤代碼
                e.getMessage(), // 錯誤訊息
                LocalDateTime.now()); // 錯誤時間

        // 2. 建立一個 ResponseEntity 對象，用於返回錯誤信息
        return new ResponseEntity<>(responseDto, HttpStatus.INTERNAL_SERVER_ERROR);
    } // @ExceptionHandler　若是寫在　Controller　裡面，則只會攔截該Controller的異常，會覆蓋掉全局的異常處理器；若是寫在全局異常處理器裡面，則會攔截所有Controller的異常，且不會被其他Controller裡面的異常處理器覆蓋掉。

    // MethodArgumentNotValidException 是在使用 Spring 的 @Valid 注解進行參數驗證時，如果驗證失敗而拋出的異常類型。當前端傳遞的數據不符合後端定義的驗證規則時，就會觸發這個異常，從而調用這個方法來處理並返回相應的錯誤訊息給前端。
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException e) {

        log.error("Global Exception Handler: MethodArgumentNotValidException 發生異常: {}", e.getMessage());

        // 1. 建立一個 Map 對象，用於存儲驗證錯誤信息
        Map<String, List<String>> validationErrors = new HashMap<>();

        // 2. 這行的作用是從 MethodArgumentNotValidException 對象中獲取驗證錯誤信息，把「每個欄位的驗證錯誤」整理成 Map<欄位名稱, 錯誤訊息列表>
        e.getBindingResult().getFieldErrors().forEach(error -> {
            validationErrors
                    .computeIfAbsent(error.getField(), key -> new ArrayList<>())
                    .add(error.getDefaultMessage());
        });

        // 3. 建立一個 ResponseEntity 對象，用於返回驗證錯誤信息
        return new ResponseEntity<>(validationErrors, HttpStatus.BAD_REQUEST);
        /**
         *             {
         *               "name": [
         *                 "名字是必填的",
         *                 "名字必須在 2 到 30 個字符之間"
         *               ],
         *               "email": [
         *                 "無效的電子郵件地址"
         *               ]
         *             }
         * */
    }

    // ConstraintViolationException 主要處理「方法參數層級」的 Bean Validation，例如 @RequestParam、@PathVariable、@RequestHeader 上的 @Size、@Min、@NotBlank 等。
    // Controller 或方法通常需要加上 @Validated，這類參數驗證才會生效；@Valid @RequestBody DTO 驗證失敗通常會走 MethodArgumentNotValidException。
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException e) {

        log.error("Global Exception Handler: ConstraintViolationException 發生異常: {}", e.getMessage());

        // 1. 建立一個 Map，用於存放驗證錯誤。key 是失敗的位置，例如 "param.p"；value 是錯誤訊息。
        Map<String, String> validationErrors = new HashMap<>();

        // 2. 從 ConstraintViolationException 取得所有方法參數驗證錯誤。每個 ConstraintViolation 都包含失敗位置、傳入的錯誤值、錯誤訊息等資訊。
        Set<ConstraintViolation<?>> constraintViolationSet = e.getConstraintViolations();
        /**
         * 例如 DummyController:
         *
         * @GetMapping("/param")
         * public String param(
         *     @Size(min = 5, max = 30, message = "p 長度必須介於 5 到 30 個字元")
         *     @RequestParam(name = "p") String p
         * )
         *
         * 呼叫 GET /api/v1/dummy/param?p=2 時，p 長度不足，會產生類似：
         *
         *        [
         *           ConstraintViolation {
         *             propertyPath = "param.p"
         *             invalidValue = "2"
         *             message = "p 長度必須介於 5 到 30 個字元"
         *           }
         *         ]
         * */

        // 3. 遍歷 ConstraintViolationSet，將每個驗證錯誤的信息提取出來並存儲在 validationErrors Map 中
        constraintViolationSet.forEach(constraintViolation ->
                validationErrors.put(
                        constraintViolation.getPropertyPath().toString(), // 例如 "param.p"，代表 param 方法的 p 參數驗證失敗
                        constraintViolation.getMessage()));               // 例如 "p 長度必須介於 5 到 30 個字元"

        /**
         *         // ResponseEntity
         *         {
         *             "param.p": "p 長度必須介於 5 到 30 個字元"
         *         }
         */
        // 4. 建立一個 ResponseEntity 對象，用於返回驗證錯誤信息
        return ResponseEntity.badRequest().body(validationErrors);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> handleResourceNotFoundException(ResourceNotFoundException exception,
                                                                                WebRequest webRequest) {
        ExceptionResponseDto responseDTO = new ExceptionResponseDto(
                webRequest.getDescription(false),
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(responseDTO, HttpStatus.NOT_FOUND); // 404
    }
}
