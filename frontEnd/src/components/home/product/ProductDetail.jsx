import React from "react";
import { useParams } from "react-router-dom"; // 從 react-router-dom 庫中引入 useParams 這個 Hook，用於獲取 URL 中的參數。

export default function ProductDetail() {
  const params = useParams(); // 使用 useParams Hook 獲取 URL 中的參數，並將其存儲在 params 變量中。這些參數通常是在路由定義中指定的，例如 /products/:id，其中 :id 就是一個參數。
  return <div>ProductDetail {params.productId}</div>;
}
