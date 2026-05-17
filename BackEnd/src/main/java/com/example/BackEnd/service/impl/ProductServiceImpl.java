package com.example.BackEnd.service.impl;

import com.example.BackEnd.dto.ProductDto;
import com.example.BackEnd.entity.Product;
import com.example.BackEnd.repository.ProductRepo;
import com.example.BackEnd.service.ProductService;
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

    @Cacheable("products")
    @Override
    public List<ProductDto> getProducts() {
        List<Product> all = productRepo.findAll(); // findAll() 是 Spring Data JPA 提供的方法，用於從資料庫中檢索所有 Product 實體的列表。它會返回一個包含所有 Product 實體的 List<Product>。
        return all.stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    // BeanUtils.copyProperties() 是 Spring Framework 提供的一個工具方法，用於將一個物件的屬性值複製到另一個物件中。它會根據屬性的名稱和類型來匹配，並將值從 source 物件複製到 target 物件。
                    BeanUtils.copyProperties(product, productDto);
                    return productDto;
                })
                .toList(); // toList() 是 Java 16 引入的一個方法，用於將 Stream 中的元素收集到一個不可變的 List 中。
    }
}
