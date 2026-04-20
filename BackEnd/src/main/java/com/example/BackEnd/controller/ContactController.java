package com.example.BackEnd.controller;

import com.example.BackEnd.payload.ContactPayload;
import com.example.BackEnd.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public String saveContact(@RequestBody ContactPayload contactPayload) {
        // 前端送 JSON → @RequestBody 幫你變成 Java 物件

        boolean isSaved = contactService.saveContact(contactPayload); // 這行的作用是調用 contactService 的 saveContact 方法，並將 contactPayload 作為參數傳遞給該方法。
        // 這個方法的返回值是一個 boolean 類型的變量 isSaved，用於表示保存聯繫信息是否成功。
        if (isSaved) {
            return "請求已成功處理";
        } else {
            return "發生錯誤，請稍後再試或聯絡開發團隊";
        }
    }
}
