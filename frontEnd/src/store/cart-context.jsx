import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react"; // 引入 createContext 函式；這個函式是 React 中用於創建一個新的 Context 對象的函式，Context 是 React 中用於在組件樹中傳遞數據的一種方式，可以讓你在組件之間共享數據，而不需要通過 props 一層一層地傳遞。
// useReducer 是 React 中的一個 hook，用於管理複雜的狀態邏輯，它接收一個 reducer 函式和初始狀態，並返回當前狀態和一個 dispatch 函式。

// 定義購物車上下文的初始值，這裡是一個空對象，可以根據需要添加購物車的狀態和方法，例如：items、addItem、removeItem 等等
// const initialCartContext = {
//   cart: [],
//   setCart: () => {},
//   addToCart: () => {
//     console.log("addToCart function is not implemented yet.");
//   },
//   removeFromtCart: () => {},
//   totalQuantity: 0,
// };

// **useReducer** 1. 從 localStorage 中讀取購物車數據
const initialKartState = (() => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : []; // 如果 localStorage 中有存儲的購物車數據，就解析成 JavaScript 對象並返回，否則就返回一個空數組
  } catch (error) {
    console.error("無法解析 localStorage 中的購物車數據:", error);
    return [];
  }
})(); // 定義完馬上執行

// **useReducer** 定義購物車狀態的更新函式類型 action typeX
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CLEAR_CART = "CLEAR_CART";

// **useReducer** 2. 定義購物車狀態的更新函式 寫在 CartProvider 組件外部 這樣可以比較好維護和測試 useState 就不行了
const kartReducer = (currentState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { product, quantity } = action.payload; // 從 action.payload 中解構出 product 和 quantity
      // 檢查購物車中是否已經有這個產品了，如果有的話就更新它的數量，否則就將它添加到購物車中
      const existingItem = currentState.find((item) => item.id === product.id);

      if (existingItem) {
        // 如果購物車中已經有這個產品了，就更新它的數量，這裡我們使用了 map 方法來遍歷 currentState 中的每一個項目，如果項目的 productId 和當前要添加的產品的 productId 相同，那麼就返回一個新的項目對象，這個對象包含了原來的項目屬性，但是將 quantity 屬性的值增加了傳入的 quantity，否則就返回原來的項目對象，這樣就可以實現更新購物車中已有產品的數量了。
        return currentState.map(
          (item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity } // 如果項目的 productId 和當前要添加的產品的 productId 相同，那麼就返回一個新的項目對象，這個對象包含了原來的項目屬性，但是將 quantity 屬性的值增加了傳入的 quantity; ...item 展開的是「這個 item 物件裡的所有屬性（attributes）」--，然後我們在這個新的對象中覆蓋了 quantity 屬性，將它的值設置為 item.quantity + quantity，這樣就實現了更新購物車中已有產品的數量了。
              : item, // 否則就返回原來的項目對象
        );
      }
      return [...currentState, { ...product, quantity }]; // 如果購物車中沒有這個產品，就將它添加到購物車中
    case REMOVE_FROM_CART:
      return currentState.filter((item) => item.id !== action.payload.id); // 移除指定 id 的商品; action.payload 是一個物件，包含 id 屬性
    case CLEAR_CART:
      return [];
    default:
      return currentState; // 其他情況下返回當前狀態 不改變 kart 狀態
  }
};

export const CartContext = createContext(); // 使用 createContext 函式來創建一個新的 Context 對象，並且將其賦值給 CartContext 變量，這樣就可以在其他組件中使用 CartContext 來訪問和修改購物車的狀態了。

// 這是一個 custom hook，用於在組件中訪問 CartContext 中的 cart 狀態，這個狀態是用來存儲購物車中的商品的，當用戶點擊「加入購物車」按鈕時，就會調用 addToCart 方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。
export const useCart = () => {
  return useContext(CartContext);
};

