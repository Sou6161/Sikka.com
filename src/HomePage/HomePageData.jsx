import React, { useEffect, useState } from "react";
import AnimatedGridBackground from "../components/AllBackgrounds/AnimatedGridPatternTestBg";
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
  const [MarketCapBNB, setMarketCapBNB] = useState(null);
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
    // AllLosers && console.log(AllLosers, "Get All Gainers");
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

  useEffect(() => {
    const MarketCapChartDataBNB = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin",
        CoinGeckoApi
      );
      const MarketDataBnb = await response.json();
      // console.log(MarketDataBnb);
      setMarketCapBNB(MarketDataBnb);
    };
    MarketCapChartDataBNB();
  }, []);

  useEffect(() => {
    if (MarketCapBNB && MarketCapBNB.length > 0) {
      // console.log(MarketCapBNB);
    }
  }, [MarketCapBNB]);

  {
    // MarqueeData2 && console.log(MarqueeData2);
  }
  return (
    <div className=" relative ">
      <h1 className="absolute top-10 left-5 z-5  text-[#fbbf24] text-[5vw] xsmall:text-[3.5vw] small:text-[3vw] medium:text-[2.5vw] large:text-[2vw] xlarge:text-[2vw] 2xlarge:text-[1.5vw] 2xlarge:left-[5vw] font-semibold">
        Cryptocurrency Prices by Market Cap
        <p className=" large:relative large:z-99  text-sky-400 text-[3.5vw] xsmall:text-[2.5vw] small:text-[2.2vw] medium:text-[2vw] 2xlarge:text-[1vw] mt-2">
          The global cryptocurrency market cap today is{" "}
          <span>
            {MarqueeData2?.cap ? (
              <span className="text-[#64748b]">
                {(MarqueeData2.cap / 1e12).toFixed(3)} Trillions, a{" "}
                <span
                  className={`text-[3.5vw] xsmall:text-[2.5vw] small:text-[2.2vw] medium:text-[2vw] relative top-1 small:top-1 xsmall:top-2 2xlarge:text-[1vw] inline-flex items-center ${
                    MarqueeData?.data?.market_cap_change_percentage_24h_usd < 0
                      ? "text-red-500"
                      : "text-[#4BCC00]"
                  }`}
                >
                  {MarqueeData?.data?.market_cap_change_percentage_24h_usd >=
                  0 ? (
                    <FaCaretUp className="text-[4vw] small:text-[3vw] medium:text-[2.5vw] 2xlarge:text-[1vw]" />
                  ) : (
                    <FaCaretDown className="text-[4vw] small:text-[3vw] medium:text-[2.5vw] 2xlarge:text-[1vw]" />
                  )}
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
          <span className="text-purple-500 hover:text-orange-400 text-[3.5vw] xsmall:text-[2.5vw] medium:text-[2vw] 2xlarge:text-[1vw] hover:cursor-pointer hover:underline">
            Read more
          </span>
        </p>
      </h1>
      <div
        className="absolute top-[20vh] left-5 w-[90vw] h-auto bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg p-4
                    xsmall:w-[80vw] xsmall:left-[10vw]
                    small:w-[70vw] small:left-[15vw]
                    medium:w-[60vw] medium:left-[20vw]
                    large:w-[80vw] large:left-[10vw] large:top-[25vh]
                    xlarge:w-[40vw] xlarge:left-[10vw] xlarge:top-[28vh]
                    2xlarge:w-[30vw] 2xlarge:left-[15vw]"
      >
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="https://pngfre.com/wp-content/uploads/Bitcoin-20.png"
                alt="Bitcoin"
              />
              <span className="text-lg font-semibold text-black">
                Market Cap
              </span>
            </div>
            <span className="text-lg font-bold text-black">
              ${MarqueeData2?.cap?.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-end mt-1">
            <span
              className={`flex items-center font-semibold ${
                MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {MarqueeData?.data?.market_cap_change_percentage_24h_usd >= 0 ? (
                <FaCaretUp className="mr-1" />
              ) : (
                <FaCaretDown className="mr-1" />
              )}
              {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                1
              )}
              %
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2 rounded-lg"
                src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                alt="Ethereum"
              />
              <span className="text-lg font-semibold text-black">
                Market Cap
              </span>
            </div>
            <span className="text-lg font-bold text-black">
              $
              {MarketCapChart &&
                MarketCapChart[0]?.market_cap?.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-end mt-1">
            <span
              className={`flex items-center font-semibold ${
                MarketCapChart &&
                MarketCapChart[0]?.market_cap_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {MarketCapChart &&
              MarketCapChart[0]?.market_cap_change_percentage_24h >= 0 ? (
                <FaCaretUp className="mr-1" />
              ) : (
                <FaCaretDown className="mr-1" />
              )}
              {MarketCapChart &&
                MarketCapChart[0]?.market_cap_change_percentage_24h?.toFixed(1)}
              %
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[45vh] left-5 w-[90vw] h-auto bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg p-4
                    xsmall:w-[80vw] xsmall:left-[10vw]
                    small:w-[70vw] small:left-[15vw]
                    medium:w-[60vw] medium:left-[20vw] medium:top-[45vh]
                    large:w-[80vw] large:left-[10vw] large:top-[50vh]
                    xlarge:w-[40vw] xlarge:left-[55vw] xlarge:top-[28vh]
                    2xlarge:w-[30vw] 2xlarge:left-[48vw]"
      >
        <div className="mb-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="https://pngfre.com/wp-content/uploads/Bitcoin-20.png"
                alt="Bitcoin"
              />
              <span className="text-sm xsmall:text-base small:text-lg font-semibold text-[#111827]">
                24h Trading Volume
              </span>
            </div>
            <span className="text-sm xsmall:text-base small:text-lg font-bold text-black">
              ${MarqueeData2?.volume?.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between  items-center">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2 rounded-lg"
                src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                alt="Ethereum"
              />
              <span className="text-sm xsmall:text-base small:text-lg font-semibold text-[#111827]">
                24h Trading Volume
              </span>
            </div>
            <span className="text-sm xsmall:text-base small:text-lg font-bold text-black">
              $
              {MarketCapChart &&
                MarketCapChart[0]?.total_volume?.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mt-6 items-center">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2 rounded-lg"
                src="https://cryptologos.cc/logos/bnb-bnb-logo.png"
                alt="Ethereum"
              />
              <span className="text-sm xsmall:text-base small:text-lg font-semibold text-[#111827]">
                24h Trading Volume
              </span>
            </div>
            <span className="text-sm xsmall:text-base small:text-lg font-bold text-black">
              $
              {MarketCapBNB &&
                MarketCapBNB[0]?.total_volume?.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>
      <div
        className="absolute top-[68vh] left-5 w-[90vw] h-auto bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg p-4
                    xsmall:w-[80vw] xsmall:left-[10vw]
                    small:w-[70vw] small:left-[15vw]
                    medium:w-[60vw] medium:left-[20vw] medium:top-[65vh]
                    large:w-[80vw] large:left-[10vw] large:top-[67vh]
                    xlarge:w-[40vw] xlarge:left-[10vw] xlarge:top-[55vh]
                    2xlarge:w-[30vw] 2xlarge:left-[15vw]"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-semibold text-blue-600">
            🔥 Trending
          </h1>
          <span className="text-lg xsmall:text-xl small:text-2xl text-red-600 font-semibold hover:text-green-400 flex items-center cursor-pointer">
            View more <FaAngleRight className="ml-1" />
          </span>
        </div>

        <ul className="space-y-4">
          {GetTrendingCoins?.coins.slice(0, 3).map((coin, index) => (
            <li key={index} className="flex items-center">
              <img
                className="border border-gray-600 rounded-full w-8 h-8 xsmall:w-10 xsmall:h-10 object-cover mr-3"
                src={coin?.item?.small}
                alt={coin?.item?.name}
              />
              <div className="flex-grow">
                <div className="font-semibold">{coin?.item?.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span>${coin?.item?.data?.price?.toFixed(5)}</span>
                  <div className="flex items-center">
                    {coin?.item?.data?.price_change_percentage_24h?.usd >= 0 ? (
                      <VscTriangleUp className="text-[#20AC62] mr-1" />
                    ) : (
                      <VscTriangleDown className="text-[#EF4565] mr-1" />
                    )}
                    <span
                      className={`${
                        coin?.item?.data?.price_change_percentage_24h?.usd >= 0
                          ? "text-[#20AC62]"
                          : "text-[#EF4565]"
                      }`}
                    >
                      {formatPercentage(
                        coin?.item?.data?.price_change_percentage_24h?.usd * 100
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute top-[107vh] left-5 w-[90vw] h-auto bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg p-4
                    xsmall:w-[80vw] xsmall:left-[10vw]
                    small:w-[70vw] small:left-[15vw]
                    medium:w-[60vw] medium:left-[20vw] medium:top-[108vh]
                    large:w-[80vw] large:left-[10vw] large:top-[108vh]
                    xlarge:w-[40vw] xlarge:left-[55vw] xlarge:top-[55vh]
                    2xlarge:w-[30vw] 2xlarge:left-[48vw]"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-semibold text-blue-600">
            🚀 Top Gainers
          </h1>
          <span className="text-lg xsmall:text-xl small:text-2xl text-red-600 font-semibold hover:text-green-400 flex items-center cursor-pointer">
            View more <FaAngleRight className="ml-1" />
          </span>
        </div>

        <ul className="space-y-4">
          {AllGainers?.slice(0, 3).map((coin, index) => (
            <li key={index} className="flex items-center">
              <img
                className="border border-gray-600 rounded-full w-8 h-8 xsmall:w-10 xsmall:h-10 object-cover mr-3"
                src={coin?.logo}
                alt={coin?.name}
              />
              <div className="flex-grow">
                <div className="font-semibold">{coin?.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span>${formatPrice(coin?.price)}</span>
                  <div className="flex items-center">
                    {coin?.price_change_24h >= 0 ? (
                      <VscTriangleUp className="text-[#20AC62] mr-1" />
                    ) : (
                      <VscTriangleDown className="text-[#EF4565] mr-1" />
                    )}
                    <span
                      className={`${
                        coin?.price_change_24h >= 0
                          ? "text-[#20AC62]"
                          : "text-[#EF4565]"
                      }`}
                    >
                      {formatPercentage(coin?.price_change_24h * 100)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="absolute top-[146vh] left-5 w-[90vw] h-auto bg-zinc-100 border-[2px] border-teal-600 shadow-teal-glow rounded-lg p-4
                    xsmall:w-[80vw] xsmall:left-[10vw]
                    small:w-[70vw] small:left-[15vw]
                    medium:w-[60vw] medium:left-[20vw] medium:top-[150vh]
                    large:w-[80vw] large:left-[10vw] large:top-[149vh]
                    xlarge:w-[40vw] xlarge:left-[33vw] xlarge:top-[97vh]
                    2xlarge:w-[30vw] 2xlarge:left-[32vw] 2xlarge:top-[93vh] "
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-semibold text-blue-600">
            📉 Top Losers
          </h1>
          <span className="text-lg xsmall:text-xl small:text-2xl text-red-600 font-semibold hover:text-green-400 flex items-center cursor-pointer">
            View more <FaAngleRight className="ml-1" />
          </span>
        </div>

        <ul className="space-y-4">
          {AllLosers?.slice(0, 3).map((coin, index) => (
            <li key={index} className="flex items-center">
              <img
                className="border border-gray-600 rounded-full w-8 h-8 xsmall:w-10 xsmall:h-10 object-cover mr-3"
                src={coin?.logo}
                alt={coin?.name}
              />
              <div className="flex-grow">
                <div className="font-semibold">{coin?.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span>${formatPrice(coin?.price)}</span>
                  <div className="flex items-center">
                    {coin?.price_change_24h >= 0 ? (
                      <VscTriangleUp className="text-[#20AC62] mr-1" />
                    ) : (
                      <VscTriangleDown className="text-[#EF4565] mr-1" />
                    )}
                    <span
                      className={`${
                        coin?.price_change_24h >= 0
                          ? "text-[#20AC62]"
                          : "text-[#EF4565]"
                      }`}
                    >
                      {formatPercentage(coin?.price_change_24h * 100)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="  absolute top-[190vh] large:top-[140vh] left-[5vw] 2xlarge:left-[5vw] max-w-[90vw]  2xlarge:max-w-[90vw]  ">
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
