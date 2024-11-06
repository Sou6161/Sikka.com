import React, { useEffect, useState } from 'react'
import { MdStars } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";


const NewCoins = ({NewCryptoCoin}) => {

    const [FinalNewCoins, setFinalNewCoins] = useState(null)


    useEffect(() => {
        if (NewCryptoCoin) {
            setFinalNewCoins(NewCryptoCoin);
        } else {
        //   console.log("TrendingCoinsHL or TrendingCoinsHL.coins is null/undefined");
        }
      }, [NewCryptoCoin]);
    
      useEffect(() => {
        if (FinalNewCoins) {
          console.log(FinalNewCoins, "New Coins");
        } else {
        //   console.log("FinalTrendingCoins is null/undefined");
        }
      }, [FinalNewCoins]);



  return (
    <div className=" max-w-[95vw] mx-auto relative top-[22vh]  bg-white rounded-xl shadow-lg p-2 ">
    {/* Header */}
    <div className="flex items-center justify-between mb-4 p-2">
      <div className="flex items-center gap-2">
        <MdStars className="text-orange-500 text-xl" />
        <h2 className="text-lg font-semibold text-black">New CryptoCurrencies </h2>
      </div>
      <button className="flex items-center text-gray-600 hover:text-gray-900">
        more
        <MdKeyboardArrowRight className="text-xl mt-1" />
      </button>
    </div>

    {/* Column Headers */}
    <div className="flex justify-between text-sm font-semibold text-gray-800 pb-2 px-2">
      <span>Coin</span>
      <div className="flex gap-8">
        <span>Price</span>
        <span className="w-16 text-right">24h</span>
      </div>
    </div>
    <div className=" border-t-gray-300 border-[1px]"></div>

    {/* Coin List */}
    <div className="flex flex-col">
      {FinalNewCoins ? (
        FinalNewCoins.slice(0, 6).map((coin) => (
          <div
            key={coin?.id}
            className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={coin?.image}
                alt={coin?.name}
                className="w-6 h-6 rounded-full border-[1px] border-black"
              />
              <span className="font-medium text-black">{coin?.name}</span>
            </div>

            <div className="flex gap-8 items-center text-black font-semibold">
              <span className="text-sm">
                ₹
                {coin?.current_price?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`w-16 flex items-center justify-end text-sm gap-1
                ${
                  coin?.price_change_percentage_24h >= 0
                    ? "text-green-500 blink-green"
                    : "text-red-500 blink-red"
                }`}
              >
                {coin?.price_change_percentage_24h >= 0 ? (
                  <FaCaretUp />
                ) : (
                  <FaCaretDown />
                )}
                {Math.abs(coin?.price_change_percentage_24h?.toFixed(1))}%
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          No trending coins available
        </div>
      )}
    </div>
  </div>
  )
}

export default NewCoins