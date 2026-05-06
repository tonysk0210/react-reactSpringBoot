package com.example.BackEnd.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestPayload(

        @NotBlank(message = "名字不可空白")
        @Size(min = 2, max = 30, message = "名字必須在 2 到 30 個字符之間")
        String name,

        @NotBlank(message = "email不可空白")
        @Email(message = "無效的電子郵件地址")
        String email,

        @NotBlank(message = "手機不可空白")
        @Pattern(regexp = "^\\d{10}$", message = "手機號碼必須是 10 位數字")
        String mobileNumber,

        @NotBlank(message = "密碼不可空白")
        @Size(min = 4, max = 20, message = "訊息必須在 4 到 20 個字符之間")
        String password
) {
}
