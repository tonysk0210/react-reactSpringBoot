import { createContext, useEffect, useContext, useReducer } from "react";

// 1. 定義 CartContext 和 useCart custom hook；被 CartProvider 包住的元件可以透過 useCart 取得購物車狀態和操作方法
const CartContext = createContext(null);
export const useCart = () => {
  return useContext(CartContext); // 這裡只是定義 custom hook；真正呼叫 useCart() 時，仍必須在 component 或另一個 custom hook 裡
};

// 從 localStorage 中讀取購物車數據
const initialCartState = (() => {
  try {
    const storedCartJson = localStorage.getItem("cart");
    return storedCartJson ? JSON.parse(storedCartJson) : []; // 如果 localStorage 中有存儲的購物車數據，就解析成 JavaScript 對象並返回，否則就返回一個空數組
  } catch (error) {
    console.error("無法解析 localStorage 中的購物車數據:", error);
    return [];
  }
})(); // 定義完馬上執行，從 localStorage 取得購物車初始狀態；真正的持久化寫入在下面的 useEffect

const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CLEAR_CART = "CLEAR_CART";

// **useReducer** 2. 定義購物車狀態的更新函式 寫在 CartProvider 外部，讓狀態更新邏輯集中管理；useState 也能做到，但複雜操作較容易分散
const cartReducer = (currentState, action) => {
  // reducer 函式接收當前的狀態和一個 action 物件作為參數，然後根據 action.type 的值來決定如何更新 cart 狀態
  switch (action.type) {
    // 加入購物車邏輯
    case ADD_TO_CART: {
      // 1. 從 action.payload 中獲取產品和數量
      const { product, quantity } = action.payload;

      // 2. 檢查購物車中是否已經有這個產品了
      const existingItem = currentState.find((item) => item.id === product.id);

      // 3. 如果有的話就更新它的數量，否則就將它添加到購物車中
      if (existingItem) {
        return currentState.map(
          (item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity } // 現有的產品的數量增加傳入的數量
              : item, // 若不是目標商品的其他商品，就不要改它
        );
      }
      return [...currentState, { ...product, quantity }]; // 商品不存在於購物車，就將它添加到購物車中
    }
    // 移除購物車邏輯
    case REMOVE_FROM_CART:
      return currentState.filter((item) => item.id !== action.payload.id); // 移除指定 id 的商品; action.payload 是一個物件，包含 id 屬性

    /**
     * 例如你 dispatch 這樣：
     * 
     * dispatch({
          type: REMOVE_FROM_CART,
          payload: { id: productId },
        });

        那 reducer 收到的 action 會長這樣：
        {
          type: "REMOVE_FROM_CART",
          payload: { id: 123 }
        }
      **/

    // 清空購物車邏輯
    case CLEAR_CART:
      return [];
    default:
      return currentState; // 其他情況下返回當前狀態，不改變 cart 狀態
  }
};

// 這是一個 Context Provider 組件，用於提供購物車的狀態和操作方法，當用戶在應用中使用 CartProvider 包裹住其他組件時，這些組件就可以通過 useCart 這個 custom hook 來訪問和修改購物車的狀態了。
export const CartProvider = ({ children }) => {
  // **useReducer** 3. 使用 useReducer hook 來管理購物車狀態
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // 使用 useEffect hook 來監聽購物車狀態的變化，並將其保存到 localStorage 中，這樣就可以實現購物車數據的持久化了。
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart)); // 將 cart 數據轉換成 JSON 字符串並存儲到 localStorage 中，這樣就可以實現購物車數據的持久化了。
    } catch (error) {
      console.error("無法將購物車數據保存到 localStorage:", error);
    }
  }, [cart]);

  // 定義一些操作購物車的方法，這些方法會使用 dispatch 來觸發對應的 action，從而更新購物車的狀態
  const addToCart = (product, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: { id: productId } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // 使用 reduce 方法來計算購物車中所有項目的總數量，這裡我們將 acc 初始化為 0，然後對 cart 中的每一個項目進行累加，將它們的 quantity 屬性的值加到 acc 上，最後返回 acc 的值，這樣就可以得到購物車中所有項目的總數量了。
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 使用 reduce 方法來計算購物車中所有項目的總價格，這裡我們將 acc 初始化為 0，然後對 cart 中的每一個項目進行累加，將它們的 quantity 屬性和 price 屬性的乘積加到 acc 上，最後返回 acc 的值，這樣就可以得到購物車中所有項目的總價格了。
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );

  // 使用 CartContext.Provider 組件來提供購物車上下文的值， 將 cart、addToCart、removeFromCart、totalQuantity、totalPrice、clearCart 作為 value 傳入，這樣在子組件中就可以通過 useCart() 來訪問這些值了。
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart, // 替代了 setCart，因為我們現在使用 useReducer 來管理購物車狀態了，所以不需要直接暴露 setCart 這個函式了，而是提供一些更具體的操作方法，例如 addToCart、removeFromCart 和 clearCart，這些方法會使用 dispatch 來觸發對應的 action，從而更新購物車的狀態了。
        removeFromCart, // 同上，替代了 setCart
        totalQuantity,
        totalPrice,
        clearCart, // 同上，替代了 setCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
