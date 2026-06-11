import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import PageTitle from "../../home/PageTitle";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { requireAuth } from "../../../utils/authRouteGuards";

export default function OrderManage() {
  const orders = useLoaderData(); // 2. 使用 useLoaderData hook 來獲取 List<OrderResponseDto> 資料
  const revalidator = useRevalidator(); // 使用 useRevalidator hook 來獲取 revalidate 函式，這個函式可以用來重新加載由 loader 函式加載的資料，當我們在頁面上執行某些操作（例如：確認訂單、取消訂單等等）後，可以調用 revalidate 函式來重新加載訂單資料，以便頁面上顯示最新的訂單狀態。

  // 定義一個函數來格式化 ISO 日期字串為更易讀的格式，例如：2024-06-01T12:34:56Z 會被格式化為 2024年6月1日。
  function formatDate(isoDate) {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // 定義一個函數來處理訂單確認的操作，這個函數會發送一個 PATCH 請求到後端 API 的 /admin/orderManage/{orderId}/confirm 端點，來更新訂單的狀態為已確認，然後使用 react-toastify 顯示成功或失敗的通知
  const handleConfirm = async (orderId) => {
    try {
      const response = await apiClient.patch(
        `/admin/orderManage/${orderId}/confirm`,
      );
      toast.success(response?.data?.statusMsg || "訂單確認成功。");
      revalidator.revalidate(); // 🔁 這是一個重要的步驟，當訂單狀態被更新後，我們需要重新加載訂單資料，以便頁面上顯示最新的訂單狀態。調用 revalidate 函式會觸發 OrderManage 組件中的 orderManageLoader 函式重新執行，從而獲取最新的訂單資料並更新頁面。
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "訂單確認失敗。"); // 失敗時通常會進 GlobalExceptionHandler
    }
  };

  // 定義一個函數來處理訂單取消的操作，這個函數會發送一個 PATCH 請求到後端 API 的 /admin/orderManage/{orderId}/cancel 端點，來取消訂單的狀態，然後使用 react-toastify 顯示成功或失敗的通知
  const handleCancel = async (orderId) => {
    try {
      const response = await apiClient.patch(
        `/admin/orderManage/${orderId}/cancel`,
      );
      toast.success(response?.data?.statusMsg || "訂單取消成功。");
      revalidator.revalidate(); // 🔁 這是一個重要的步驟，當訂單狀態被更新後，我們需要重新加載訂單資料，以便頁面上顯示最新的訂單狀態。調用 revalidate 函式會觸發 OrderManage 組件中的 orderManageLoader 函式重新執行，從而獲取最新的訂單資料並更新頁面。
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "訂單取消失敗。"); // 失敗時通常會進 GlobalExceptionHandler
    }
  };

  return (
    <div className="min-h-213 max-w-4xl mx-auto px-6 py-12 font-brand dark:bg-darkbg">
      {orders.length === 0 ? (
        <p className="text-center text-2xl  text-brand dark:text-lighter">
          暫無訂單
        </p>
      ) : (
        <div className="space-y-6 mt-4">
          <PageTitle title="Admin 訂單管理" />
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-700 shadow-md rounded-md p-6"
            >
              {/* Top Row: Order Info + Buttons */}
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-brand dark:text-lighter">
                    訂單 #{order.orderId}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    狀態:{" "}
                    <span className="font-medium  text-yellow-500 dark:text-lighter">
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
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4 lg:mt-0">
                  <button
                    onClick={() => handleConfirm(order.orderId)}
                    className="px-6 py-2 text-white dark:text-dark text-md rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
                  >
                    確認
                  </button>
                  <button
                    onClick={() => handleCancel(order.orderId)}
                    className="px-6 py-2 text-white text-md rounded-md transition duration-200 bg-red-500 hover:bg-red-600"
                  >
                    取消
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 border-t pt-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={item.imageUrl}
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

// 1. 取得 List<OrderResponseDto> 資料，這個資料會被 OrderManage 組件中的 useLoaderData hook 獲取到，然後在頁面上顯示每一個訂單的詳細資訊。
export async function orderManageLoader() {
  requireAuth("/admin/orderManage"); // 確保用戶已經登入了，如果沒有登入，則會將用戶原本想去的路徑存入 sessionStorage 中，然後重定向到 "/login" 頁面。

  try {
    const response = await apiClient.get("/admin/orderManage"); // Axios GET Request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "無法獲取訂單資料，請稍後再試。",
      { status: error.response?.status || error.status || 500 },
    );
  }
}
