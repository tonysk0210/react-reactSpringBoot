package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/csrf-token")
public class CsrfController {

    @GetMapping
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        // .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
        // 這會讓 Spring Security 的 CSRF filter 把 CsrfToken 放進 HttpServletRequest 的 attribute 裡
    }
}
