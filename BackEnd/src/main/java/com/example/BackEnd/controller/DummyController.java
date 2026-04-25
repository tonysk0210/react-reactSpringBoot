package com.example.BackEnd.controller;

import com.example.BackEnd.payload.ContactPayload;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dummy")
public class DummyController {

    // 1. @RequestParam 是用來從 HTTP 請求中獲取參數的註解。它可以用在方法的參數上，告訴 Spring 框架從請求中提取對應的參數值。
    @GetMapping("/param")
    public String param(@RequestParam(name = "q") String q, @RequestParam(required = false, defaultValue = "param", name = "p") String p) {
        // @RequestParam 是用來從 HTTP 請求中獲取參數的註解。它可以用在方法的參數上，告訴 Spring 框架從請求中提取對應的參數值。
        // 在這個例子中，@RequestParam(name = "q") String q 表示從請求中獲取名為 "q" 的參數值，並將其賦值給方法參數 q。這個參數是必須的，如果請求中沒有提供 "q" 參數，則會返回錯誤。
        // @RequestParam(required = false, defaultValue = "param", name = "p") String p 表示從請求中獲取名為 "p" 的參數值，這個參數是可選的，如果請求中沒有提供 "p" 參數，則使用默認值 1。
        return "你搜尋了: " + q + "，頁碼是: " + p;
    }

    @GetMapping("/multiple-param")
    public String multipleParam(@RequestParam Map<String, String> params) {
        // @RequestParam Map<String, String> params 表示從請求中獲取所有的參數，並將它們存儲在一個 Map 中，其中鍵是參數的名稱，值是參數的值。這樣你就可以動態地處理任意數量的參數，而不需要在方法簽名中明確列出每個參數。
        return "尋找使用者: " + params.get("firstName") + " " + params.get("lastName");
    }

    // 2. @PathVariable 是用來從 URL 路徑中獲取參數的註解。它可以用在方法的參數上，告訴 Spring 框架從 URL 路徑中提取對應的參數值。
    @GetMapping({"/user/{pathVariable}"})
    public String pathVariable(@PathVariable(name = "pathVariable") String pathVariable) {
        return "尋找使用者 : " + pathVariable;
    }

    @GetMapping({"/multiple/{pv1}/posts/{pv2}", "/multiple/{pv1}"})
    public String multiplePathVariable(@PathVariable Map<String, String> pathVariables) {
        // @PathVariable Map<String, String> pathVariables 表示從 URL 路徑中獲取所有的路徑變量，並將它們存儲在一個 Map 中，其中鍵是路徑變量的名稱，值是路徑變量的值。這樣你就可以動態地處理任意數量的路徑變量，而不需要在方法簽名中明確列出每個路徑變量。
        return "尋找 pv1 : " + pathVariables.get("pv1") + " and pv2 : " + pathVariables.get("pv2");
    }


    // 3. @RequestHeader 是用來從 HTTP 請求的標頭中獲取參數的註解。它可以用在方法的參數上，告訴 Spring 框架從請求的標頭中提取對應的參數值。
    @GetMapping("/headers")
    public String readHeaders(@RequestHeader HttpHeaders headers) {
        List<String> userAgent = headers.get("User-Agent"); // 這行的作用是從 HTTP 請求的標頭中獲取名為 "User-Agent" 的標頭值，並將其存儲在一個 List<String> 中。這是因為一個 HTTP 請求可能包含多個 "User-Agent" 標頭，因此使用 List 來存儲所有的值。
        return "接收 headers 值 : " + headers + " 和 user-agent 值: " + userAgent;
        // headers 型別是 HttpHeaders，這是一個 Spring 框架提供的類，用於表示 HTTP 請求或響應中的標頭信息。它提供了方便的方法來獲取和操作標頭數據，例如 get() 方法可以用來獲取特定標頭的值。
        // headers 這個變量包含了請求中的所有標頭信息，而 userAgent 這個變量則專門存儲了 "User-Agent" 標頭的值。這樣你就可以在方法中使用這些標頭信息來進行相應的處理，例如根據用戶代理來決定返回不同的內容或者進行特定的邏輯處理。
    }

    // 4. RequestEntity 是 Spring 框架提供的一個類，用於表示 HTTP 請求的完整信息，包括標頭、主體和其他相關數據。通過使用 RequestEntity，你可以在控制器方法中同時獲取請求的標頭和主體內容，這對於需要處理複雜請求的情況非常有用。例如，你可以根據請求的標頭來決定如何處理請求，或者根據主體內容來執行特定的業務邏輯。
    @PostMapping("/request-entity")
    public String createUserWithEntity(RequestEntity<ContactPayload> requestEntity) {
        HttpHeaders header = requestEntity.getHeaders(); // 取得 HTTP 請求的標頭信息，並將其存儲在一個 HttpHeaders 變量中。
        ContactPayload contactPayload = requestEntity.getBody(); // 取得 HTTP 請求的主體內容，並將其轉換為 ContactPayload 類型的 Java 物件。
        URI url = requestEntity.getUrl(); // 取得 HTTP 請求的 URL 信息，並將其存儲在一個 URI 變量中。
        return "使用 RequestEntity 接收請求，headers : \n" + header + "\n 和 body : \n" + contactPayload + "\n 和 url : \n" + url;

        /*
        {
          "name": "王小明",
          "email": "xiaoming.wang@example.com",
          "mobileNumber": "0912345678",
          "message": "你好，我想詢問關於後端課程的詳細資訊，謝謝！"
        }
        */
    }


}
