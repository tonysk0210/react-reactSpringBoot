import { createSlice } from "@reduxjs/toolkit";

const initialCart = JSON.parse(localStorage.getItem("cart")) || []; // 從 localStorage 中讀取購物車數據並解析成 JavaScript 對象

// 創建一個 Redux slice 來管理購物車狀態
const cartSlice = createSlice({
  name: "cart", // slice 的名稱
  initialState: initialCart, // 初始狀態
  // reducers 是一個對象，包含多個 reducer 函數
  reducers: {
    // addToCart() is not a normal function; it is a Redux action creator:
    // const addToCart = (payload) => ({ type: 'cart/addToCart', payload })

    // addToCart reducer 函數
    addToCart(currentState, action) {
      const { product, quantity } = action.payload;

      const existingItem = currentState.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        currentState.push({ ...product, quantity }); // 若購物車中沒有此產品，則將產品添加到購物車中 array.push(...) 是 JavaScript 陣列的語法。它的意思是：把一個或多個元素加到陣列最後面。
      }
    },

    // removeFromCart reducer 函數
    removeFromCart(currentState, action) {
      const { id } = action.payload;
      return currentState.filter((item) => item.id !== id);
    },

    // clearCart reducer 函數
    clearCart() {
      return [];
    },
  },
});

// 導出 actions 和 reducer
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// 提供對購物車數據的訪問
export const selectCartItems = (state) => state.cart; // 從 Redux 狀態中選擇購物車數據

// 提供對購物車總數量的訪問
export const selectTotalQuantity = (state) =>
  // 檢查 state.cart 是否為陣列，如果是則計算總數量，否則返回 0
  Array.isArray(state.cart)
    ? state.cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

// 提供對購物車總價格的訪問
export const selectTotalPrice = (state) =>
  // 檢查 state.cart 是否為陣列，如果是則計算總價格，否則返回 0
  Array.isArray(state.cart)
    ? state.cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
    : 0;
