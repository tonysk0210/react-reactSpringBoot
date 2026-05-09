package com.example.BackEnd.dto;

import lombok.Data;

@Data
public class ProfileResponseDto {

    private String name;
    private String email;
    private String mobileNumber;
    private AddressDto address;
    private boolean emailUpdated;

    @Data
    public static class AddressDto {
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;
    }
}