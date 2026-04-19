import React from "react";
import PageTitle from "../home/PageTitle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import emptyCartImage from "../../assets/util/emptycart.png";

export default function Cart() {
  const navigation = useNavigate();

  const handleClick = () => {
    navigation("/home", { state: { username: "madan" } });
  };

  return (
    <div className="min-h-213 py-12 bg-normalbg dark:bg-darkbg font-brand">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="購物車" />
        <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
          <p className="max-w-xl px-2 mx-auto text-base mb-4">
            喔喔！購物車是空的！繼續購物
          </p>
          <img
            src={emptyCartImage}
            alt="Empty Cart"
            className="max-w-75 mx-auto mb-6 dark:bg-light dark:rounded-md"
          />
          <button
            onClick={handleClick}
            className="py-2 px-4 bg-brand dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
          >
            返回商品
          </button>
        </div>
      </div>
    </div>
  );
}
