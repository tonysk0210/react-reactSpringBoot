package com.example.backend.controller;

import com.example.backend.dto.ContactInfoDto;
import com.example.backend.payload.ContactPayload;
import com.example.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ContactController {

    private final ContactService contactService;
    private final ContactInfoDto contactInfoDto; // 聯繫信息 DTO 做 autowiring

    /**
     * 儲存請求內容中提供的聯繫資訊。
     *
     * @param contactPayload 包含姓名、電子郵件、手機號碼與訊息等聯繫詳細資料的 {@link ContactPayload} 物件。
     *                       系統會對此 payload 進行驗證，以確保其符合定義的約束條件。
     * @return 如果聯繫資訊成功儲存，則回傳包含成功訊息的 {@link ResponseEntity}；如果儲存過程發生失敗，
     * 則拋出例外並交由全域錯誤處理產生錯誤回應。
     */
    @PostMapping("/contacts")
    public ResponseEntity<String> saveContact(@Valid @RequestBody ContactPayload contactPayload) {
        // (@Valid = 驗證「物件」) 前端送 JSON → @RequestBody 幫你變成 Java 物件; @Valid 會幫你驗證這個 Java 物件裡面的資料是否符合 ContactPayload 裡面定義的驗證規則，如果不符合，Spring 會自動返回一個包含錯誤訊息的 JSON 格式的響應給前端。

        boolean isSaved = contactService.saveContact(contactPayload);
        if (isSaved) {
            return ResponseEntity.status(HttpStatus.CREATED).body("聯繫信息已成功保存! from API");
        } else {
            throw new RuntimeException("哎呀，出錯了！請重試一次，若問題持續請聯絡技術團隊 from API"); // 這會給到全局異常處理器，然後全局異常處理器會捕獲到這個 RuntimeException，並返回一個包含錯誤訊息的 JSON 格式的響應給前端。
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<ContactInfoDto> getContactInfo() {
        return ResponseEntity.ok(contactInfoDto);
    }
}
