package com.example.backend.scope;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

// 定義一個 「每個 HTTP session 都會建立一個新的 Bean」。
// 這意味著每當有一個新的 HTTP session 被創建時，Spring 都會創建一個新的 SessionScopedBean 實例，並且在該 session 結束後，這個實例將被銷毀。
// 這種作用域非常適合用於存儲與當前 session 相關的數據，例如用戶信息、購物車內容等，確保每個 session 都有自己的獨立數據，不會互相干擾。
@Component
@SessionScope
@Data
@Slf4j
public class SessionScopedBean {
    private String userName;

    public SessionScopedBean() {
        log.info("SessionScopedBean 初始化");
    }
}
