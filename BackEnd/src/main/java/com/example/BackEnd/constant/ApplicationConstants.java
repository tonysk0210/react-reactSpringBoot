package com.example.BackEnd.constant;

public class ApplicationConstants {

    private ApplicationConstants() {
        throw new AssertionError("Utility class 不可被實例化");
    }

    public static final String JWT_SECRET_KEY = "JWT_SECRET";
    public static final String JWT_SECRET_DEFAULT_VALUE = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4";
    public static final String JWT_HEADER = "Authorization";

    public static final String ORDER_STATUS_CONFIRMED = "CONFIRMED"; // Admin use
    public static final String ORDER_STATUS_CREATED = "CREATED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED"; // Admin use
}
