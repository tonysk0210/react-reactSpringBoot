import { createContext } from "react"; // 引入 createContext 函式；這個函式是 React 中用於創建一個新的 Context 對象的函式，Context 是 React 中用於在組件樹中傳遞數據的一種方式，可以讓你在組件之間共享數據，而不需要通過 props 一層一層地傳遞。

export const CartContext = createContext(); // 使用 createContext 函式來創建一個新的 Context 對象，並且將其賦值給 CartContext 變量，這樣就可以在其他組件中使用 CartContext 來訪問和修改購物車的狀態了。
