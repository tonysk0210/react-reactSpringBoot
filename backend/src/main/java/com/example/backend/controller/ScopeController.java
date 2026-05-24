package com.example.backend.controller;

import com.example.backend.scope.ApplicationScopedBean;
import com.example.backend.scope.RequestScopedBean;
import com.example.backend.scope.SessionScopedBean;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/scope")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class ScopeController {

    private final RequestScopedBean requestScopedBean;
    private final SessionScopedBean sessionScopedBean;
    private final ApplicationScopedBean applicationScopedBean;

    // 每次 HTTP 請求都會創建一個新的 RequestScopedBean 實例，因此在不同的請求中，requestScopedBean 的 userName 會是獨立的，不會互相干擾。
    @GetMapping("/request")
    public ResponseEntity<String> testRequestScope() {
        requestScopedBean.setUserName("Amy Lin");
        return ResponseEntity.ok().body("使用者: " + requestScopedBean.getUserName());
        // return 後「伺服器端完成這次 request 處理後，這個 request scope 就結束了」
    }

    // session 結束常見情況有：
    // 1. 使用者主動登出
    // 2. session 過期
    // 3. 伺服器重啟
    // 4. 瀏覽器端若 cookie/session id 丟失，之後通常會被當成新 session
    @GetMapping("/session")
    public ResponseEntity<String> testSessionScope() {
        sessionScopedBean.setUserName("Bill Lin");
        return ResponseEntity.ok().body("使用者: " + sessionScopedBean.getUserName());
    }

    // application scope 是在整個應用程式範圍內共享的，無論是同一個使用者的多次請求，還是不同使用者的請求，都會訪問同一個 ApplicationScopedBean 實例。因此，當一個使用者訪問 /application 時，visitorCount 會增加，並且這個增加對所有使用者都是可見的。
    @GetMapping("/application")
    public ResponseEntity<Integer> testApplicationScope() {
        applicationScopedBean.incrementVisitorCount(); // 每次訪問 /application 都會增加 visitorCount
        return ResponseEntity.ok().body(applicationScopedBean.getVisitorCount());
    }

    @GetMapping("/test")
    public ResponseEntity<String> testScope() {
        return ResponseEntity.ok().body("同一個 ScopeBean 裡的使用者/count: " + applicationScopedBean.getVisitorCount());
    }


}
