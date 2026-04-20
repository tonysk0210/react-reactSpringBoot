package com.example.BackEnd.service;

import com.example.BackEnd.payload.ContactPayload;

public interface ContactService {
    boolean saveContact(ContactPayload contactPayload);
}
