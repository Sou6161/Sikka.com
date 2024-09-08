import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { useParams } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const CoinFullDetails = () => {
  const { id } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [CoinDetails, setCoinDetails] = useState(null);

  console.log(id, "iouhouhgghuoggoo");

  useEffect(() => {
    const FetchCoinDetails = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=true&sparkline=true`
      );
      const CoinData = await response.json();
      console.log(CoinData);
      setCoinDetails(CoinData);
    };
    FetchCoinDetails();
  }, []);

  useEffect(() => {
    // CoinDetails && console.log(CoinDetails);
  }, [CoinDetails]);
  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-[100vw] h-[100vh] text-white bg-black overflow-x-hidden">
        <h1 className=" text-[6vw] font-semibold text-red-600 relative left-[8vw] top-[7vh]">
          Overview
        </h1>
        <img
          className=" relative left-[8vw] top-[12vh]  "
          src={CoinDetails?.image?.thumb}
          alt=""
        />
        <h1 className=" inline-flex text-white relative left-[16vw] top-[8vh] text-[5.2vw]">
          {CoinDetails?.name}
          <h1 className="relative left-5 text-gray-400">
            {CoinDetails?.symbol?.toUpperCase()} Price
          </h1>
          <span
            className="text-white border-[2px] border-red-600 rounded-full bg-yellow-400 p-1 relative top-1 left-[30vw] cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaStar className="" />
            {showDropdown && (
              <div
                className="absolute bg-white shadow-md p-2 rounded-md border border-gray-200"
                style={{
                  top: "150%",
                  right: "0%",
                  zIndex: 1,
                  width: "170px",
                }}
              >
                <a
                  href="#"
                  className="inline-block px-2 font-semibold bg-gray-200 py-2 -ml- hover:bg-red-100 rounded-lg text-[4.5vw] w-[40vw] text-gray-600"
                >
                  Add to Portfolio
                </a>
                <h1 className="text-[3.5vw] ml-2 w-[50vw] text-gray-600">
                  Added{" "}
                  {CoinDetails?.watchlist_portfolio_users?.toLocaleString()}{" "}
                  Users
                </h1>
              </div>
            )}
          </span>
        </h1>
        <div>
          <h1 className="relative text-[7.5vw] left-[8vh] top-[10vh]">
            <span className="min-w-[20vw]">
              $
              {CoinDetails?.market_data?.current_price?.usd >= 100
                ? CoinDetails?.market_data?.current_price?.usd?.toFixed(2)
                : CoinDetails?.market_data?.current_price?.usd?.toFixed(4)}
            </span>
          </h1>
          <h1 className=" text-[3.5vw] relative top-[11vh] left-[15vw] inline-flex">
            <span className="min-w-[20vw]">
              {CoinDetails?.market_data?.current_price?.btc >= 1
                ? CoinDetails?.market_data?.current_price?.btc?.toFixed(4)
                : CoinDetails?.market_data?.current_price?.btc?.toFixed(6)}{" "}
              BTC
            </span>
            <h1 className="relative left-3">
              {CoinDetails?.market_data?.price_change_percentage_24h_in_currency
                ?.btc >= 0 ? (
                <FaCaretUp className="inline-flex blink-green relative" />
              ) : (
                <FaCaretDown className="inline-flex blink-red" />
              )}
              <span
                className={`${
                  CoinDetails?.market_data
                    ?.price_change_percentage_24h_in_currency?.btc >= 0
                    ? "blink-green"
                    : "blink-red"
                }`}
              >
                {CoinDetails?.market_data?.price_change_percentage_24h_in_currency?.btc?.toFixed(
                  2
                )}
                %
              </span>
            </h1>
          </h1>

          <h1 className="text-green-400 text-[5vw] relative font-semibold left-[45vw] top-[2vh]">
            {CoinDetails?.market_data?.price_change_24h >= 0 ? (
              <FaCaretUp className="inline-flex blink-green text-[5.5vw] relative -top-1" />
            ) : (
              <FaCaretDown className="inline-flex blink-red text-[5.5vw] relative -top-1" />
            )}
            <span
              className={`${
                CoinDetails?.market_data?.price_change_24h >= 0
                  ? "blink-green"
                  : "blink-red"
              }`}
            >
              {CoinDetails?.market_data?.price_change_24h?.toFixed(2)}%
            </span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default CoinFullDetails;
