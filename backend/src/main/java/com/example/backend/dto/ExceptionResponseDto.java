package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor // 建立一個包含所有欄位的建構子，這樣在創建 ExceptionResponseDto 對象時，可以直接傳入所有必要的參數，而不需要手動設置每個欄位。包含了 apiPath、errorCode、errorMessage 和 errorTime 四個欄位的建構子。
public class ExceptionResponseDto {
    private String apiPath;
    private HttpStatus errorCode;
    private String errorMessage;
    private LocalDateTime errorTime;
}
