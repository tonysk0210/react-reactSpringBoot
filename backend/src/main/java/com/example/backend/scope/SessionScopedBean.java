package com.example.backend.scope;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

// 定義 session scope bean：每個 HTTP session 都會有自己獨立的 SessionScopedBean 實例。
// 在同一個 session 期間，多次 request 取用到的是同一個實例；不同 session 會取得不同實例。
// 若此 bean 被注入到 singleton bean（例如 Controller），Spring 會透過 scoped proxy 在每次 request 中解析出目前 session 對應的實例。
// 該 bean 通常會在 session 第一次取用時建立，並在 session 失效、過期或被清除時結束生命週期。
// 適合存放與目前 session 相關的暫態資料，例如購物車、精簡的使用者狀態、流程狀態等。
@SessionScope
@Component
@Data
@Slf4j
public class SessionScopedBean {
    private String userName;

    public SessionScopedBean() {
        log.info("SessionScopedBean 初始化");
    }
}
