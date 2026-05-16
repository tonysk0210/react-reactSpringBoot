package com.example.BackEnd.service;

import com.example.BackEnd.dto.ContactResponseDto;
import com.example.BackEnd.payload.ContactPayload;

import java.util.List;

public interface ContactService {
    boolean saveContact(ContactPayload contactPayload);

    List<ContactResponseDto> getAllOpenMessages();

    void updateMessageStatus(Long contactId, String status);
}
