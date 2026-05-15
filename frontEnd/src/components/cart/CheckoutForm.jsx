import React, { useState } from "react";
import { useAuth } from "../../store/auth-context";
import apiClient from "../../api/apiClient";
import { useCart } from "../../store/cart-context";
// Stripe components
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate, useNavigation } from "react-router-dom";
import PageTitle from "../home/PageTitle";
import { toast } from "react-toastify";

export default function CheckoutForm() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const stripe = useStripe(); // Stripe.js instance
  const elements = useElements(); // Stripe elements instance
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false); // 處理中狀態
  const [errorMessage, setErrorMessage] = useState(""); // 錯誤訊息
  const [elementErrors, setElementErrors] = useState({
    // Stripe 元素錯誤訊息
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const isDarkMode = localStorage.getItem("mode") === "dark";

  // Tailwind classes
  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const fieldBaseClass =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
  const fieldErrorClass =
    "border-red-400 dark:border-red-500 focus:ring-red-500";
  const fieldValidClass =
    "border-brand dark:border-light focus:ring-dark dark:focus:ring-lighter";

  // 根據錯誤狀態動態套用樣式，讓同一個 function 可以處理多個欄位：cardNumber, cardExpiry, cardCvc
  const getClassForElement = (field) =>
    `${fieldBaseClass} ${
      elementErrors[field] ? fieldErrorClass : fieldValidClass
    }`;

  // Stripe 元素樣式
  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDarkMode ? "#E5E7EB" : "#374151",
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
      invalid: {
        color: "#F87171",
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
    },
  };

  // 處理 Stripe 元素變更 並更新錯誤訊息
  function handleCardChange(field, event) {
    setElementErrors((prev) => ({
      ...prev,
      [field]: event.error ? event.error.message : "", // 就是讓同一個 function 可以動態更新不同欄位：cardNumber, cardExpiry, cardCvc
    }));
  }

  // 處理表單提交
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表單預設提交行為

    if (!stripe || !elements) {
      // 檢查 Stripe 和 elements 是否已載入
      setErrorMessage("Stripe還未載入完成，請稍後再試");
      return;
    }

    // 檢查 Stripe 元素是否有錯誤
    // 檢查 elementErrors 裡面有沒有任何一個欄位目前有錯誤訊息。 會檢查陣列裡有沒有任何一個值是 truthy。
    // {
    //   cardNumber: "",
    //   cardExpiry: "",
    //   cardCvc: ""
    // }

    // Object.values(elementErrors) 會變成： ["", "", ""] 代表沒有錯誤。
    if (Object.values(elementErrors).some((error) => error)) {
      setErrorMessage("請修正標示為紅色的欄位");
      return;
    }

    setIsProcessing(true); // 設置處理中狀態

    try {
      // 創建付款意向: 請後端向 Stripe 建立一筆 PaymentIntent
      const response = await apiClient.post(
        "/payment/create-payment-intent",
        // Payload: 傳送給後端的資料
        {
          amount: totalPrice * 100, // Stripe 要的是 cents，不是 dollars。
          currency: "usd",
        },
      );

      const { clientSecret } = response.data; // 從後端回傳的資料中取得 clientSecret，這個 clientSecret 後面會交給 Stripe

      // 確認付款: 用 Stripe SDK 來處理信用卡付款
      // 把 clientSecret、信用卡欄位、使用者帳單資料交給 Stripe，請 Stripe 確認這筆付款。
      // error: Stripe 回傳的錯誤訊息
      // paymentIntent: Stripe 回傳的付款結果
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret, // 後端給的 clientSecret
        {
          payment_method: {
            card: elements.getElement(CardNumberElement), // 信用卡號碼
            // 信用卡其他資訊（到期日、CVC）會自動從 Stripe 提供的 CardNumberElement 中取得
            billing_details: {
              // 付款人帳單資料
              name: user.name,
              email: user.email,
              phone: user.mobileNumber,
              address: {
                line1: user.street,
                city: user.city,
                state: user.state,
                postal_code: user.postalCode,
                country: user.country,
              },
            },
          },
        },
      );

      if (error) {
        setErrorMessage(error.message || "付款失敗，請再試一次"); // 設置錯誤訊息
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("付款成功"); // 顯示成功訊息
        try {
          // 這段是在 付款成功之後，把訂單資料送到你的後端，建立一筆 order。
          await apiClient.post("/orders", {
            totalPrice: totalPrice,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            orderItems: cart.map((item) => ({
              // 這是把購物車 cart 轉成訂單商品列表。
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          });
          sessionStorage.setItem("skipRedirectPath", "true"); // 設置 sessionStorage 來跳過重新導向
          clearCart(); // 清空購物車
          navigate("/order-success"); // 跳轉到訂單成功頁面
        } catch (orderError) {
          console.error("創建訂單失敗:", orderError);
          setErrorMessage("訂單建立失敗，請聯繫客服。");
        }
      }
    } catch (error) {
      setErrorMessage("付款處理失敗，請再試一次。");
      console.error("建立 PaymentIntent 時發生錯誤:", error);
    } finally {
      setIsProcessing(false); // 重置處理中狀態
    }
  };

  return (
    <div className="min-h-[852px] flex items-center justify-center font-brand dark:bg-darkbg">
      <div
        className={
          isProcessing
            ? "visible  flex flex-col justify-center items-center my-[200px] " // 顯示處理中訊息
            : "hidden" // 隱藏處理中訊息
        }
      >
        <p className="mt-4 text-2xl font-normal text-brand dark:text-light">
          正在處理付款...請勿刷新頁面
          {/* isProcessing 為 true 時顯示 */}
        </p>
      </div>
      <div
        className={
          isProcessing
            ? "hidden"
            : "visible bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6"
        }
      >
        {/* isProcessing 為 false 時顯示 */}
        <PageTitle title="結帳" />

        <p className="text-center mt-8 text-lg text-gray-600 dark:text-lighter mb-8">
          總金額: <strong>${totalPrice.toFixed(2)}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
              {/* 如果是 Stripe 錯誤，顯示錯誤訊息 */}
            </div>
          )}

          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className={labelStyle}>
              信用卡號碼
            </label>
            <div id="cardNumber" className={getClassForElement("cardNumber")}>
              {/* 信用卡號碼輸入框 */}
              <CardNumberElement // 這是 Stripe 提供的元件
                options={elementOptions} // 設定樣式
                onChange={(event) => handleCardChange("cardNumber", event)} // 當使用者輸入時，更新錯誤訊息： event 來自 Stripe
              />
            </div>
            {elementErrors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardNumber}　{/* 顯示 Stripe 錯誤訊息 */}
              </p>
            )}
          </div>

          {/* Card Expiry */}
          <div>
            <label htmlFor="cardExpiry" className={labelStyle}>
              有效日期
            </label>
            <div id="cardExpiry" className={getClassForElement("cardExpiry")}>
              <CardExpiryElement // 這是 Stripe 提供的元件
                options={elementOptions}
                onChange={(event) => handleCardChange("cardExpiry", event)} // 當使用者輸入時，更新錯誤訊息： event 來自 Stripe
              />
            </div>
            {elementErrors.cardExpiry && ( // 如果有錯誤訊息
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardExpiry}
                {/* 這個是 Stripe 的錯誤訊息 */}
              </p>
            )}
          </div>

          {/* Card CVC */}
          <div>
            <label htmlFor="cardCvc" className={labelStyle}>
              CVC
            </label>
            <div id="cardCvc" className={getClassForElement("cardCvc")}>
              <CardCvcElement // 這是 Stripe 提供的元件
                options={elementOptions}
                onChange={(event) => handleCardChange("cardCvc", event)} // 當使用者輸入時，更新錯誤訊息： event 來自 Stripe
              />
            </div>
            {elementErrors.cardCvc && (
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardCvc}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!stripe || isProcessing} // 如果 Stripe 還沒載入完畢，或者正在處理付款，就禁用按鈕
              className="w-full px-6 py-2 mt-6 text-white dark:text-black text-xl bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200"
            >
              {isProcessing ? "正在處理付款..." : "付款"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
