import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import PageTitle from "../../home/PageTitle";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { requireAuth } from "../../../utils/authRouteGuards";

export default function Messages() {
  const messages = useLoaderData(); // 2. 使用 useLoaderData hook 來獲取 List<ContactResponseDto> 資料
  const revalidator = useRevalidator();

  // 處理關閉消息的操作，這個函數會發送一個 PATCH 請求到後端 API 的 /admin/messages/{contactId}/close 端點，來將消息的狀態更新為已關閉，然後使用 react-toastify 顯示成功或失敗的通知，最後調用 revalidate 函式來重新加載消息資料，以便頁面上顯示最新的消息狀態。
  const handleCloseMessage = async (contactId) => {
    try {
      const response = await apiClient.patch(
        `/admin/messages/${contactId}/close`,
      );
      toast.success(response?.data?.statusMsg || "此信息已關閉。", {
        style: { width: "450px", maxWidth: "calc(100vw - 32px)" },
      });
      revalidator.revalidate(); // 🔁 Re-run loader
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "此信息關閉失敗"); // 失敗時通常會進 GlobalExceptionHandler
    }
  };

  return (
    <div className="min-h-213 mx-auto px-6 py-12 font-brand dark:bg-darkbg">
      {messages.length === 0 ? (
        <p className="text-center text-2xl text-brand dark:text-lighter">
          未有任何信息.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <PageTitle title="Admin 信息管理" />
          <table className="w-full mt-4 table-fixed border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-brand dark:bg-light text-lighter dark:text-brand">
                <th className="w-1/6 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  姓名
                </th>
                <th className="w-1/6 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Email
                </th>
                <th className="w-1/6 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  手機號碼 #
                </th>
                <th className="w-2/5 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  信息內容
                </th>
                <th className="w-1/6 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.contactId}
                  className=" bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-lighter"
                >
                  <td className="border px-4 py-2 break-words">
                    {message.name}
                  </td>
                  <td className="border px-4 py-2 break-words">
                    {message.email}
                  </td>
                  <td className="border px-4 py-2 break-words">
                    {message.mobileNumber}
                  </td>
                  <td className="border px-4 py-2 break-words max-w-[300px] overflow-auto">
                    {message.message}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleCloseMessage(message.contactId)}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      已讀並關閉
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 1. 定義一個 loader 函式來從後端 API 獲取消息資料，這個函式會在路由匹配時被調用，並且返回獲取到的數據，這些數據會被 Message 組件中的 useLoaderData hook 獲取到並用於渲染 UI。
export async function messagesLoader() {
  requireAuth("/admin/messages"); // 確保用戶已經登入了，如果沒有登入，則會將用戶原本想去的路徑存入 sessionStorage 中，然後重定向到 "/login" 頁面。

  try {
    const response = await apiClient.get("/admin/messages");
    return response.data; // 返回從 API 獲取的消息資料，這些資料將會在 Message 組件中使用 useLoaderData hook 來獲取和顯示。
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "無法獲取消息資料，請稍後再試。",
      { status: error.response?.status || error.status || 500 },
    );
  }
}
