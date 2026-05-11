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
  const [errorMessage, setErrorMessage] = useState("");
  const [elementErrors, setElementErrors] = useState({
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
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js is not loaded yet.");
      return;
    }

    if (Object.values(elementErrors).some((error) => error)) {
      setErrorMessage("Please correct the highlighted errors.");
      return;
    }

    setIsProcessing(true); // 設置處理中狀態

    try {
      const response = await apiClient.post("/payment/create-payment-intent", {
        amount: totalPrice * 100,
        currency: "usd",
      });

      const { clientSecret } = response.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
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
        setErrorMessage(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        try {
          await apiClient.post("/orders", {
            totalPrice: totalPrice,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            items: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          });
          sessionStorage.setItem("skipRedirectPath", "true");
          clearCart();
          navigate("/order-success");
        } catch (orderError) {
          console.error("Failed to create order:", orderError);
          setErrorMessage("Order creation failed. Please contact support.");
        }
      }
    } catch (error) {
      setErrorMessage("Error processing payment. Please try again later.");
      console.error("Error creating PaymentIntent:", error);
    } finally {
      setIsProcessing(false); //
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
