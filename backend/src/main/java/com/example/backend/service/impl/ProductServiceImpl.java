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
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;

    /**
     * cache name: products
     * key: SimpleKey.EMPTY
     * value: List<ProductDto>
     * <p>
     * 也就是 products cache 裡只有一份 getProducts() 的結果。
     * <p>
     * products
     * └── SimpleKey.EMPTY -> List<ProductDto>
     */
    
    // 快取 getProducts() 的回傳結果；快取命中時直接回傳，不再查詢資料庫。此 cache 由 Caffeine 存在 JVM memory，30 分鐘後過期
    @Cacheable("products")
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
