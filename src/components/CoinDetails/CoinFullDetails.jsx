import React, { useEffect, useState, useMemo, useCallback } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { Link, useParams } from "react-router-dom";
import { FaCaretDown, FaCaretUp, FaStar } from "react-icons/fa";
import { ChevronDown, ChevronUp, Search, Copy, Star } from "lucide-react";
import { ExternalLink } from "lucide-react";
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
  CoinGeckoRixerApi,
  CoinGeckoYogeshApi,
} from "../../api/CoinGeckoApi/CoinGeckoApi";
import { MdSwapVert } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import CoinNewsInDetails from "../../CoinGeckoCryptoNews/CoinNewsInDetails";
import Footer from "../../Footer/Footer";

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

const CoinFullDetails = ({ contractAddress, marketsData }) => {
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
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [amount, setAmount] = useState("1");
  const [currencies, setCurrencies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [hyperlinks, setHyperlinks] = useState({});
  const truncatedAddress = `${
    CoinDetails &&
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(0, 6)
  }...${
    CoinDetails &&
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(-5)
  }`;
  const [MarketsData, setMarketsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableNext, setDisableNext] = useState(false);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [usdToInrRate, setUsdToInrRate] = useState(0);
  const [currency, setCurrency] = useState("INR");

  const [CoinLatestNews, setCoinLatestNews] = useState(null);
  const [renderedNews, setRenderedNews] = useState([]);
  const [TrendingCoins, setTrendingCoins] = useState(null);

  let targetCount = 11;

  useEffect(() => {
    if (!CoinLatestNews) return;

    const loadImages = async () => {
      let validNews = [];
      let index = 0;

      while (validNews.length < targetCount && index < CoinLatestNews.length) {
        const item = CoinLatestNews[index];
        if (item.urlToImage) {
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = item.urlToImage;
            });
            validNews.push(item);
          } catch (error) {
            // Image failed to load, skip this item
          }
        }
        index++;

        if (index >= CoinLatestNews.length && validNews.length < targetCount) {
          index = 0; // Start over if we haven't found enough valid news items
        }
      }

      setRenderedNews(validNews);
    };

    loadImages();
  }, [CoinLatestNews, targetCount]);

  const itemsPerPage = 100;

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => response.json())
      .then((data) => setUsdToInrRate(data.rates.INR))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const text = CoinDetails && CoinDetails?.description?.en;
    if (!text) return;

    const regex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/g;
    let match;

    let newText = text;
    while ((match = regex.exec(text)) !== null) {
      const url = match && match[1];
      const linkText = match && match[2];
      newText = newText.replace(
        match[0],
        `<a href="${url}" style="color: blue; text-decoration: underline">${linkText}</a>`
      );
    }

    setDescription(newText);
  }, [CoinDetails]);

  const explorers =
    CoinDetails &&
    CoinDetails?.links?.blockchain_site.filter((site) => site !== "");

  console.log(id, "iouhouhgghuoggoo");

  useEffect(() => {
    if (
      CoinDetails &&
      CoinDetails.market_data &&
      CoinDetails.market_data.current_price
    ) {
      setCurrencies(Object.keys(CoinDetails.market_data.current_price));
    }
  }, [CoinDetails]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers (including decimals)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const convertedAmount =
    CoinDetails?.market_data?.current_price[selectedCurrency] *
    parseFloat(amount);

  const timeframes = [
    { label: "1h", dataKey: "price_change_percentage_1h_in_currency" },
    { label: "24h", dataKey: "price_change_percentage_24h_in_currency" },
    { label: "7d", dataKey: "price_change_percentage_7d_in_currency" },
    { label: "14d", dataKey: "price_change_percentage_14d_in_currency" },
    { label: "30d", dataKey: "price_change_percentage_30d_in_currency" },
    { label: "1y", dataKey: "price_change_percentage_1y_in_currency" },
  ];

  const formatPercentage = (value) => {
    if (value === undefined) return "N/A";
    const formattedValue = value.toFixed(2);
    const color = value >= 0 ? "text-green-500" : "text-red-500";
    const arrow = value >= 0 ? "▲" : "▼";
    return (
      <span className={`${color} flex items-center justify-center`}>
        <span className="mr-1">{arrow}</span>
        <span className="mr-5">{Math.abs(formattedValue)}%</span>
      </span>
    );
  };

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
    CoinDetails && console.log(CoinDetails);
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
    CoinChartDetails && console.log(CoinChartDetails, `${CoinDetails?.name}`);
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
      if (CoinMCapData && CoinMCapData?.market_caps) {
        setCoinMcapDetails(CoinMCapData?.market_caps);
        const lowest = Math.min(
          ...CoinMCapData?.market_caps.map((item) => item[1])
        );
        setLowestMarketCap(lowest);
        const highest = Math.max(
          ...CoinMCapData?.market_caps.map((item) => item[1])
        );
        setHighestMarketCap(highest);
        const minTime = Math.min(
          ...CoinMCapData?.market_caps.map((item) => item[0])
        );
        const maxTime = Math.max(
          ...CoinMCapData?.market_caps.map((item) => item[0])
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
    CoinMcapDetails &&
      console.log(
        CoinMcapDetails,
        `Market cap detailssssss ${CoinDetails?.name}`
      );
  }, [CoinMcapDetails]);

  const fetchMarketsData = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/tickers?include_exchange_logo=true&page=${page}&order=trust_score_desc&depth=true`,
        CoinGeckoRixerApi
      );
      const marketData = await response.json();
      setMarketsData(marketData?.tickers || []);
      setDisableNext(marketData?.tickers?.length < itemsPerPage);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketsData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketsData(currentPage);
  }, [currentPage, fetchMarketsData]);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setDisablePrevious(page === 1);
  }, []);

  const handleNextPage = useCallback(() => {
    if (!disableNext) {
      handlePageChange(currentPage + 1);
    }
  }, [disableNext, currentPage, handlePageChange]);

  const handlePreviousPage = useCallback(() => {
    if (!disablePrevious) {
      handlePageChange(currentPage - 1);
    }
  }, [disablePrevious, currentPage, handlePageChange]);

  useEffect(() => {
    MarketsData && console.log(MarketsData, " Tickers  Markets Data for coins");
  }, [MarketsData]);

  useEffect(() => {
    const FetchTrendingCoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        CoinGeckoRixerApi
      );
      const trendingcoins = await response.json();
      // console.log(trendingcoins);
      setTrendingCoins(trendingcoins?.coins);
    };
    FetchTrendingCoins();
  }, []);

  useEffect(() => {
    TrendingCoins && console.log(TrendingCoins, "Trending Coins");
  }, [TrendingCoins]);

  // useEffect(() => {
  //   const FetchCoinLatestNews = async () => {
  //     const response = await fetch(
  //       `https://newsapi.org/v2/everything?exact_phrase=tether&q="tether"&language=en&to=2024-09-17&apiKey=fbecde2b44f445b4b1fa9f89ae474dd3`
  //     );
  //     const CoinNews = await response.json();
  //     // console.log(CoinNews);
  //     setCoinLatestNews(CoinNews?.articles);
  //   };
  //   FetchCoinLatestNews();
  // }, []);

  // useEffect(() => {
  //   CoinLatestNews && console.log(CoinLatestNews, "Coin Latest News");
  // }, [CoinLatestNews]);

  // useEffect(() => {
  //   const abcd = async () => {
  //     const res = await fetch(
  //       `https://api.coingecko.com/api/v3/coins/${id}/news`,
  //       CoinGeckoRixerApi
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //   };
  //   // abcd();
  // });

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-[100vw]  text-white bg-black overflow-x-hidden">
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
              class={`button TimeGraph3  mt-5 ml-2 ${
                chartType === "marketCap" ? "active" : ""
              }`}
              onClick={() => setChartType("marketCap")}
            >
              Market Cap
            </button>
          </div>
        </div>
        <div className="relative top-[30vh] w-[100vw]">
          <div className="w-[90vw] h-96 rounded-lg shadow relative left-3  ">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "price" ? (
                <LineChart data={chartData2}>
                  {console.log("LineChart is rendering")}
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatXAxis}
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                    domain={xDomain}
                  />
                  <YAxis
                    className=" text-[2.5vw]"
                    tickCount={9}
                    tickValues={tickValuesLowPrices}
                    tickFormatter={(value) => {
                      if (value < 0.01) {
                        return `$${value.toFixed(10)}`;
                      } else if (value < 1) {
                        return `$${value.toFixed(3)}`;
                      } else if (value < 1000000) {
                        return `$${(value / 1000).toFixed(2)}K`;
                      } else {
                        return `$${(value / 1000000).toFixed(2)}M`;
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
        <div className="relative top-[35vh]">
          <div className="flex justify-between w-[95vw] mx-auto bg-gray-500/30 backdrop-blur-md border-2 text-black p-2 overflow-x-auto hide-scrollbar rounded-2xl">
            {timeframes.map((timeframe, index) => (
              <div key={timeframe.label} className="text-center">
                <div
                  className={`font-bold mb-2  ${
                    index === 0
                      ? "bg-yellow-600 text-black p-2 rounded-t-lg SmallTable ml-4  "
                      : "bg-yellow-600 text-black p-2 rounded-t-lg SmallTable ml-1"
                  }`}
                >
                  {timeframe.label}
                </div>
                <div className=" text-[4vw] w-[28vw] mx-auto bg-stone-700 border-r-[1px] relative left-   border-gray-400 p-2">
                  {formatPercentage(
                    CoinDetails?.market_data?.[timeframe.dataKey]?.usd
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" relative top-[42vh] left-5">
          <h1 className=" text-[6vw]">{CoinDetails?.name} Converter</h1>
          <div className="bg-white shadow-md rounded-lg p-4 w-[90vw] mt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-xl text-black">
                {CoinDetails?.symbol?.toUpperCase()}
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-24 px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                >
                  {selectedCurrency.toUpperCase()}
                  <ChevronDown size={16} />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {currencies.map((currency) => (
                      <button
                        key={currency}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        onClick={() => handleCurrencyChange(currency)}
                      >
                        {currency.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 text-lg text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter amount"
            />
            <div className="text-2xl font-bold text-red-600">
              {!isNaN(convertedAmount) ? convertedAmount.toFixed(2) : "0.00"}{" "}
              {selectedCurrency.toUpperCase()}
            </div>
          </div>
        </div>
        <div className=" relative top-[48vh] left-5">
          <h1 className=" text-[6vw]">{CoinDetails?.name} Figures</h1>
          <div className=" inline-flex mt-5">
            <h1 className="mr-[30vw]">Market cap</h1>
            <h1 className=" font-bold">
              ${CoinDetails?.market_data?.market_cap?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[40vw]">Market Cap/FDV</h1>
            <h1 className="font-bold">
              {CoinDetails?.market_data?.market_cap_fdv_ratio}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[10vw]">Fully Diluted Valuation</h1>
            <h1 className=" font-bold">
              $
              {CoinDetails?.market_data?.fully_diluted_valuation?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[20vw]">Circulating Supply</h1>
            <h1 className="font-bold">
              {CoinDetails?.market_data?.circulating_supply.toFixed(0)}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[35vw]">Total Supply</h1>
            <h1 className="font-bold">
              {CoinDetails?.market_data?.total_supply.toFixed(0)}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[35vw]">Max Supply</h1>
            <h1 className="font-bold">
              {CoinDetails?.market_data?.total_supply.toFixed(0)}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[30vw]">Total Volume</h1>
            <h1 className="font-bold">
              ${CoinDetails?.market_data?.total_volume?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
        </div>
        <div className=" relative top-[55vh] left-5">
          <h1 className="text-[6vw]">Info</h1>
          {CoinDetails?.detail_platforms?.ethereum?.contract_address && (
            <div className="flex flex-col w-full max-w-3xl">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm font-medium">Contract</span>
                <div className="flex items-center ml-5 relative left-10 space-x-1 bg-gray-100 rounded-full px-3 py-1">
                  <img
                    src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                    alt=""
                    className="w-[4vw] h-[2vh] object-cover rounded-full"
                  />
                  <span className="text-xs font-medium">Ethereum</span>
                  <span className="text-xs font-semibold">
                    {truncatedAddress}
                  </span>
                  <Copy
                    className="w-4 h-4  text-gray-800 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        CoinDetails &&
                          CoinDetails?.detail_platforms?.ethereum
                            ?.contract_address
                      );
                    }}
                  />
                  <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>
              <div className="mt-2 border-b border-gray-200 w-full"></div>
            </div>
          )}
          {(CoinDetails?.links?.homepage[0] ||
            CoinDetails?.links?.announcement_url[0]) && (
            <div className="inline-flex mt-5 gap-2">
              <h1 className="mr-[20vw] text-white text-[4.5vw]">Website</h1>
              {CoinDetails?.links?.homepage[0] && (
                <Link to={CoinDetails?.links?.homepage[0]}>
                  <h1 className="bg-cyan-500 px-2 py-1 rounded-xl font-bold  text--800">
                    {CoinDetails?.links?.homepage[0]
                      .replace(/^https?:\/\/(www\.)?/, "")
                      .replace(/\/+/g, "")
                      .replace(/^\.+/, "")}
                  </h1>
                </Link>
              )}
              {CoinDetails?.links?.announcement_url[0] && (
                <Link
                  to={
                    CoinDetails?.links?.announcement_url[0] ||
                    CoinDetails?.links?.whitepaper
                  }
                >
                  <h1 className="bg-cyan-500 px-2 py-1 rounded-xl font-bold  text--800">
                    {CoinDetails?.links?.announcement_url[0]
                      ? CoinDetails?.links?.announcement_url[0]
                          .replace(/^https?:\/\/(www\.)?/, "")
                          .replace(/\/+/g, "")
                          .replace(/^\.+/, "")
                      : "Whitepaper"}
                  </h1>
                </Link>
              )}
            </div>
          )}
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className="inline-flex mt-5 relative">
            <h1 className="mr-[20vw] text-white text-[4.5vw]">Explorers</h1>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="bg-white px-2 py-1 rounded-xl font-bold text-black flex items-center"
              >
                {explorers && explorers[0]
                  ? new URL(explorers[0]).hostname
                  : "Mempool"}
                {isOpen ? (
                  <ChevronUp className="ml-2" />
                ) : (
                  <ChevronDown className="ml-2" />
                )}
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {explorers.slice(1).map((site, index) => (
                      <Link
                        key={index}
                        to={site}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {new URL(site).hostname}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-5">
            <h1 className=" mr-[20vw] text-white text-[4.5vw]">Community</h1>{" "}
            <Link
              to={`https://x.com/${CoinDetails?.links?.twitter_screen_name}`}
              className=""
            >
              <h1 className=" bg-cyan-500 px-2 py-1 inline-flex rounded-xl text-[3.5vw] font-bold  text--800">
                {" "}
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzPDlXeNQE8FwF2AhD7WUcVhfn2NlrqfJdmZJUOp1Tk0T4yYeuF50V3aVtd4H7YzdZOjc&usqp=CAU"
                  alt=""
                  className=" w-[5vw] h-[2.5vh]  object-cover rounded-full"
                />
                Twitter
              </h1>
            </Link>
            <Link to={CoinDetails?.links?.subreddit_url}>
              <h1 className=" bg-purple-500 px-2   py-1 rounded-xl inline-flex ml-2 text-[3.5vw] font-bold">
                <img
                  src="https://pbs.twimg.com/profile_images/1729909787029078016/dBjB3Fnr_400x400.jpg"
                  alt=""
                  className=" w-[5vw] h-[2.5vh]  object-cover rounded-full"
                />{" "}
                Reddit
              </h1>
            </Link>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-5">
            <h1 className=" mr-[45vw] text-white text-[4.5vw]">Search on</h1>{" "}
            <Link to="https://x.com/?lang=en">
              <h1 className=" bg-cyan-500 px-2 py-1 rounded-xl inline-flex font-bold  text--800">
                {" "}
                <Search /> Twitter
              </h1>
            </Link>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className=" inline-flex mt-5">
            <h1 className=" mr-[35vw] text-white text-[4.5vw]">Source Code</h1>{" "}
            <Link to={CoinDetails?.links?.repos_url?.github[0]}>
              <h1 className=" bg-cyan-500 px-2 py-1 rounded-xl gap-2 inline-flex font-bold  text--800">
                {" "}
                <img
                  src="https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU"
                  alt=""
                  className="w-[6vw] h-[3vh] object-cover rounded-full"
                />{" "}
                Github
              </h1>
            </Link>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className="inline-flex mt-5">
            <h1 className="mr-[35vw] text-white text-[4.5vw]">API ID</h1>
            <h1 className="bg-cyan-500 px-2 py-1 rounded-xl font-bold text--800">
              {CoinDetails?.id}
            </h1>
            <button
              className="ml-2"
              onClick={() => navigator.clipboard.writeText(CoinDetails?.id)}
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className="inline-flex mt-5">
            <h1 className="mr-[25vw] text-white text-[4.5vw]">Chains</h1>
            <div className="relative">
              <h1
                className="bg-cyan-500 px-2 py-1 rounded-xl font-bold text--800 flex items-center cursor-pointer"
                onClick={() =>
                  document.getElementById("dropdown").classList.toggle("hidden")
                }
              >
                {CoinDetails?.categories?.find((category) =>
                  category.includes("Ecosystem")
                )}
                <ChevronDown className="w-5 h-5 ml-2" />
              </h1>
              <div
                id="dropdown"
                className="absolute hidden mt-2 bg-gray-500 rounded-xl"
              >
                {CoinDetails?.categories
                  ?.filter(
                    (category) =>
                      category.includes("Ecosystem") &&
                      category !==
                        CoinDetails?.categories?.find((category) =>
                          category.includes("Ecosystem")
                        )
                  )
                  .map((category) => (
                    <h1
                      key={category}
                      className="px-2 py-3 font-bold text--800"
                    >
                      {category}
                    </h1>
                  ))}
              </div>
            </div>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
          <div className="inline-flex mt-5">
            <h1 className="mr-[20vw] text-white text-[4.5vw]">Categories</h1>
            <div className="relative">
              <h1
                className="bg-cyan-500 px-2 py-1 rounded-xl font-bold text--800 flex items-center cursor-pointer"
                onClick={() =>
                  document
                    .getElementById("dropdown1")
                    .classList.toggle("hidden")
                }
              >
                {CoinDetails?.categories?.find(
                  (category) => !category.includes("Ecosystem")
                )}
                <ChevronDown className="w-5 h-5 ml-2" />
              </h1>
              <div
                id="dropdown1"
                className="absolute hidden bg-gray-500 mt-2 rounded-xl"
              >
                {CoinDetails?.categories
                  ?.filter(
                    (category) =>
                      !category.includes("Ecosystem") &&
                      category !==
                        CoinDetails?.categories?.find(
                          (category) => !category.includes("Ecosystem")
                        )
                  )
                  .map((category) => (
                    <h1
                      key={category}
                      className="px-2 py-1 font-bold text--800"
                    >
                      {category}
                    </h1>
                  ))}
              </div>
            </div>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw]"></div>
        </div>
        <div className=" relative top-[65vh] left-5">
          <h1 className=" font-semibold">
            How Do You Fell About{" "}
            <span className=" text-[5vw] font-bold text-lime-400">
              {CoinDetails?.name}
            </span>{" "}
            Today?
          </h1>
          <h1 className=" text-[3.5vw] font-light mt-1">
            The Community is{" "}
            <span
              className={
                CoinDetails?.sentiment_votes_up_percentage >
                CoinDetails?.sentiment_votes_down_percentage
                  ? "text-green-400 font-semibold text-[4.5vw]"
                  : "text-red-600  font-semibold text-[4.5vw]"
              }
            >
              {CoinDetails?.sentiment_votes_up_percentage >
              CoinDetails?.sentiment_votes_down_percentage
                ? "Bullish"
                : "Bearish"}
            </span>{" "}
            about{" "}
            <span>
              {CoinDetails?.name} ({CoinDetails?.name}) today
            </span>
          </h1>
          <button className="CommunityBullishButton mt-5">
            🚀 {CoinDetails?.sentiment_votes_up_percentage.toFixed(0)}%
          </button>
          <button className="CommunityBullishButton mt-5 ml-10">
            📉 {CoinDetails?.sentiment_votes_down_percentage.toFixed(0)}%
          </button>
        </div>
        <div className="relative top-[73vh] left-5">
          <h1 className="text-[6vw] font-semibold">About</h1>
          <p
            className="leading-10 w-[90vw] mt-5"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className=" relative top-[85vh] left-5">
          <h1 className=" text-[6vw] font-semibold">
            {CoinDetails?.name} Markets
          </h1>

          <div className="mt-5 overflow-x-auto w-[90vw]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 rounded-2xl">
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    #
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Exchange
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Pair
                  </th>
                  <th className="p-2 text-left mt-[2vh] text-sm font-semibold text-white flex items-center">
                    Price
                    <button
                      className="ml-2 bg-transparent text-white"
                      onClick={() =>
                        setCurrency(currency === "INR" ? "USD" : "INR")
                      }
                    >
                      {currency === "INR" ? (
                        <MdSwapVert className="text-lg" />
                      ) : (
                        <MdSwapVert className="text-lg rotate-180" />
                      )}
                    </button>
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Spread
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    +2% Depth
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    -2% Depth
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    24h Volume
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Volume %
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Last Updated
                  </th>
                  <th className="p-2 text-left text-sm font-semibold text-white">
                    Trust Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {MarketsData &&
                  MarketsData.map((market, index) => {
                    if (
                      market?.base?.startsWith("0X") &&
                      market?.target?.startsWith("0X")
                    ) {
                      return null;
                    }
                    return (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-2 whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={market?.market?.logo}
                              alt={market?.market?.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="truncate max-w-[150px]">
                              {market?.market?.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {`${market?.base}/${market?.target}`}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {currency === "INR"
                            ? `₹${(
                                market?.converted_last?.usd * usdToInrRate
                              ).toFixed(2)}`
                            : `$${market?.converted_last?.usd.toFixed(2)}`}
                        </td>
                        <td className="p-2 whitespace-nowrap">{`${(
                          market?.bid_ask_spread_percentage * 100
                        ).toFixed(2)}%`}</td>
                        <td className="p-2 whitespace-nowrap">{`$${market?.cost_to_move_up_usd.toLocaleString()}`}</td>
                        <td className="p-2 whitespace-nowrap">{`$${market?.cost_to_move_down_usd.toLocaleString()}`}</td>
                        <td className="p-2 whitespace-nowrap">{`$${market?.converted_volume?.usd.toLocaleString()}`}</td>
                        <td className="p-2 whitespace-nowrap">N/A</td>
                        <td className="p-2 whitespace-nowrap">
                          {new Date().getTime() -
                            new Date(market?.last_fetch_at).getTime() <
                          60000 ? (
                            "Recently"
                          ) : (
                            <>
                              {new Date(
                                market?.last_fetch_at
                              ).toLocaleDateString("en-GB")}
                              <br />
                              {new Date(
                                market?.last_fetch_at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </>
                          )}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              market.trust_score === "green"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {market?.trust_score}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex justify-between items-center">
            <button
              className="Paginationbutton"
              onClick={handlePreviousPage}
              disabled={disablePrevious}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">Previous</span>
            </button>
            <span>Page {currentPage}</span>
            <button
              className={`Paginationbutton mr-[10vw] ${
                disableNext ? "disabled-yellow" : ""
              }`}
              onClick={handleNextPage}
              disabled={disableNext}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">Next</span>
            </button>
          </div>
        </div>
        <div className=" relative w-[90vw] top-[85vh] left-5">
          {/* <h1 className=" text-[6vw]">{CoinDetails?.name} Latest News</h1> */}
          <div className="mt-10">
            <CoinNewsInDetails />
            {/* {renderedNews.map((coin, index) => (
              <div key={index} className="">
                <img
                  className="w-[90vw] h-[25vh] object-cover rounded-lg"
                  src={coin.urlToImage}
                  alt={coin.title}
                  loading="lazy"
                />
                <h1 className=" mt-5 mb-[5vh] leading-7 font-semibold text-[4.5vw] w-[90vw]">
                  {coin?.title}
                </h1>
                <h1>
                  Source : <span>{coin?.source?.name}</span>{" "}
                </h1>
                <h1 className=" mb-[5vh]">
                  About:{" "}
                  <span>
                    {formatDistanceToNow(new Date(coin?.publishedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </h1>
                <div className=" w-[90vw] border-b-[1px] mb-[5vh]"></div>
              </div>
            ))} */}
          </div>
        </div>
        <div className="p-4 relative top-[90vh] max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Trending Coins</h1>
          <div className="space-y-2">
            {TrendingCoins &&
              TrendingCoins.map((coin, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 border-b-2 border-yellow-400 hover:border-blue-600 hover:border-t-2 rounded-lg px-4 py-6 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={coin.item.thumb}
                      alt={coin.item.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">
                        {coin.item.symbol}
                      </span>
                      <span className="text-sm text-gray-500 truncate">
                        ₹{coin.item.data.price.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`flex items-center ${
                        coin.item.data.price_change_percentage_24h.usd > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.item.data.price_change_percentage_24h.usd > 0 ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                      {Math.abs(
                        coin.item.data.price_change_percentage_24h.usd
                      ).toFixed(1)}
                      %
                    </span>
                    <Star size={16} className="ml-2 text-gray-400" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className=" relative top-[90vh] left-5">
          <h1 className=" text-[4.5vw] text-blue-700 font-semibold">
            {CoinDetails?.name} ({CoinDetails?.symbol.toUpperCase()}) price has
            increased today.
          </h1>
          <p className=" w-[90vw] leading-7 mt-5 text-gray-500">
            The price of {CoinDetails?.name} (
            {CoinDetails?.symbol.toUpperCase()}) is{" "}
            <span className=" text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.current_price?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>
            today with a total volume of{" "}
            <span className=" text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.total_volume?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>{" "}
            .This represents a{" "}
            <span className=" text-amber-200">
              {" "}
              {CoinDetails?.market_data?.price_change_percentage_24h.toFixed(2)}
              %{" "}
            </span>{" "}
            price increase in the last 24 hours and a{" "}
            <span className=" text-amber-200">
              {" "}
              {CoinDetails?.market_data?.price_change_percentage_7d.toFixed(
                2
              )}%{" "}
            </span>
            price increase in the past 7 days. With a circulating supply of{" "}
            <span className="text-amber-200">
              {CoinDetails?.market_data?.circulating_supply >= 1e12
                ? (CoinDetails?.market_data?.circulating_supply / 1e12).toFixed(
                    2
                  ) + "T"
                : CoinDetails?.market_data?.circulating_supply >= 1e9
                ? (CoinDetails?.market_data?.circulating_supply / 1e9).toFixed(
                    2
                  ) + "B"
                : CoinDetails?.market_data?.circulating_supply >= 1e6
                ? (CoinDetails?.market_data?.circulating_supply / 1e6).toFixed(
                    2
                  ) + "M"
                : CoinDetails?.market_data?.circulating_supply.toLocaleString()}
            </span>
            , <span className="text-amber-200">{CoinDetails?.name}</span> is
            valued at a market cap of{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.market_cap?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            .
          </p>
        </div>
        <div className=" relative top-[95vh]">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CoinFullDetails;
