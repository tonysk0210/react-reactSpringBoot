package com.example.backend.scope;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// 定義 request scope bean：每個 HTTP request 都會有自己獨立的 RequestScopedBean 實例。
// 在同一個 request 期間，取用到的是同一個實例；不同 request 會取得不同實例。
// 若此 bean 被注入到 singleton bean（例如 Controller），Spring 會透過 scoped proxy 在每次 request 中解析出當前 request 對應的實例。
// request 結束後，該 request scope 內的實例會結束生命週期。
// 適合暫存只屬於當前 request 的資料，例如目前使用者、request metadata、流程中間狀態等。
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
