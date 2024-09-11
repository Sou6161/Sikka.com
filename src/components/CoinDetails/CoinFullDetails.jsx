import React, { useEffect, useState, useMemo } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { useParams } from "react-router-dom";
import { FaCaretDown, FaCaretUp, FaStar } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CoinGeckoApi,
  CoinGeckoYogeshApi,
} from "../../api/CoinGeckoApi/CoinGeckoApi";

const formatXAxis = (unixTimestamp) => {
  const date = new Date(unixTimestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedPrice = payload[0].value / 1000;
    return (
      <div className="border border-gray-200 p-2 rounded shadow">
        <p className="text-sm">{`${date.toLocaleString()}`}</p>
        <p className="text-sm font-bold">{`Price: ${formattedPrice.toFixed(
          1
        )}K`}</p>
      </div>
    );
  }
  return null;
};

const formatPrice = (price) => {
  if (price >= 100) {
    return price.toFixed(2);
  } else if (price >= 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
};

const CoinFullDetails = () => {
  const { id } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [CoinDetails, setCoinDetails] = useState(null);
  const [CoinChartDetails, setCoinChartDetails] = useState(null);
  const [timeFrame, setTimeFrame] = useState("24h");
  const priceUSD = CoinDetails?.market_data?.current_price.usd;
  const priceBTC = CoinDetails?.market_data?.current_price.btc;
  const priceChange24h = CoinDetails?.market_data?.price_change_percentage_24h;

  console.log(id, "iouhouhgghuoggoo");

  const Dashboard = ({ CoinChartDetails, lowPrice, highPrice, tickValues }) => {
    // Check if CoinChartDetails is null or empty
    if (!CoinChartDetails || CoinChartDetails.length === 0) {
      return <div>No data available</div>;
    }
  };

  // Transform CoinChartDetails into the format expected by recharts
  const chartData2 =
    CoinChartDetails &&
    CoinChartDetails.map((detail) => ({
      time: detail[0],
      price: detail[4], // Using the closing price (index 4)
    }));

  const chartData = useMemo(() => {
    return (
      CoinChartDetails &&
      CoinChartDetails.map((detail) => ({
        timestamp: detail[0],
        price: detail[4], // Using the closing price
      }))
    );
  }, [CoinChartDetails]);

  // Safely determine the domain for XAxis
  const xDomain =
    chartData?.length > 0
      ? [chartData[0].time, chartData[chartData?.length - 1].time]
      : [0, 1]; // Fallback domain if chartData is empty

  const lowPrice = CoinDetails?.market_data?.low_24h?.usd ?? 0;
  const highPrice = CoinDetails?.market_data?.high_24h?.usd ?? 0;

  const tickGap = (highPrice - lowPrice) / 8; // 8 ticks, including min and max

  const tickValues = Array(9)
    .fill(0)
    .map((_, i) => lowPrice + i * tickGap);

  const lowestPrice =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Math.min(...CoinChartDetails.map((data) => data[4]))
      : 0;
  const highestPrice =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Math.max(...CoinChartDetails.map((data) => data[4]))
      : 0;
  const tickValuesLowPrices =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Array(10)
          .fill(0)
          .map((_, i) => {
            const step = (highestPrice - lowestPrice) / 9;
            return Math.round((lowestPrice + step * i) / 1000) * 1000;
          })
      : [];
  useEffect(() => {
    const FetchCoinDetails = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=true&sparkline=true`,
        CoinGeckoYogeshApi
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

  useEffect(() => {
    const FetchCoinChart = async () => {
      const days = timeFrame === "24h" ? 1 : 7;
      let precision; // Define precision here
      const price = CoinDetails?.market_data?.current_price?.usd;
      if (price < 0.0001) {
        precision = 10;
      } else if (price < 0.01) {
        precision = 8;
      } else if (price < 1) {
        precision = 6;
      } else {
        precision = 2;
      }
      // Add a default value for precision
      precision = precision || 2;
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}&precision=${precision}`,
        CoinGeckoYogeshApi
      );
      const chartdata = await chartResponse.json();
      setCoinChartDetails(chartdata);
    };
    FetchCoinChart();
  }, [timeFrame, id, CoinDetails, CoinGeckoYogeshApi]);

  useEffect(() => {
    CoinChartDetails && console.log(CoinChartDetails);
  }, [CoinChartDetails]);
  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-[100vw] h-[200vh] text-white bg-black overflow-x-hidden">
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
          <h1 className="relative text-[7.5vw] left-[4vh] top-[10vh]">
            <span className="min-w-[20vw]">
              $
              {CoinDetails?.market_data?.current_price?.usd >= 100
                ? CoinDetails?.market_data?.current_price?.usd?.toFixed(
                    CoinDetails?.market_data?.current_price?.usd
                      ?.toString()
                      .split(".")[0].length > 2
                      ? 2
                      : CoinDetails?.market_data?.current_price?.usd
                          ?.toString()
                          .split(".")[0] === "0"
                      ? 8
                      : 4
                  )
                : CoinDetails?.market_data?.current_price?.usd?.toFixed(8)}
            </span>
          </h1>
          <h1 className=" text-[3.5vw] relative top-[11vh] left-[10vw] inline-flex">
            <span className="min-w-[20vw]">
              {CoinDetails?.market_data?.current_price?.btc
                ?.toString()
                .split(".")[0] === "0"
                ? CoinDetails?.market_data?.current_price?.btc?.toFixed(8)
                : CoinDetails?.market_data?.current_price?.btc >= 100
                ? CoinDetails?.market_data?.current_price?.btc?.toFixed(
                    CoinDetails?.market_data?.current_price?.btc
                      ?.toString()
                      .split(".")[0].length > 2
                      ? 4
                      : 4
                  )
                : CoinDetails?.market_data?.current_price?.btc?.toFixed(
                    10
                  )}{" "}
              BTC
            </span>
            <span className="text-green-400 text-[5vw] relative font-semibold left-[33vw] -top-[6vh]">
              {CoinDetails?.market_data?.price_change_percentage_24h >= 0 ? (
                <FaCaretUp className="inline-flex blink-green text-[5.5vw] relative -top-1" />
              ) : (
                <FaCaretDown className="inline-flex blink-red text-[5.5vw] relative -top-1" />
              )}
              <span
                className={`${
                  CoinDetails?.market_data?.price_change_percentage_24h >= 0
                    ? "blink-green"
                    : "blink-red"
                }`}
              >
                {CoinDetails?.market_data?.price_change_percentage_24h?.toFixed(
                  CoinDetails?.market_data?.price_change_percentage_24h
                    ?.toString()
                    .split(".")[0].length > 2
                    ? 2
                    : CoinDetails?.market_data?.price_change_percentage_24h
                        ?.toString()
                        .split(".")[0] === "0 "
                    ? 10
                    : 2
                )}
                %
              </span>
            </span>
            <span className="relative right-[17vw]">
              {CoinDetails?.market_data?.price_change_percentage_24h_in_currency
                ?.btc >= 0 ? (
                <FaCaretUp className="inline-flex blink-green relative -top-[0.3vw]" />
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
                  CoinDetails?.market_data?.price_change_percentage_24h_in_currency?.btc
                    ?.toString()
                    .split(".")[0].length > 2
                    ? 2
                    : CoinDetails?.market_data?.price_change_percentage_24h_in_currency?.btc
                        ?.toString()
                        .split(".")[0] === "0 "
                    ? 10
                    : 2
                )}
                %
              </span>
            </span>
          </h1>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 50"
            className="w-full h-auto relative top-[12vh]"
          >
            <defs>
              <linearGradient
                id="priceGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "red", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "green", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <rect
              x="10"
              y="10"
              width="280"
              height="10"
              fill="url(#priceGradient)"
              rx="5"
              ry="5"
            />
            <text x="10" y="45" fontFamily="Arial" fontSize="12" fill="red">
              $
              {CoinDetails?.market_data?.low_24h?.usd?.toFixed(
                CoinDetails?.market_data?.low_24h?.usd?.toString().split(".")[0]
                  .length > 2
                  ? 2
                  : CoinDetails?.market_data?.low_24h?.usd
                      ?.toString()
                      .split(".")[0] === "0"
                  ? 8
                  : 4
              )}
            </text>
            <text x="235" y="45" fontFamily="Arial" fontSize="12" fill="green">
              $
              {CoinDetails?.market_data?.high_24h?.usd?.toFixed(
                CoinDetails?.market_data?.high_24h?.usd
                  ?.toString()
                  .split(".")[0].length > 2
                  ? 2
                  : CoinDetails?.market_data?.high_24h?.usd
                      ?.toString()
                      .split(".")[0] === "0"
                  ? 8
                  : 4
              )}
            </text>
          </svg>
        </div>
        <div className=" relative top-[15vh] left-5">
          <h1>
            {CoinDetails?.name} Price Chart{" "}
            {`(${CoinDetails?.symbol?.toUpperCase()})`}
          </h1>

          <button
            class="button TimeGraph mt-5"
            onClick={() => setTimeFrame("24h")}
          >
            24h
          </button>
          <button
            class="button TimeGraph mt-5 ml-3"
            onClick={() => setTimeFrame("7d")}
          >
            7d
          </button>
        </div>
        <div className="relative top-[30vh]">
          <div className="w-full h-96 rounded-lg shadow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData2}>
                <XAxis
                  dataKey="time"
                  tickFormatter={formatXAxis}
                  // interval="preserveStartEnd"
                  minTickGap={30}
                  tick={{ fontSize: 10 }}
                  domain={xDomain}
                />
                <YAxis
                  tickCount={9}
                  tickValues={tickValuesLowPrices}
                  tickFormatter={(value) => {
                    if (value < 0.01) {
                      return `$${value.toFixed(10)}`;
                    } else if (value < 1) {
                      return `$${value.toFixed(2)}`;
                    } else {
                      return `$${(value / 1000).toFixed(1)}K`;
                    }
                  }}
                  domain={[lowestPrice, highestPrice]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={priceChange24h >= 0 ? "#00FF00" : "#FF0000"}
                  className={
                    priceChange24h >= 0
                      ? "blink-greensingle"
                      : "blink-redsingle"
                  }
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinFullDetails;
