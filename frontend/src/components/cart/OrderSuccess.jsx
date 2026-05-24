import React from "react";
import { Link } from "react-router-dom";
import orderSuccessImg from "../../assets/util/order-confirmed.png";
import PageTitle from "../home/PageTitle";

export default function OrderSuccess() {
  return (
    <div className="min-h-[852px]  py-12 sm:pt-20 font-brand bg-normalbg dark:bg-darkbg">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle text="太好了！訂單已成功下單" />
      </div>
      <div className="text-center text-lg text-gray-600 dark:text-lighter flex flex-col items-center">
        <p className="max-w-[576px] text-center px-4 mx-auto leading-6 mb-6">
          你的訂單
        </p>
        <img
          src={orderSuccessImg}
          alt="Order Success"
          className="w-full max-w-[450px] mx-auto mb-8"
        />
        <Link
          to="/home"
          className="px-6 py-3 text-white dark:text-black text-xl rounded-md transition duration-200 bg-brand dark:bg-light hover:bg-dark dark:hover:bg-lighter"
        >
          繼續購物
        </Link>
      </div>
    </div>
  );
}
