package com.example.BackEnd.service.impl;

import com.example.BackEnd.entity.Contact;
import com.example.BackEnd.payload.ContactPayload;
import com.example.BackEnd.repository.ContactRepo;
import com.example.BackEnd.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ContactServiceImpl implements ContactService {

    private final ContactRepo contactRepo;

    @Override
    public boolean saveContact(ContactPayload contactPayload) {
        try {
            Contact contact = new Contact();
            BeanUtils.copyProperties(contactPayload, contact); // 這行的作用是將 contactPayload 物件的屬性值複製到 contact 物件中。。
            contact.setCreatedAt(Instant.now());
            contact.setCreatedBy(contactPayload.getName());
            contactRepo.save(contact); // 返回值為 Contact 類型的物件，代表已經成功保存到資料庫中的 Contact 實體。這個物件包含了保存後的 Contact 實體的所有屬性值，包括自動生成的 ID 和其他欄位。
            return true;
        } catch (Exception e) { // 代表在執行 try 區塊中的程式碼時發生了任何異常，無論是什麼類型的異常，都會被捕獲並處理。
            return false;
        }
    }
}
