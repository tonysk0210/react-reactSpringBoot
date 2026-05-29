package com.example.backend.service.impl;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepo;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired) // 只會產生一個包含 final 欄位的建構子，並且使用 @Autowired 來自動注入依賴
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;

    @Cacheable("products") // 代表這個方法的結果會被緩存，下次呼叫時會從緩存中返回
    @Override
    public List<ProductDto> getProducts() {

        // 1. 從資料庫中查詢所有商品
        List<Product> all = productRepo.findAll();

        // 2. 將 Product 轉換成 ProductDto
        return all.stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    BeanUtils.copyProperties(product, productDto);
                    return productDto;
                })
                .toList();
    }
}
