package com.example.backend.service;

import com.example.backend.dto.ContactResponseDto;
import com.example.backend.payload.ContactPayload;

import java.util.List;

public interface ContactService {
    boolean saveContact(ContactPayload contactPayload);

    List<ContactResponseDto> getAllOpenMessages();

    void updateMessageStatus(Long contactId, String status);
}
