import React from "react";
import apiClient from "../../api/apiClient";
import { useLoaderData } from "react-router-dom";
import PageTitle from "../home/PageTitle";

export default function Orders() {
  const orders = useLoaderData(); // OrderResponseDto; 使用 useLoaderData hook 來獲取由 ordersLoader 函式加載的訂單資料，這些資料會在 Orders 組件中用來顯示用戶的訂單資訊。

  // 定義一個函數來格式化 ISO 日期字串為更易讀的格式，例如：2024-06-01T12:34:56Z 會被格式化為 2024年6月1日。
  function formatDate(isoDate) {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString(
      undefined, // 「使用瀏覽器預設語系」
      {
        year: "numeric", // 顯示完整的年份，例如：2024
        month: "short", // 顯示縮寫的月份名稱，例如：Jun
        day: "numeric", // 顯示日期的數字，例如：1
      },
    );
  }

  return (
    <div className="min-h-213 max-w-4xl mx-auto px-6 py-12 font-brand dark:bg-darkbg">
      {orders.length === 0 ? (
        <p className="text-center text-2xl  text-brand dark:text-lighter">
          暫無訂單
        </p>
      ) : (
        <div className="space-y-6 mt-4">
          <PageTitle title="我的訂單" />
          {orders.map((order) => (
            // 這裡的 order 是 OrderResponseDto 中的每一個訂單物件，包含了訂單的詳細資訊，例如：訂單 ID、狀態、總價、創建日期、訂單項目等等，這些資訊會被用來在頁面上顯示給用戶。
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-700 shadow-md rounded-md p-6"
            >
              <h2 className="text-xl font-semibold mb-2 text-brand dark:text-lighter">
                訂單 #{order.orderId}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                狀態:{" "}
                <span className="font-medium text-gray-800 dark:text-lighter">
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                總價:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ${order.totalPrice}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                日期:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(order.createdAt)}
                </span>
              </p>
              {/* // 這裡的 order.orderItems 是 OrderResponseDto
              中的訂單項目列表，每一個訂單項目包含了產品的詳細資訊，例如：產品名稱、價格、數量、圖片URL
              等等，這些資訊會被用來在頁面上顯示每一個訂單項目的詳細資訊給用戶。 */}
              <div className="mt-4 space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img
                      src={item.imageUrl} // 這裡的 item.imageUrl 是 OrderItemResponseDto 中的圖片URL，用來顯示訂單項目的產品圖片。
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        數量: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        單價: ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function ordersLoader() {
  try {
    // 1. 從 apiClient 發送 GET 請求到 "/orders" 端點，以獲取用戶的訂單資料。
    const response = await apiClient.get("/orders");
    return response.data; // 2. 返回從 API 獲取的訂單資料，這些資料將會在 Orders 組件中使用 useLoaderData hook 來獲取和顯示。
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "無法獲取訂單資料，請稍後再試。",
      { status: error.response?.status || error.status || 500 },
    );
  }
}
