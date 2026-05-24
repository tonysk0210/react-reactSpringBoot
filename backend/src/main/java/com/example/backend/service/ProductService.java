package com.example.backend.service;

import com.example.backend.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getProducts();
}
