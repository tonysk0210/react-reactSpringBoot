package com.example.BackEnd.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data // 這個註解會自動生成 getter、setter、toString、equals 和 hashCode 方法，讓代碼更簡潔
public class ContactPayload {
    @NotBlank(message = "名字是必填的")
    @Size(min = 2, max = 30, message = "名字必須在 2 到 30 個字符之間")
    private String name;

    @NotBlank(message = "電子郵件是必填的")
    @Email(message = "無效的電子郵件地址")
    private String email;

    @NotBlank(message = "手機號碼是必填的")
    @Pattern(regexp = "^\\d{10}$", message = "手機號碼必須是 10 位數字")
    private String mobileNumber;

    @NotBlank(message = "訊息是必填的")
    @Size(min = 5, max = 500, message = "訊息必須在 5 到 500 個字符之間")
    private String message;
}

