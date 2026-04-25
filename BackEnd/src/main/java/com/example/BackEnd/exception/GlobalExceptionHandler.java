package com.example.BackEnd.exception;

import com.example.BackEnd.dto.ExceptionResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice // RestControllerAdvice (Bean) 攔截所有Controller的異常，回傳 JSON 格式的錯誤訊息給前端 @ControllerAdvice + @ResponseBody
@Slf4j // 這個註解來自 Lombok 庫，用於在類中自動生成一個名為 log 的日誌記錄器對象，這樣你就可以直接使用 log 來記錄日誌，而不需要手動創建日誌記錄器實例。
public class GlobalExceptionHandler {


    @ExceptionHandler(Exception.class) // 這個註解表示當控制器方法中拋出任何類型的異常時，該方法將被調用來處理這些異常。Exception.class 表示捕獲所有類型的異常，這樣你就可以在這個方法中統一處理所有未被其他特定異常處理器捕獲的異常。
    public ResponseEntity<ExceptionResponseDto> handleGlobalException(Exception e, WebRequest webRequest) {
        // WebRequest 可以讓你獲取有關當前請求的詳細信息，例如請求的 URL、HTTP 方法、請求參數等。這些信息可以幫助你在處理異常時提供更有用的錯誤訊息給前端。

        // webRequest.getDescription(false) 這個方法會返回URI的路徑，這樣你就可以知道是哪個API路徑引發了異常。uri=/api/products
        var responseDto = new ExceptionResponseDto(
                webRequest.getDescription(false),
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage(),
                LocalDateTime.now());

        return new ResponseEntity<>(responseDto, HttpStatus.INTERNAL_SERVER_ERROR); // 另一種寫法
        // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
    } // @ExceptionHandler　若是寫在　Controller　裡面，則只會攔截該Controller的異常，會覆蓋掉全局的異常處理器；若是寫在全局異常處理器裡面，則會攔截所有Controller的異常，且不會被其他Controller裡面的異常處理器覆蓋掉。
}
