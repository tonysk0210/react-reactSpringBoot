package com.example.BackEnd.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileRequestPayload {

    @NotBlank(message = "名字不可空白")
    @Size(min = 2, max = 30, message = "名字必須在 2 到 30 個字符之間")
    private String name;

    @NotBlank(message = "email不可空白")
    @Email(message = "無效的電子郵件地址")
    private String email;

    @NotBlank(message = "手機不可空白")
    @Pattern(regexp = "^\\d{10}$", message = "手機號碼必須是 10 位數字")
    private String mobileNumber;

    @NotBlank(message = "街名不可空白")
    @Size(min = 5, max = 50, message = "街名必須在 5 到 50 個字符之間")
    private String street;

    @NotBlank(message = "城市不可空白")
    @Size(min = 3, max = 30, message = "城市必須在 3 到 30 個字符之間")
    private String city;

    @NotBlank(message = "州/省不可空白")
    @Size(min = 2, max = 30, message = "州/省必須在 2 到 30 個字符之間")
    private String state;

    @NotBlank(message = "郵遞區號不可空白")
    @Pattern(regexp = "^\\d{5}$", message = "郵遞區號必須是 5 位數字")
    private String postalCode;

    @NotBlank(message = "國家不可空白")
    @Size(min = 2, max = 30, message = "國家必須在 2 到 30 個字符之間")
    private String country;
}
