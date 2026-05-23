import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";

// 配置 Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// 當 store 中的狀態變化時，將購物車數據保存到 localStorage
store.subscribe(() => {
  try {
    // CART persistence
    const cart = store.getState().cart; // 1. 從 store 中獲取購物車數據
    localStorage.setItem("cart", JSON.stringify(cart)); // 2. 將購物車數據轉換成 JSON 字符串並存儲到 localStorage 中
  } catch (error) {
    console.error("無法將購物車數據保存到 localStorage:", error);
  }
});

export default store;
