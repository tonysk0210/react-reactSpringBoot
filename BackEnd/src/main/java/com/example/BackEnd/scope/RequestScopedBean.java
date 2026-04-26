package com.example.BackEnd.scope;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// 定義一個 「每個 HTTP request 都會建立一個新的 Bean」。
// 這意味著每當有一個新的 HTTP 請求進來時，Spring 都會創建一個新的 RequestScopedBean 實例，並且在該請求結束後，這個實例將被銷毀。
// 這種作用域非常適合用於存儲與當前請求相關的數據，例如用戶信息、請求參數等，確保每個請求都有自己的獨立數據，不會互相干擾。
@RequestScope
@Component
@Data
@Slf4j
public class RequestScopedBean {
    private String userName;

    public RequestScopedBean() {
        log.info("RequestScopedBean 初始化");
    }
}
