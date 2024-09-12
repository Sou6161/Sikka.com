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
  const [CoinMcapDetails, setCoinMcapDetails] = useState(null);
  const [timeFrame, setTimeFrame] = useState("24h");
  const [chartType, setChartType] = useState("price");
  const [lowestMarketCap, setLowestMarketCap] = useState(0);
  const [highestMarketCap, setHighestMarketCap] = useState(0);
  const [xAxisDomain, setXAxisDomain] = useState([0, 0]);

  const priceUSD = CoinDetails?.market_data?.current_price.usd;
  const priceBTC = CoinDetails?.market_data?.current_price.btc;
  const priceChange24h = CoinDetails?.market_data?.price_change_percentage_24h;

  console.log(id, "iouhouhgghuoggoo");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate =
        timeFrame === "7d"
          ? `${date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : timeFrame === "1y"
          ? `${date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedPrice = payload[0].value / 1000;
      return (
        <div className="border border-gray-200 p-2 rounded shadow">
          <p className="text-sm">{formattedDate}</p>
          <p className="text-sm font-bold">{`Price: ${formattedPrice.toFixed(
            1
          )}K`}</p>
        </div>
      );
    }
    return null;
  };
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
      let days;
      switch (timeFrame) {
        case "24h":
          days = 1;
          break;
        case "7d":
          days = 7;
          break;
        case "1m":
          days = 30;
          break;
        case "3m":
          days = 90;
          break;
        case "1y":
          days = 365;
          break;
        default:
          days = 7;
      }
      let precision;
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

  useEffect(() => {
    const FetchCoinMCap = async () => {
      let days;
      switch (timeFrame) {
        case "24h":
          days = 1;
          break;
        case "7d":
          days = 7;
          break;
        case "1m":
          days = 30;
          break;
        case "3m":
          days = 90;
          break;
        case "1y":
          days = 365;
          break;
        default:
          days = 7;
      }
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${
          days === 1 ? "" : "daily"
        }&precision=${getPrecision(lowestMarketCap)}`,
        CoinGeckoYogeshApi
      );
      const CoinMCapData = await response.json();
      if (CoinMCapData && CoinMCapData.market_caps) {
        setCoinMcapDetails(CoinMCapData.market_caps);
        const lowest = Math.min(
          ...CoinMCapData.market_caps.map((item) => item[1])
        );
        setLowestMarketCap(lowest);
        const highest = Math.max(
          ...CoinMCapData.market_caps.map((item) => item[1])
        );
        setHighestMarketCap(highest);
        const minTime = Math.min(
          ...CoinMCapData.market_caps.map((item) => item[0])
        );
        const maxTime = Math.max(
          ...CoinMCapData.market_caps.map((item) => item[0])
        );
        setXAxisDomain([minTime, maxTime]);
      }
    };
    FetchCoinMCap();
  }, [timeFrame, id, CoinGeckoYogeshApi]);

  const getPrecision = (value) => {
    if (value < 0.0000000001) {
      return "10";
    } else if (value < 0.00000001) {
      return "9";
    } else if (value < 0.0000001) {
      return "8";
    } else if (value < 0.000001) {
      return "7";
    } else if (value < 0.00001) {
      return "6";
    } else if (value < 0.0001) {
      return "5";
    } else if (value < 0.001) {
      return "4";
    } else if (value < 0.01) {
      return "3";
    } else if (value < 0.1) {
      return "2";
    } else {
      return "0";
    }
  };
  useEffect(() => {
    CoinMcapDetails && console.log(CoinMcapDetails);
  }, [CoinMcapDetails]);

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
          <div>
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
            <button
              class="button TimeGraph mt-5 ml-3"
              onClick={() => setTimeFrame("1m")}
            >
              1m
            </button>
            <button
              class="button TimeGraph mt-5 ml-3"
              onClick={() => setTimeFrame("3m")}
            >
              3m
            </button>
            <button
              class="button TimeGraph mt-5 ml-3"
              onClick={() => setTimeFrame("1y")}
            >
              1y
            </button>
          </div>
          <div>
            <button
              class={`button TimeGraph2 mt-5 ${
                chartType === "price" ? "active" : ""
              }`}
              onClick={() => setChartType("price")}
            >
              Price
            </button>
            <button
              class={`button TimeGraph2 mt-5 ml-2 ${
                chartType === "marketCap" ? "active" : ""
              }`}
              onClick={() => setChartType("marketCap")}
            >
              Market Cap
            </button>
          </div>
        </div>
        <div className="relative top-[30vh]">
          <div className="w-full h-96 rounded-lg shadow">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "price" ? (
                <LineChart data={chartData2}>
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatXAxis}
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
              ) : (
                <LineChart
                  width={500}
                  height={300}
                  data={CoinMcapDetails}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="0"
                    tickFormatter={(unixTimestamp) => {
                      if (timeFrame === "1m") {
                        const date = new Date(unixTimestamp);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        });
                      } else if (timeFrame === "7d") {
                        const date = new Date(unixTimestamp);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        });
                      } else if (timeFrame === "3m") {
                        const date = new Date(unixTimestamp);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        });
                      } else if (timeFrame === "1y") {
                        const date = new Date(unixTimestamp);
                        return `${date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })} ${date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`;
                      } else {
                        const date = new Date(unixTimestamp);
                        return date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                    }}
                    ticks={CoinMcapDetails.map((item, index) => {
                      if (timeFrame === "1m") {
                        return index % 6 === 0 ? item[0] : null; // 8 days gap
                      } else if (timeFrame === "7d") {
                        return index % 2 === 0 ? item[0] : null; // 2 days gap
                      } else if (timeFrame === "3m") {
                        return index % 20 === 0 ? item[0] : null; // 1 month gap
                      } else if (timeFrame === "1y") {
                        return index % 50 === 0 ? item[0] : null; // 1 year gap
                      } else {
                        return item[0];
                      }
                    })}
                    tick={{ fontSize: 10 }}
                    domain={xAxisDomain}
                  />
                  <YAxis
                    tickCount={9}
                    tickFormatter={(value) => {
                      if (value >= 1e12) {
                        return `$${(value / 1e12).toFixed(2)}T`;
                      } else if (value >= 1e9) {
                        return `$${(value / 1e9).toFixed(2)}B`;
                      } else if (value >= 1e6) {
                        return `$${(value / 1e6).toFixed(2)}M`;
                      } else if (value >= 1e3) {
                        return `$${(value / 1e3).toFixed(2)}K`;
                      } else if (value < 1 && value >= 0.001) {
                        return `$${value.toFixed(6)}`;
                      } else if (value < 0.001 && value >= 0.000001) {
                        return `$${value.toFixed(8)}`;
                      } else if (value < 0.000001 && value >= 0.00000001) {
                        return `$${value.toFixed(10)}`;
                      } else {
                        return `$${value.toFixed(2)}`;
                      }
                    }}
                    domain={[lowestMarketCap, highestMarketCap]}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    label={CoinMcapDetails[0][0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="1"
                    stroke="#8884d8"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinFullDetails;
