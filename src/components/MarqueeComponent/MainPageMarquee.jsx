import React, { useEffect, useState, useRef } from "react";
import { CoinGeckoApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { LiveCoinWatchApi } from "../../api/CoinGeckoApi/LiveCoinWatchApi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addMarqueeData, addMarqueeData2 } from "../../ReduxSlice/Marqueeslice";

const MainPageMarquee = () => {
  const [MarqueeData, setMarqueeData] = useState(null);
  const [MarqueeData2, setMarqueeData2] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const GetMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/global",
          CoinGeckoApi
        );
        const data = await response.json();
        setMarqueeData(data);
        dispatch(addMarqueeData(data)); // Dispatch with the actual data
      } catch (error) {
        console.error("Failed to fetch CoinGecko data:", error);
      }
    };
    GetMarketData();
  }, []);

  useEffect(() => {
    // MarqueeData && console.log(MarqueeData);
  }, [MarqueeData]);

  useEffect(() => {
    const GetMarketData2 = async () => {
      try {
        const response = await fetch(
          "https://api.livecoinwatch.com/overview",
          LiveCoinWatchApi
        );
        const data2 = await response.json();
        setMarqueeData2(data2);
        dispatch(addMarqueeData2(data2));
      } catch (error) {
        console.error("Failed to fetch LiveCoinWatch data:", error);
      }
    };
    GetMarketData2();
  }, []);

  useEffect(() => {
    // MarqueeData2 && console.log(MarqueeData2);
  }, [MarqueeData2]);

  return (
    <div class="relative flex overflow-x-hidden bg-white">
      <div class="animate-marquee whitespace-nowrap">
        <span class="text-xl mx-10 font-semibold">
          Coins: {MarqueeData?.data?.active_cryptocurrencies}
        </span>
        <span className="text-xl mx-4 font-semibold">
          Market Cap: $
          {MarqueeData2?.cap ? (
            <span>
              {(MarqueeData2.cap / 1e12).toFixed(3)}T
              <span
                className={`blink text-${
                  MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0
                    ? "blink-green"
                    : "blink-red"
                } text-[5vw]  medium:text-[2vw] 2xlarge:text-[1vw] inline-flex items-center`}
              >
                {MarqueeData?.data?.market_cap_change_percentage_24h_usd >=
                0 ? (
                  <FaCaretUp className="blink-green text-[4vw]  2xlarge:text-[1vw]" />
                ) : (
                  <FaCaretDown className="text-[4.5vw] 2xlarge:text-[1vw] blink-red" />
                )}
                <span
                  className={`blink-${
                    MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0
                      ? "green"
                      : "red"
                  }`}
                >
                  {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                    1
                  )}
                  %
                </span>
              </span>
            </span>
          ) : (
            ""
          )}
        </span>
        <span class="text-xl mx-4 font-semibold">
          24h Vol: $
          {MarqueeData2?.volume ? (MarqueeData2.volume / 1e9).toFixed(3) : ""} B
        </span>
        <span class="text-xl mx-4 font-semibold">
          Dominance: BTC{" "}
          {MarqueeData2?.btcDominance
            ? (MarqueeData2.btcDominance * 100).toFixed(2)
            : ""}
          %
          <span className="ml-3 font-semibold">
            ETH{" "}
            {MarqueeData?.data?.market_cap_percentage?.eth
              ? MarqueeData.data.market_cap_percentage.eth.toFixed(2)
              : ""}
            %
          </span>
        </span>
        <span class="text-xl mx-4 font-semibold">
          Liquidity: $
          {MarqueeData2?.liquidity
            ? (MarqueeData2.liquidity / 1e9).toFixed(2)
            : ""}
          B
        </span>
      </div>

      <div class="absolute top-0 left-[5vw] animate-marquee2 whitespace-nowrap">
        <span class="text-xl mx-10 font-semibold">
          Coins: {MarqueeData?.data?.active_cryptocurrencies}
        </span>
        <span className="text-xl mx-4 font-semibold">
          Market Cap: $
          {MarqueeData2?.cap ? (
            <span>
              {(MarqueeData2.cap / 1e12).toFixed(3)}T
              <span className="text-green-400  2xlarge:text-[1vw]  inline-flex items-center">
                <FaCaretUp className="text-[4vw] 2xlarge:text-[1vw]" />{" "}
                {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                  1
                )}
                %
              </span>
            </span>
          ) : (
            ""
          )}
        </span>
        <span class="text-xl mx-4 font-semibold">
          24h Vol: $
          {MarqueeData2?.volume ? (MarqueeData2.volume / 1e9).toFixed(3) : ""} B
        </span>
        <span class="text-xl mx-4 font-semibold">
          Dominance: BTC{" "}
          {MarqueeData2?.btcDominance
            ? (MarqueeData2.btcDominance * 100).toFixed(2)
            : ""}
          %
        </span>
        <span class="text-xl mx-4 font-semibold">
          Liquidity: $
          {MarqueeData2?.liquidity
            ? (MarqueeData2.liquidity / 1e9).toFixed(2)
            : ""}
          B
        </span>
      </div>

      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="gradient-mask"></div>
      </div>
    </div>
  );
};

export default MainPageMarquee;
