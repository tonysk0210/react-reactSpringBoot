package com.example.backend.service.impl;

import com.example.backend.dto.ProfileResponseDto;
import com.example.backend.entity.Address;
import com.example.backend.entity.Customer;
import com.example.backend.payload.ProfileRequestPayload;
import com.example.backend.repository.CustomerRepo;
import com.example.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ProfileServiceImpl implements ProfileService {

    private final CustomerRepo customerRepo;

    @Override
    public ProfileResponseDto getProfile() {
        // 1. 取得當前登入用戶的 Customer 物件
        Customer customer = getAuthenticatedCustomer();

        // 2. 將 customer 物件轉換成 ProfileResponseDto 物件
        return mapCustomerToProfileResponseDto(customer);
    }

    @Override
    public ProfileResponseDto updateProfile(ProfileRequestPayload profileRequestPayload) {
        // 1. 取得當前登入用戶的 Customer 物件
        Customer customer = getAuthenticatedCustomer();

        // 2. 檢查 email 是否有更新：比對原始 email 與更新後的 email
        boolean isEmailUpdated = !customer.getEmail().equals(profileRequestPayload.getEmail().trim());

        // 3. 複製 profileRequestPayload 的屬性值到 customer 物件中
        BeanUtils.copyProperties(profileRequestPayload, customer);

        // 4. 取得 customer 的 Address 物件，如果不存在則建立一個新的 Address 物件
        Address address = customer.getAddress();
        if (address == null) {
            address = new Address();
            address.setCustomer(customer); // owning side，負責資料庫外鍵
        }
        address.setStreet(profileRequestPayload.getStreet());
        address.setCity(profileRequestPayload.getCity());
        address.setState(profileRequestPayload.getState());
        address.setPostalCode(profileRequestPayload.getPostalCode());
        address.setCountry(profileRequestPayload.getCountry());
        customer.setAddress(address); // inverse side，維持 Java 物件一致性

        // 5. 保存 customer 物件到資料庫
        customer = customerRepo.save(customer);

        // 6. 將更新後的 customer 物件轉換成 ProfileResponseDto 物件
        ProfileResponseDto profileResponseDto = mapCustomerToProfileResponseDto(customer);
        profileResponseDto.setEmailUpdated(isEmailUpdated);
        return profileResponseDto;
    }

    // Helper method : 取得當前登入用戶的 Customer 物件
    public Customer getAuthenticatedCustomer() {
        // 1. 取得當前登入用戶的 Customer 物件
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. 從 Authentication 物件中取得 username (email)
        String email = authentication.getName();

        // 3. 根據 email 從資料庫查詢 Customer 物件，如果找不到就丟出 UsernameNotFoundException
        return customerRepo.findByEmail(email).
                orElseThrow(() -> new UsernameNotFoundException("無法找到該使用者: " + email));
    }

    // Helper method : 將 Customer 轉換成 ProfileResponseDto
    private ProfileResponseDto mapCustomerToProfileResponseDto(Customer customer) {
        // 1. 建立 ProfileResponseDto 物件
        ProfileResponseDto profileResponseDto = new ProfileResponseDto();

        // 2. 複製 customer 的屬性值到 profileResponseDto 物件中
        BeanUtils.copyProperties(customer, profileResponseDto); // 將 customer 物件的屬性值複製到 profileResponseDto 物件中

        // 3. 複製 customer.address 的屬性值到 profileResponseDto.AdressDto 物件中
        if (customer.getAddress() != null) {
            ProfileResponseDto.AddressDto addressDto = new ProfileResponseDto.AddressDto();
            BeanUtils.copyProperties(customer.getAddress(), addressDto);
            // 設定 profileResponseDto 的 address 屬性為 addressDto
            profileResponseDto.setAddress(addressDto);
        }
        return profileResponseDto;
    }

}
