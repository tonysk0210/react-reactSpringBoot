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
@Slf4j // 這個註解來自 Lombok 庫，用於在類中自動生成一個名為 log 的日誌記錄器對象，這樣你就可以直接使用 log 來記錄日誌，而不需要手動創建日誌記錄器實例。
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class) // 這個註解表示當控制器方法中拋出任何類型的異常時，該方法將被調用來處理這些異常。Exception.class 表示捕獲所有類型的異常，這樣你就可以在這個方法中統一處理所有未被其他特定異常處理器捕獲的異常。
    public ResponseEntity<ExceptionResponseDto> handleGlobalException(Exception e, WebRequest webRequest) {
        // WebRequest 可以讓你獲取有關當前請求的詳細信息，例如請求的 URL、HTTP 方法、請求參數等。這些信息可以幫助你在處理異常時提供更有用的錯誤訊息給前端。

        log.error("Global Exception Handler: Exception 發生異常: {}", e.getMessage());
        // webRequest.getDescription(false) 這個方法會返回URI的路徑，這樣你就可以知道是哪個API路徑引發了異常。uri=/api/products
        var responseDto = new ExceptionResponseDto(
                webRequest.getDescription(false),
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage(),
                LocalDateTime.now());

        return new ResponseEntity<>(responseDto, HttpStatus.INTERNAL_SERVER_ERROR); // 另一種寫法
        // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
    } // @ExceptionHandler　若是寫在　Controller　裡面，則只會攔截該Controller的異常，會覆蓋掉全局的異常處理器；若是寫在全局異常處理器裡面，則會攔截所有Controller的異常，且不會被其他Controller裡面的異常處理器覆蓋掉。

    // 這個註解表示當控制器方法中拋出 MethodArgumentNotValidException 類型的異常時 (@Valid)，該方法將被調用來處理這些異常。MethodArgumentNotValidException 是 Spring 框架在處理帶有 @Valid 註解的請求參數時，如果驗證失敗而拋出的異常類型。當前端傳遞的數據不符合後端定義的驗證規則時，就會觸發這個異常，從而調用這個方法來處理並返回相應的錯誤訊息給前端。
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException e) {

        log.error("Global Exception Handler: MethodArgumentNotValidException 發生異常: {}", e.getMessage());
        Map<String, List<String>> validationErrors = new HashMap<>(); // 這行的作用是創建一個新的 HashMap 對象，用於存儲驗證錯誤信息。這個 Map 的 key 是字段名稱，值是一個包含該字段所有錯誤訊息的 List。這樣你就可以將同一字段的多個錯誤訊息組織在一起，方便最後返回給前端。

        // 這行的作用是從 MethodArgumentNotValidException 對象中獲取驗證錯誤信息，把「每個欄位的驗證錯誤」整理成 Map<欄位名稱, 錯誤訊息列表>
        e.getBindingResult().getFieldErrors().forEach(error -> {
            validationErrors
                    .computeIfAbsent(error.getField(), key -> new ArrayList<>())
                    .add(error.getDefaultMessage());
        });

        return new ResponseEntity<>(validationErrors, HttpStatus.BAD_REQUEST);
        /*
            {
              "name": [
                "名字是必填的",
                "名字必須在 2 到 30 個字符之間"
              ],
              "email": [
                "無效的電子郵件地址"
              ]
            }
        */
    }

    // 這個註解表示當控制器方法中拋出 ConstraintViolationException 類型的異常時 (@RequestParam, @PathVariable)，該方法將被調用來處理這些異常。ConstraintViolationException 是在使用 Bean Validation（例如 Hibernate Validator）進行參數驗證時，如果驗證失敗而拋出的異常類型。當前端傳遞的數據不符合後端定義的驗證規則時，就會觸發這個異常，從而調用這個方法來處理並返回相應的錯誤訊息給前端。
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException e) {

        log.error("Global Exception Handler: ConstraintViolationException 發生異常: {}", e.getMessage());
        Map<String, String> validationErrors = new HashMap<>(); // 把驗證錯誤信息整理成 Map<方法名.param , 驗證失敗訊息> 的形式，這樣你就可以將每個驗證失敗的欄位名稱和對應的錯誤訊息存儲在這個 Map 中，最後返回給前端。

        Set<ConstraintViolation<?>> constraintViolationSet = e.getConstraintViolations(); // 這行的作用是從 ConstraintViolationException 對象中獲取所有的驗證錯誤信息，這些錯誤信息以 Set<ConstraintViolation<?>> 的形式存儲。每個 ConstraintViolation 對象都包含了有關驗證失敗的詳細信息，例如哪個字段驗證失敗、失敗的原因等。接下來，你可以遍歷這個 Set，將每個驗證錯誤的信息提取出來並存儲在一個 Map 中，以便最後返回給前端。
        /*
        [
          ConstraintViolation {
            propertyPath = "searchUser.name"
            invalidValue = "abc"
            message = "長度必須介於 5 到 30 之間"
          },

          ConstraintViolation {
            propertyPath = "searchUser.age"
            invalidValue = 10
            message = "必須大於或等於 18"
          }
        ]
        */
        constraintViolationSet.forEach(constraintViolation ->
                validationErrors.put(
                        constraintViolation.getPropertyPath().toString(), // "param.q"
                        constraintViolation.getMessage()));               // "q 長度必須介於 5 到 30 個字元"
        /*

        // ResponseEntity
        {
            "param.q": "q 長度必須介於 5 到 30 個字元"
        }
        */

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
