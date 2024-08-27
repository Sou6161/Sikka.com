import React, { useEffect, useState } from "react";
import AnimatedGridBackground from "../components/AllBackgrounds/AnimatedGridPatternBg";
import { useSelector } from "react-redux";
import { FaCaretUp } from "react-icons/fa";
import CryptoChart from "../Charts/MarketCap/MarketCapChart";
import { FaAngleRight } from "react-icons/fa6";
import { CoinGeckoApi } from "../api/CoinGeckoApi/CoinGeckoApi";
import { TokenInsightApi } from "../api/CoinGeckoApi/TokenInsightApi";
import { VscTriangleUp } from "react-icons/vsc";
import CryptoPricesTable from "../CryptoMarketTable.jsx/CryptoPricesTable";

const MainContainer = () => {
  const MarqueeData = useSelector((state) => state.Marquee.MarqueeData);
  const MarqueeData2 = useSelector((state) => state.Marquee2.MarqueeData2);
  const [GetTrendingCoins, setGetTrendingCoins] = useState(null);
  const [AllGainers, setAllGainers] = useState(null);
  const [TopGainers, setTopGainers] = useState(null);
  const [TopLosers, setTopLosers] = useState(null);

  useEffect(() => {
    const GetTrendingCoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        CoinGeckoApi
      );
      const data = await response.json();
      // console.log(data, "Get trending coins");
      setGetTrendingCoins(data);
    };
    GetTrendingCoins();
  }, []);

  useEffect(() => {
    // GetTrendingCoins && console.log(GetTrendingCoins);
  }, [GetTrendingCoins]);

  useEffect(() => {
    const GetGainersLosers = async () => {
      const response = await fetch(
        "https://api.tokeninsight.com/api/v1/coins/top-gainers?range=-1",
        {
          ...TokenInsightApi,
          credentials: "same-origin"
        }
      );
      const data = await response.json();
      setAllGainers(data?.data);
    };
    GetGainersLosers();
  }, []);
  useEffect(() => {
    // AllGainers && console.log(AllGainers, "Get All Gainers");
  }, [AllGainers]);

  {
    // MarqueeData2 && console.log(MarqueeData2);
  }
  return (
    <div className=" relative ">
      <h1 className="absolute top-10 left-5 z-10 text-[#fbbf24] text-[5vw] 2xlarge:text-[2vw] 2xlarge:left-[5vw] font-semibold  ">
        Cryptocurrency Prices by Market Cap
        <p className=" text-sky-400 text-[3.5vw] 2xlarge:text-[1vw] mt-2">
          The global cryptocurrency market cap today is{" "}
          <span>
            {MarqueeData2?.cap ? (
              <span className=" text-white">
                {(MarqueeData2.cap / 1e12).toFixed(3)} Trillions, a{" "}
                <span className="text-[#4BCC00] text-[3.5vw] relative top-1 2xlarge:text-[1vw] inline-flex items-center">
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
          </span>{" "}
          change in the last 24 hours.{" "}
          <span className="text-purple-500 hover:text-orange-400 text-[3.5vw] 2xlarge:text-[1vw] hover:cursor-pointer hover:underline">
            Read more
          </span>
        </p>
      </h1>
      <div className=" dingdong absolute top-[20vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[15vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[5vw]  font-semibold text-black ">
          ${MarqueeData2?.cap?.toLocaleString("en-US")}
        </h1>
        <h1 className=" relative top-5 text-purple-600 left-2 flex font-semibold  ">
          Market Cap{" "}
          <FaCaretUp className=" text-[4.5vw] text-[#4BCC00]  relative top-1  2xlarge:text-[1vw]" />{" "}
          <span className=" text-[#4BCC00] font-semibold">
            {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
              1
            )}{" "}
            %
          </span>
        </h1>
        <div className="">
          <div className=" ml-[50vw] -mt-10 px-2">
            <CryptoChart />
          </div>
        </div>
      </div>

      <div className=" dingdongtrading absolute top-[40vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[15vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[5vw] font-semibold text-black ">
          ${MarqueeData2?.volume.toLocaleString("en-US")}{" "}
        </h1>
        <h1 className=" relative top-5 left-2 text-purple-600 flex font-semibold  ">
          24h Trading Volume{" "}
        </h1>
        <div className="">
          <div className=" ml-[50vw] -mt-10 px-2">
            <CryptoChart />
          </div>
        </div>
      </div>

      <div className="   absolute top-[60vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[30vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[5vw] font-semibold text-blue-600 ">
          🔥 Trending{" "}
          <span className=" ml-[30vw] text-[4vw] text-red-600 font-semibold hover:text-green-400 ">
            View more{" "}
            <span className=" inline-flex relative top-1 text-[4vw]">
              <FaAngleRight />
            </span>
          </span>
        </h1>
        <h1 className=" relative top-5 left-2 flex font-semibold  ">
          <ul>
            {GetTrendingCoins?.coins.slice(0, 3).map((coin) => {
              return (
                <>
                  <img
                    className=" border-[1px] border-gray-600 rounded-full w-[6vw] h-[3vh] object-fill relative top-5 "
                    src={coin?.item?.small}
                    alt=""
                  />
                  <li className=" relative -top-1  ml-8 flex justify-between">
                    {coin?.item?.name}
                    <h1 className="absolute  left-[40vw] ">
                      ${coin?.item?.data?.price?.toFixed(3)}
                    </h1>
                  </li>
                </>
              );
            })}
          </ul>{" "}
        </h1>
      </div>

      <div className="  absolute top-[92vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[30vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[5vw] font-semibold text-blue-600 ">
          🚀 Top Gainers{" "}
          <span className=" ml-[23vw] text-[4vw] text-red-600 font-semibold hover:text-green-400 ">
            View more{" "}
            <span className=" inline-flex relative top-1 text-[4vw]">
              <FaAngleRight />
            </span>
          </span>
        </h1>
        <h1 className=" relative top-5 left-2 flex font-semibold  ">
          <ul>
            {AllGainers?.slice(0, 3).map((coin) => {
              return (
                <>
                  <img
                    className=" border-[1px]  border-gray-600 rounded-full  w-[6vw] h-[3vh] object-fill relative top-5 "
                    src={coin?.logo}
                    m
                    alt=""
                  />
                  <li className=" relative -top-1  ml-8 flex justify-between">
                    {coin?.name}
                    <h1 className="absolute  left-[40vw] flex ">
                      ${coin?.price?.toFixed(3)}
                      <VscTriangleUp className=" blink text-[#20AC62] relative left-1   text-[4vw] top-[.7vh]" />
                      <span className="ml-1 text-[#20AC62] blink">
                        {(coin?.price_change_24h * 100).toFixed(1)}%
                      </span>
                    </h1>
                  </li>
                </>
              );
            })}
          </ul>{" "}
        </h1>
      </div>
      <div className="  absolute top-[124vh] left-5 2xlarge:left-[5vw] max-w-[90vw]    2xlarge:w-[30vw] bg-gray-20  ">
        <CryptoPricesTable />
      </div>
      <div className=" ">
        <AnimatedGridBackground />
      </div>
    </div>
  );
};

export default MainContainer;
