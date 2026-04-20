package com.example.BackEnd.payload;

import lombok.Data;

@Data // 這個註解會自動生成 getter、setter、toString、equals 和 hashCode 方法，讓代碼更簡潔
public class ContactPayload {
    private String name;
    private String email;
    private String mobileNumber;
    private String message;
}

