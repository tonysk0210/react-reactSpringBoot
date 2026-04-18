package com.example.BackEnd.service;

import com.example.BackEnd.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getProducts();
}
