package com.example.BackEnd.service.impl;

import com.example.BackEnd.constant.ApplicationConstants;
import com.example.BackEnd.dto.ContactResponseDto;
import com.example.BackEnd.entity.Contact;
import com.example.BackEnd.exception.ResourceNotFoundException;
import com.example.BackEnd.payload.ContactPayload;
import com.example.BackEnd.repository.ContactRepo;
import com.example.BackEnd.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ContactServiceImpl implements ContactService {

    private final ContactRepo contactRepo;

    @Override
    public boolean saveContact(ContactPayload contactPayload) {
        Contact contact = new Contact();
        BeanUtils.copyProperties(contactPayload, contact); // 這行的作用是將 contactPayload 物件的屬性值複製到 contact 物件中。。
        // contact.setCreatedAt(Instant.now()); // AuditorAware
        // contact.setCreatedBy(contactPayload.getName()); // AuditorAware

        // 2. 設定狀態為 OPEN
        contact.setStatus(ApplicationConstants.OPEN_MESSAGE);
        contactRepo.save(contact); // 返回值為 Contact 類型的物件，代表已經成功保存到資料庫中的 Contact 實體。這個物件包含了保存後的 Contact 實體的所有屬性值，包括自動生成的 ID 和其他欄位。
        return true;
    }

    @Override
    public List<ContactResponseDto> getAllOpenMessages() {
        // 1. 從資料庫中查詢所有狀態為 OPEN 的 Contact 資料
        List<Contact> contacts = contactRepo.findByStatus(ApplicationConstants.OPEN_MESSAGE);
        // 2. 將 Contact 資料轉換成 ContactResponseDto 資料
        return contacts.stream().map(this::mapToContactResponseDTO).collect(Collectors.toList());
    }


    @Override
    public void updateMessageStatus(Long contactId, String status) {
        // 1. 根據 contactId 查找 Contact 資料
        Contact contact = contactRepo.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "ContactID", contactId.toString()));
        // 2. 更新 Contact 資料
        contact.setStatus(status);
        // 3. 儲存更新後的 Contact 資料
        contactRepo.save(contact);
    }

    // Helper method : 將 Contact 轉換成 ContactResponseDto
    private ContactResponseDto mapToContactResponseDTO(Contact contact) {
        ContactResponseDto dto = new ContactResponseDto(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getMobileNumber(),
                contact.getMessage(),
                contact.getStatus()
        );
        return dto;
    }
}
