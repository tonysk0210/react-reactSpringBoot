package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 當後端要查某個資料，但資料庫找不到時，主動丟出一個代表「資源不存在」的例外，最後回給前端 HTTP 404
 */
// 當這個 exception 沒有被其他 @ExceptionHandler 攔截時，Spring 會自動把 HTTP response status 設成 404。
@ResponseStatus(value = HttpStatus.NOT_FOUND) // status code: 404
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("找不到符合條件的 %s，欄位 %s 的值為 '%s'",
                resourceName, fieldName, fieldValue));
    }
}
