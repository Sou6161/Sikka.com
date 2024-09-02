import React, { useEffect, useState } from "react";
import AnimatedGridBackground from "../components/AllBackgrounds/AnimatedGridPatternBg";
import { useDispatch, useSelector } from "react-redux";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { CoinGeckoApi } from "../api/CoinGeckoApi/CoinGeckoApi";
import { TokenInsightApi } from "../api/CoinGeckoApi/TokenInsightApi";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import CryptoPricesTable from "../CryptoMarketTable.jsx/CryptoPricesTable";
import CryptoNews from "../CoinGeckoCryptoNews/CryptoNews";
import LatestArticlesData from "../LatestArticles/LatestArticlesData";
import Footer from "../Footer/Footer";
import { addHomePageMarketCapChart } from "../ReduxSlice/HomePageMCapChart";

const MainContainer = () => {
  const MarqueeData = useSelector((state) => state.Marquee.MarqueeData);
  const MarqueeData2 = useSelector((state) => state.Marquee2.MarqueeData2);
  const [GetTrendingCoins, setGetTrendingCoins] = useState(null);
  const [AllGainers, setAllGainers] = useState(null);
  const [AllLosers, setAllLosers] = useState(null);
  const [TopGainers, setTopGainers] = useState(null);
  const [TopLosers, setTopLosers] = useState(null);
  const [MarketCapChart, setMarketCapChart] = useState(null);
  const dispatch = useDispatch();

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
          credentials: "same-origin",
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

  useEffect(() => {
    const GetAllLosers = async () => {
      const response = await fetch(
        "https://api.tokeninsight.com/api/v1/coins/top-losers?range=-1",
        {
          ...TokenInsightApi,
          credentials: "same-origin",
        }
      );
      const data = await response.json();
      setAllLosers(data?.data);
    };
    GetAllLosers();
  }, []);
  useEffect(() => {
    AllLosers && console.log(AllLosers, "Get All Gainers");
  }, [AllLosers]);

  function formatPrice(num) {
    return num?.toFixed(5);
  }

  function formatPercentage(num) {
    const formatted = num / 100;
    if (Math.abs(formatted) >= 10000) {
      return `${(formatted / 100000).toFixed(2)}%`;
    } else if (Math.abs(formatted) >= 1000) {
      return `${(formatted / 1000).toFixed(2)}%`;
    } else {
      return `${formatted.toFixed(2)}%`;
    }
  }

  useEffect(() => {
    const MarketCapChartData = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum",
        CoinGeckoApi
      );
      const MCData = await response.json();
      // console.log(MCData);
      setMarketCapChart(MCData);
      // dispatch(addHomePageMarketCapChart(MCData?.data));
    };
    MarketCapChartData();
  }, []);

  useEffect(() => {
    if (MarketCapChart && MarketCapChart.length > 0) {
      // console.log(MarketCapChart);
    }
  }, [MarketCapChart]);

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
      <div className="dingdong absolute top-[20vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[15vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[4.2vw]  font-semibold text-black flex justify-between">
          <span>
            <span className=" text-yellow-500">
              {" "}
              <img
                className=" w-[7vw] h-[4vh] inline-flex -ml-2 "
                src="https://pngfre.com/wp-content/uploads/Bitcoin-20.png"
                alt=""
              />{" "}
            </span>
            Market Cap{" "}
            <span className=" ml-2">
              ${MarqueeData2?.cap?.toLocaleString("en-US")}
            </span>
          </span>
          <span className="text-purple-600 ">
            {/* {MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0 ? (
              <FaCaretUp className="text-[4.5vw] blink-green relative top-1 2xlarge:text-[1vw]" />
            ) : (
              <FaCaretDown className="text-[4.5vw] blink-red relative top-1 2xlarge:text-[1vw]" />
            )} */}
            <span
              className={` relative right-3 blink-${
                MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0
                  ? "green"
                  : "red"
              } font-semibold flex`}
            >
              {MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0 ? (
                <FaCaretUp className="ml-2 relative top-2" />
              ) : (
                <FaCaretDown className="left- relative top-1" />
              )}
              {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                1
              )}
              %
            </span>
          </span>
        </h1>
        <h1 className="relative top-9  left-2  text-[4.2vw]  font-semibold text-black flex justify-between">
          <span>
            <span className=" text-blue-900 font-semibold">
              {" "}
              <img
                className=" w-[6vw] h-[3.5vh] inline-flex rounded-lg -ml-1"
                src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                alt=""
              />{" "}
            </span>
            Market Cap{" "}
            <span className=" ml-2">
              $
              {MarketCapChart &&
                MarketCapChart[0]?.market_cap?.toLocaleString("en-US")}
            </span>
          </span>
          <span
            className={` relative right-5 blink-${
              MarketCapChart &&
              MarketCapChart[0]?.market_cap_change_percentage_24h >= 0
                ? "green"
                : "red"
            } font-semibold flex`}
          >
            {MarketCapChart &&
            MarketCapChart[0]?.market_cap_change_percentage_24h >= 0 ? (
              <FaCaretUp className="ml-2 relative top-1" />
            ) : (
              <FaCaretDown className="ml-4 relative top-1" />
            )}
            {MarketCapChart &&
              MarketCapChart[0]?.market_cap_change_percentage_24h?.toFixed(1)}
            %
          </span>
        </h1>
        <div className="">
          <div className=" ml-[50vw] -mt-10 px-2"></div>
        </div>
      </div>

      <div className="dingdongtrading p-2 absolute top-[40vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[30vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className=" text-[#111827] font-semibold mt-2 text-[4.2vw]">
            <img
              className="w-[7vw] h-[4vh] inline-flex -ml-2"
              src="https://pngfre.com/wp-content/uploads/Bitcoin-20.png"
              alt=""
            />{" "}
            24h Trading Volume
          </h1>
          <h1 className="text-[4.5vw] font-semibold text-black mt-2">
            ${MarqueeData2?.volume.toLocaleString("en-US")}
          </h1>
        </div>
        <div className="flex justify-between relative -top-2">
          <h1 className=" font-semibold ">
            <img
              className=" w-[6vw] h-[3.5vh] inline-flex rounded-lg -ml-1"
              src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
              alt=""
            />{" "}
            24h Trading Volume
          </h1>
          <h1 className="text-[4.5vw] font-semibold text-black">
            $
            {MarketCapChart &&
              MarketCapChart[0]?.total_volume.toLocaleString("en-US")}
          </h1>
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
                  <li className=" relative -top-1  ml-6 flex justify-between">
                    {coin?.item?.name}
                    <h1 className="absolute left-[40vw] flex ">
                      ${coin?.item?.data?.price?.toFixed(5)}$
                      {formatPrice(coin?.price)}
                      {coin?.item?.data?.price_change_percentage_24h?.usd >=
                      0 ? (
                        <VscTriangleUp className="blink blink-green text-[#20AC62] relative left-1 text-[4vw] top-[.7vh]" />
                      ) : (
                        <VscTriangleDown className="blink blink-red text-[#EF4565] relative left-1 text-[4vw] top-[.7vh]" />
                      )}
                      <span
                        className={`ml-1 ${
                          coin?.item?.data?.price_change_percentage_24h?.usd >=
                          0
                            ? "blink-green text-[#20AC62]"
                            : "blink-red text-[#EF4565]"
                        } blink`}
                      >
                        {formatPercentage(
                          coin?.item?.data?.price_change_percentage_24h?.usd *
                            100
                        )}
                      </span>
                    </h1>
                  </li>
                </>
              );
            })}
          </ul>
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
        <h1 className="relative top-5 left-2 flex font-semibold">
          <ul>
            {AllGainers?.slice(0, 3).map((coin) => {
              return (
                <>
                  <img
                    className="border-[1px] border-gray-600 rounded-full w-[6vw] h-[3vh] object-fill relative top-5"
                    src={coin?.logo}
                    alt=""
                  />
                  <li className="relative -top-1 ml-8 flex justify-between">
                    {coin?.name}
                    <h1 className="absolute left-[40vw] flex">
                      ${formatPrice(coin?.price)}
                      {coin?.price_change_24h >= 0 ? (
                        <VscTriangleUp className="blink text-[#20AC62] relative left-1 text-[4vw] top-[.7vh]" />
                      ) : (
                        <VscTriangleDown className="blink-red relative left-1 text-[4vw] top-[.7vh]" />
                      )}
                      <span
                        className={`ml-1 ${
                          coin?.price_change_24h >= 0
                            ? "text-[#20AC62] blink-green"
                            : "text-red-600 blink-red"
                        }`}
                      >
                        {formatPercentage(coin?.price_change_24h * 100)}
                      </span>
                    </h1>
                  </li>
                </>
              );
            })}
          </ul>
        </h1>
      </div>
      <div className="  absolute top-[125vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[30vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-2  text-[5vw] font-semibold text-blue-600 ">
          🚀 Top Losers{" "}
          <span className=" ml-[23vw] text-[4vw] text-red-600 font-semibold hover:text-green-400 ">
            View more{" "}
            <span className=" inline-flex relative top-1 text-[4vw]">
              <FaAngleRight />
            </span>
          </span>
        </h1>
        <h1 className="relative top-5 left-2 flex font-semibold">
          <ul>
            {AllLosers?.slice(0, 3).map((coin) => {
              return (
                <>
                  <img
                    className="border-[1px] border-gray-600 rounded-full w-[6vw] h-[3vh] object-fill relative top-5"
                    src={coin?.logo}
                    alt=""
                  />
                  <li className="relative -top-1 ml-8 flex justify-between">
                    {coin?.name}
                    <h1 className="absolute left-[40vw] flex">
                      ${formatPrice(coin?.price)}
                      {coin?.price_change_24h >= 0 ? (
                        <VscTriangleUp className="blink text-[#20AC62] relative left-1 text-[4vw] top-[.7vh]" />
                      ) : (
                        <VscTriangleDown className="blink-red relative left-1 text-[4vw] top-[.7vh]" />
                      )}
                      <span
                        className={`ml-1 ${
                          coin?.price_change_24h >= 0
                            ? "text-[#20AC62] blink-green"
                            : "text-red-600 blink-red"
                        }`}
                      >
                        {formatPercentage(coin?.price_change_24h * 100)}
                      </span>
                    </h1>
                  </li>
                </>
              );
            })}
          </ul>
        </h1>
      </div>
      <div className="  absolute top-[160vh] left-5 2xlarge:left-[5vw] max-w-[90vw]    2xlarge:w-[30vw] bg-gray-20  ">
        <CryptoPricesTable />
        <CryptoNews />
        <LatestArticlesData />
        <Footer />
      </div>
      <div className=" ">
        <AnimatedGridBackground />
      </div>
    </div>
  );
};

export default MainContainer;
