import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  useNavigate,
  replace,
} from "react-router-dom";
import PageTitle from "../../components/home/PageTitle";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context";

export default function Profile() {
  const initialProfileData = useLoaderData(); // 2. 取得初始資料
  const actionData = useActionData(); // 5. 取得表單提交後的資料
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profileData, setProfileData] = useState(initialProfileData); // 3. 設定初始狀態

  // 6. 處理表單提交後的資料
  useEffect(() => {
    if (actionData?.success) {
      if (actionData.profileData.emailUpdated) {
        // emailUpdated 來自後端
        sessionStorage.setItem("skipRedirectPath", "true"); // 設定 sessionStorage 來跳過重新導向
        logout();
        toast.success("成功更新電子郵件，請重新登入");
        navigate("/login");
      } else {
        toast.success("成功保存個人資料");
        setProfileData(actionData.profileData); // 更新本地狀態
      }
    }
  }, [actionData]);

  const labelStyle =
    "block text-lg font-semibold text-brand dark:text-light mb-2";
  const h2Style =
    "block text-2xl font-semibold text-brand dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-brand dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <div className="max-w-6xl min-h-213 mx-auto px-6 py-8 font-brand bg-normalbg dark:bg-darkbg">
      <PageTitle title="個人檔案" />
      <Form method="PUT" className="space-y-6 max-w-3xl mx-auto">
        {" "}
        {/* 表單提交方法 PUT 代表更新資料 */}
        <div>
          <h2 className={h2Style}>個人資料</h2>
          <label htmlFor="name" className={labelStyle}>
            姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            className={textFieldStyle}
            value={profileData.name} // 這裡的 name 是從 initialProfileData 傳入的
            onChange={
              (e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value })) // 輸入時更新狀態
            }
            required
            minLength={5}
            maxLength={30}
          />
          {actionData?.error?.name && (
            <p className="text-red-500 text-sm mt-1">{actionData.error.name}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={profileData.email} // 這裡的 email 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value })) // 輸入時更新狀態
              }
              className={textFieldStyle}
              required
            />
            {actionData?.error?.email && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mobileNumber" className={labelStyle}>
              手機號碼
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits"
              value={profileData.mobileNumber} // 這裡的 mobileNumber 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    mobileNumber: e.target.value,
                  })) // 輸入時更新狀態
              }
              placeholder="Your Mobile Number"
              className={textFieldStyle}
            />
            {actionData?.error?.mobileNumber && ( // 顯示手機號碼錯誤 是從 actionData 傳入的
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.mobileNumber}
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className={h2Style}>地址</h2>
          <label htmlFor="street" className={labelStyle}>
            道路
          </label>
          <input
            id="street"
            name="street"
            type="text"
            placeholder="Street details"
            value={profileData.street} // 這裡的 street 是從 initialProfileData 傳入的
            onChange={
              (e) =>
                setProfileData((prev) => ({
                  ...prev,
                  street: e.target.value,
                })) // 輸入時更新狀態
            }
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={30}
          />
          {actionData?.error?.street && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.error.street}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className={labelStyle}>
              城市
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Your City"
              value={profileData.city} // 這裡的 city 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    city: e.target.value,
                  })) // 輸入時更新狀態
              }
              className={textFieldStyle}
              required
              minLength={3}
              maxLength={30}
            />
            {actionData?.error?.city && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.city}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className={labelStyle}>
              州/省
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              minLength={2}
              maxLength={30}
              placeholder="Your State"
              value={profileData.state} // 這裡的 state 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    state: e.target.value,
                  })) // 輸入時更新狀態
              }
              className={textFieldStyle}
            />
            {actionData?.error?.state && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.state}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="postalCode" className={labelStyle}>
              郵遞區號
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="Your Postal Code"
              value={profileData.postalCode} // 這裡的 postalCode 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  })) // 輸入時更新狀態
              }
              className={textFieldStyle}
              required
              pattern="^\d{5}$"
              title="Postal code must be exactly 5 digits"
            />
            {actionData?.error?.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.postalCode}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="country" className={labelStyle}>
              國家
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              minLength={3}
              maxLength={30}
              placeholder="Your Country"
              value={profileData.country} // 這裡的 country 是從 initialProfileData 傳入的
              onChange={
                (e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    country: e.target.value,
                  })) // 輸入時更新狀態
              }
              className={textFieldStyle}
            />
            {actionData?.error?.country && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.error.country}
              </p>
            )}
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 mt-8 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
          >
            {isSubmitting ? "儲存中..." : "儲存"}{" "}
            {/* 這裡的 isSubmitting 是從 useNavigation 傳入的 */}
          </button>
        </div>
      </Form>
    </div>
  );
}

// 1. 這是處理資料載入的函數 - 用於獲取用戶資料
export async function profileLoader() {
  try {
    const response = await apiClient.get("/profile"); // Axios GET Request
    return toProfileFormData(response.data); // 將後端回傳的資料轉換為表單所需的格式
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "無法獲取用戶資料，請稍後再試。",
      { status: error.response?.status || error.status || 500 }, //response.status 來自後端回傳的狀態碼; error.status 來自前端回傳的狀態碼;
    );
  }
}

// 4. 這是處理表單提交的函數 - 用於更新用戶資料
export async function profileAction({ request }) {
  const data = await request.formData();

  // 從表單中取得資料
  const profilePayload = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    street: data.get("street"),
    city: data.get("city"),
    state: data.get("state"),
    postalCode: data.get("postalCode"),
    country: data.get("country"),
  };
  try {
    const response = await apiClient.put("/profile", profilePayload); // Axios PUT Request
    return { success: true, profileData: toProfileFormData(response.data) }; // 返回成功訊息和更新後的 profile 資料
  } catch (error) {
    // 後端驗證失敗
    if (error.response?.status === 400) {
      return { success: false, error: error.response?.data };
    }
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "更新個人資料失敗，請稍後再試。",
      { status: error.status || 500 },
    );
  }
}

// 1.1 這是將後端回傳的資料轉換為表單所需的格式
function toProfileFormData(profile) {
  return {
    name: profile?.name ?? "", // 如果 profile?.name 存在，就使用 profile?.name，否則就使用空字串
    email: profile?.email ?? "",
    mobileNumber: profile?.mobileNumber ?? "",
    street: profile?.address?.street ?? "",
    city: profile?.address?.city ?? "",
    state: profile?.address?.state ?? "",
    postalCode: profile?.address?.postalCode ?? "",
    country: profile?.address?.country ?? "",
    emailUpdated: profile?.emailUpdated ?? false,
  };
}
