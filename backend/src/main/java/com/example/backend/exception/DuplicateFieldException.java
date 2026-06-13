package com.example.backend.exception;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
// 用來表示重複欄位的例外
public class DuplicateFieldException extends RuntimeException {
    private final Map<String, List<String>> errors; // 用來存儲重複欄位的錯誤信息

    public DuplicateFieldException(Map<String, List<String>> errors) {
        super("Duplicate field values");
        this.errors = errors;
    }
}
