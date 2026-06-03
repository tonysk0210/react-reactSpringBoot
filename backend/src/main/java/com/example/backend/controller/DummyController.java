package com.example.backend.controller;

import com.example.backend.payload.ContactPayload;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dummy")
@Validated // (@Validated = 啟動「方法驗證」) 啟用 Spring 的 Method Validation（方法級驗證，這讓 @RequestParam , @PathVariable 上的 @Size 這類驗證註解生效
public class DummyController {

    // 1-1. 這個 API 接收 p 和 q 兩個 query 參數，其中 p 必填且長度必須是 5 到 30，q 可選，沒給的話預設為 "param"
    // GET /api/v1/dummy/param?q=springboot&p=2
    @GetMapping("/param")
    public String param(@Size(min = 5, max = 30, message = "p 長度必須介於 5 到 30 個字元") @RequestParam(name = "p") String p, @RequestParam(required = false, defaultValue = "param", name = "q") String q) {
        return "你搜尋了: " + p + "，頁碼是: " + q;
    }

    // 1-2. 這個 API 接收 用 Map 一次接收所有 query parameters。
    // GET /api/v1/dummy/multiple-param?firstName=Tony&lastName=Shangkuan
    @GetMapping("/multiple-param")
    public String multipleParam(@RequestParam Map<String, String> params) {
        return "尋找使用者: " + params.get("firstName") + " " + params.get("lastName");
    }

    // 2-1. 這個 API 接收一個路徑變量 pathVariable
    // GET /api/v1/dummy/user/{pathVariable}
    @GetMapping({"/user/{pathVariable}"})
    public String pathVariable(@PathVariable(name = "pathVariable") String pathVariable) {
        return "尋找使用者 : " + pathVariable;
    }

    // 2-2. 這個 API 接收多個路徑變量
    // GET /api/v1/dummy/multiple/{pv1}/posts/{pv2}
    // GET /api/v1/dummy/multiple/{pv1}
    @GetMapping({"/multiple/{pv1}/posts/{pv2}", "/multiple/{pv1}"})
    public String multiplePathVariable(@PathVariable Map<String, String> pathVariables) {
        return "尋找 pv1 : " + pathVariables.get("pv1") + " and pv2 : " + pathVariables.get("pv2");
    }


    /**
     * HttpHeaders:
     * User-Agent: Mozilla/5.0
     * Accept: application/json
     * Authorization: Bearer xxx
     * Content-Type: application/json
     */
    // 3-1. @RequestHeader 是用來從 HTTP 請求的標頭中獲取參數的註解。它可以用在方法的參數上，告訴 Spring 框架從請求的標頭中提取對應的參數值。
    @GetMapping("/headers")
    public String readHeaders(@RequestHeader HttpHeaders headers) {
        List<String> userAgent = headers.get("User-Agent"); // 取得 HTTP 請求的標頭信息，並將其存儲在一個 List<String> 變量中。
        return "接收 headers 值 : " + headers + " 和 user-agent 值: " + userAgent;
    }

    // 4-1. RequestEntity 是 Spring 框架提供的一個類，用於表示 HTTP 請求的完整信息，包括標頭、主體和其他相關數據
    @PostMapping("/request-entity")
    public String createUserWithEntity(RequestEntity<ContactPayload> requestEntity) {
        HttpHeaders header = requestEntity.getHeaders(); // 取得 HTTP 請求的標頭信息
        ContactPayload contactPayload = requestEntity.getBody(); // 取得 HTTP 請求的主體內容
        URI url = requestEntity.getUrl(); // 取得 HTTP 請求的 URL 信息
        return "使用 RequestEntity 接收請求，headers : \n" + header + "\n 和 body : \n" + contactPayload + "\n 和 url : \n" + url;
    }


}
