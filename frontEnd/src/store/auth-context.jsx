import { createContext, useEffect, useContext, useReducer } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // 建立自定義 hook

// 這些是 action types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

// 這邊使用立即執行函數來初始化 auth 狀態
const initialAuthState = (() => {
  try {
    const jwtToken = localStorage.getItem("jwtToken"); // 從 localStorage 中獲取 jwtToken
    const user = localStorage.getItem("user"); // 從 localStorage 中獲取 user
    if (jwtToken && user) {
      // 如果 jwtToken 和 user 都存在，則返回包含這些數據的狀態
      return {
        jwtToken: jwtToken, // 設置 jwtToken
        user: JSON.parse(user), // 將字符串轉換為對象
        isAuthenticated: true, // 設置為已登入狀態
      };
    }
  } catch (error) {
    console.error("無法取得 localStorage 中的登入數據:", error);
  }

  // 如果沒有從 localStorage 中獲取到數據，則返回初始狀態
  return {
    jwtToken: null,
    user: null,
    isAuthenticated: false,
  };
})();

// 這是一個 reducer 函數，用於更新狀態
const authReducer = (currentState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        jwtToken: action.payload.jwtToken,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        jwtToken: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return currentState;
  }
};

// 建立 AuthProvider 組件
export const AuthProvider = ({ children }) => {
  // 這邊使用 useReducer 來管理 auth 狀態
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // 監聽 auth 狀態變化，並將其保存到 localStorage
  useEffect(() => {
    try {
      if (authState.isAuthenticated) {
        localStorage.setItem("jwtToken", authState.jwtToken); // 保存 jwtToken
        localStorage.setItem("user", JSON.stringify(authState.user)); // 保存 user
      } else {
        localStorage.removeItem("jwtToken"); // 移除 jwtToken
        localStorage.removeItem("user"); // 移除 user
      }
    } catch (error) {
      console.error("無法將登入狀態保存到 localStorage:", error);
    }
  }, [authState]);

  // 這是登入成功時的 action creator - 用於更新 auth 狀態 (須傳入 jwtToken 和 user)
  const loginSuccess = (jwtToken, user) => {
    dispatch({ type: LOGIN_SUCCESS, payload: { jwtToken, user } }); // 使用 dispatch 方法來觸發 LOGIN_SUCCESS 事件，並將 jwtToken 和 user 作為參數傳入
  };

  // 這是登出時的 action creator - 用於更新 auth 狀態
  const logout = () => {
    dispatch({ type: LOGOUT }); // 使用 dispatch 方法來觸發 LOGOUT 事件
  };

  return (
    //  這邊是將 auth 狀態傳遞給子組件，代表所有子組件都可以使用這些狀態，透過自訂義的 useAuth() 來取得
    <AuthContext.Provider
      value={{
        jwtToken: authState.jwtToken, // jwtToken
        user: authState.user, // user
        isAuthenticated: authState.isAuthenticated, // 是否已登入
        loginSuccess, // 登入成功時的 action creator
        logout, // 登出時的 action creator
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