// 定義 CartProvider 組件，這個組件用於提供購物車上下文的值，這裡我們將 initialCartContext 作為 value 傳入 CartContext.Provider 組件，這樣在整個應用程式中就可以使用 CartContext 來訪問和修改購物車的狀態了。
export const CartProvider = ({ children }) => {
  // **useReducer** 3. 使用 useReducer hook 來管理購物車狀態，這裡我們使用了 kartReducer 函式來處理購物車狀態的更新，並且將初始狀態設置為從 localStorage 讀取的數據
  const [cart, dispatch] = useReducer(kartReducer, initialKartState); // useReducer 的時候，就已經把 kartReducer 和 dispatch 綁在一起了
  // dispactch 雖然每次 rerender useReducer 這行都會跑到，但 React 內部會直接回傳同一個 dispatch 函式，不會重新建立。所以放進 useEffect 的 dependency array 不會造成無限迴圈

  // 1. 使用 useState hook 來定義 cart 狀態和 setCart 方法，這裡我們使用了一個函式作為 useState 的初始值，這個函式會在組件第一次渲染時被調用，並且從 localStorage 中獲取之前存儲的購物車數據，如果有的話就解析成 JavaScript 對象並返回，否則就返回一個空數組，這樣就可以實現購物車數據的持久化了。
  // const [cart, setCart] = useState(() => {
  //   try {
  //     const storedCart = localStorage.getItem("cart");
  //     return storedCart ? JSON.parse(storedCart) : []; // 如果 localStorage 中有存儲的購物車數據，就解析成 JavaScript 對象並返回，否則就返回一個空數組
  //   } catch (error) {
  //     console.error("無法解析 localStorage 中的購物車數據:", error);
  //     return [];
  //   }
  // });

  // 2. 使用 useEffect hook 來監聽 cart 狀態的變化，當 cart 狀態發生變化時，就會將新的 cart 數據存儲到 localStorage 中，這樣就可以實現購物車數據的持久化了。
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart)); // 將 cart 數據轉換成 JSON 字符串並存儲到 localStorage 中，這樣就可以實現購物車數據的持久化了。
    } catch (error) {
      console.error("無法將購物車數據保存到 localStorage:", error);
    }
  }, [cart]);

  // 3. 定義 addToCart 方法，這個方法用於將產品添加到購物車中，當用戶點擊「加入購物車」按鈕時，就會調用這個方法，並且將當前的產品作為參數傳入，從而將產品添加到購物車中。
  // const addToCart = (product, quantity) => {
  //   // 使用 setCart 方法來更新 cart 狀態，這裡我們使用了一個函式作為 setCart 的參數，這個函式會接收當前的 cart 狀態作為參數，然後返回一個新的 cart 狀態，這樣就可以確保我們在更新 cart 狀態時不會直接修改原來的 cart 狀態，而是創建一個新的 cart 狀態，這樣就符合 React 中狀態不可變的原則了。
  //   setCart((prevCart) => {
  //     // 檢查購物車中是否已經有這個產品了，如果有的話就更新它的數量，否則就將它添加到購物車中
  //     const existingItem = prevCart.find((item) => item.id === product.id);

  //     if (existingItem) {
  //       // 如果購物車中已經有這個產品了，就更新它的數量，這裡我們使用了 map 方法來遍歷 prevCart 中的每一個項目，如果項目的 productId 和當前要添加的產品的 productId 相同，那麼就返回一個新的項目對象，這個對象包含了原來的項目屬性，但是將 quantity 屬性的值增加了傳入的 quantity，否則就返回原來的項目對象，這樣就可以實現更新購物車中已有產品的數量了。
  //       return prevCart.map(
  //         (item) =>
  //           item.id === product.id
  //             ? { ...item, quantity: item.quantity + quantity } // 如果項目的 productId 和當前要添加的產品的 productId 相同，那麼就返回一個新的項目對象，這個對象包含了原來的項目屬性，但是將 quantity 屬性的值增加了傳入的 quantity; ...item 展開的是「這個 item 物件裡的所有屬性（attributes）」--，然後我們在這個新的對象中覆蓋了 quantity 屬性，將它的值設置為 item.quantity + quantity，這樣就實現了更新購物車中已有產品的數量了。
  //             : item, // 否則就返回原來的項目對象
  //       );
  //     }

  //     // 如果購物車中沒有這個產品了，就將它添加到購物車中，這裡我們使用了展開運算符 ...prevCart 來創建一個新的數組，這個數組包含了 prevCart 中的所有項目，然後我們在這個新的數組中添加了一個新的項目對象，這個對象包含了傳入的 product 物件的所有屬性（使用 ...product 展開），並且還添加了一個 quantity 屬性，這個屬性的值就是傳入的 quantity，這樣就實現了將產品添加到購物車中了。
  //     return [...prevCart, { ...product, quantity: quantity }]; // ...prevCart 展開的是「這個 prevCart 數組裡的所有項目（items）」--，然後我們在這個新的數組中添加了一個新的項目對象，這個對象包含了傳入的 product 物件的所有屬性（使用 ...product 展開），並且還添加了一個 quantity 屬性，這個屬性的值就是傳入的 quantity，這樣就實現了將產品添加到購物車中了。
  //   });
  // };

  // // 4. 定義 removeFromCart 方法，這個方法用於將產品從購物車中移除，當用戶點擊「移除」按鈕時，就會調用這個方法，並且將當前的產品 ID 作為參數傳入，從而將產品從購物車中移除。
  // const removeFromCart = (productId) => {
  //   setCart(
  //     (prevCart) => prevCart.filter((item) => item.id !== productId), // 使用 filter 方法來過濾 prevCart 中的每一個項目，如果項目的 productId 和傳入的 productId 不相同，那麼就保留這個項目，否則就將它從購物車中移除，這樣就實現了將產品從購物車中移除了。
  //   );
  // };

  // **useReducer** 4. 定義 addToKart 和 removeFromKart 方法，這些方法用於添加和移除購物車中的商品
  const addToCart = (product, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { product, quantity } }); // 使用 dispatch 方法來觸發 ADD_TO_CART 事件，並將產品和數量作為參數傳入
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: { id: productId } }); // 使用 dispatch 方法來觸發 REMOVE_FROM_CART 事件，並將產品 ID 作為參數傳入
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART }); // 使用 dispatch 方法來觸發 CLEAR_CART 事件
  };

  // 使用 reduce 方法來計算購物車中所有項目的總數量，這裡我們將 acc 初始化為 0，然後對 cart 中的每一個項目進行累加，將它們的 quantity 屬性的值加到 acc 上，最後返回 acc 的值，這樣就可以得到購物車中所有項目的總數量了。
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0); // acc 是累積所有商品的總數量，item 是 cart 中的每一個項目，item.quantity 是每一個項目的數量，這樣就可以得到購物車中所有項目的總數量了。
  return (
    <CartContext.Provider
      value={{
        cart,
        // setCart,
        addToCart,
        removeFromCart,
        totalQuantity,
        clearCart, // 清空購物車 (使用 useReducer)
      }} // 使用 CartContext.Provider 組件來提供購物車上下文的值，這裡我們將 cart、setCart、addToCart、removeFromCart 和 totalQuantity 作為 value 傳入 CartContext.Provider 組件，這樣在整個應用程式中就可以使用 CartContext 來訪問和修改購物車的狀態了。
    >
      {children}
    </CartContext.Provider>
  );
};
