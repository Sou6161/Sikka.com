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
  CartesianGrid,
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
  const [screenSize, setScreenSize] = useState(window.innerWidth);
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
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(
      screenSize >= 1024 && screenSize <= 1280 ? 0 : 0,
      screenSize >= 1024 && screenSize <= 1280 ? 10 : 6
    )
  }...${
    CoinDetails &&
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(
      screenSize >= 1024 && screenSize <= 1280 ? -10 : -5
    )
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDropdownChains = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const ecosystemCategory = CoinDetails?.categories?.find((category) =>
    category.includes("Ecosystem")
  );
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

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-[100vw]   text-white bg-black overflow-x-hidden 2xlarge:overflow-x-hidden hide-scrollbar 2xlarge:w-[99.4vw]">
        <h1 className="text-[6vw] xsmall:text-[4vw] small:text-[3.5vw] medium:text-[3vw] medium:ml-[15vw] large:ml-[20vw] xlarge:ml-[7vw]  large:text-[2.5vw] xlarge:text-[2vw] 2xlarge:text-[1.5vw] font-semibold text-red-600 ml-[8vw] mt-[7vh]">
          Overview
        </h1>

        <div className="flex items-center mt-8 ml-[8vw] large:ml-[14vw] xlarge:ml-[2vw]">
          <img
            className="w-8 h-8 xsmall:w-10 xsmall:h-10 small:w-10 small:h-10 medium:w-9 medium:h-9"
            src={CoinDetails?.image?.large}
            alt=""
          />

          <div className="ml-4 flex flex-wrap items-center">
            <h1 className="text-[5.2vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2.2vw] medium:ml-[1vw] large:text-[2.2vw] large:ml-[vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] text-white font-semibold">
              {CoinDetails?.name}
            </h1>

            <h1 className="ml-2 text-[4vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[2vw] large:text-[1.8vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] text-gray-400">
              {CoinDetails?.symbol?.toUpperCase()} Price
            </h1>

            <div className="relative ml-[3vw]  mt-2 xsmall:mt-0 medium:ml-[20vw] xlarge:ml-[10vw]">
              <span
                className="text-white border-2 border-red-600 rounded-full bg-yellow-400 p-1 cursor-pointer inline-flex items-center justify-center w-8 h-8"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaStar className="w-4 h-4" />
              </span>

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
                    className="inline-block px-2 font-semibold bg-gray-200 py-2 hover:bg-red-100 rounded-lg text-[4.5vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[1.5vw] large:text-[1.3vw] xlarge:text-[1vw] 2xlarge:text-[1.2vw] w-full  xsmall:whitespace-nowrap text-gray-600"
                  >
                    Add to Portfolio
                  </a>
                  <h1 className="text-[3.5vw] xsmall:text-[2.4vw] small:text-[2.5vw] medium:text-[1.5vw] medium:ml-1 large:text-[1.3vw] xlarge:text-[1vw] 2xlarge:text-[1.2vw] ml- text-gray-600">
                    Added{" "}
                    {CoinDetails?.watchlist_portfolio_users?.toLocaleString()}{" "}
                    Users
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 className=" font-semibold text-[7.5vw] xsmall:text-[4vw] small:text-[4vw] medium:text-[2.5vw] large:text-[3vw] xlarge:text-[2.2vw] 2xlarge:text-[2.5vw] ml-[10vh] xsmall:ml-[12vh] small:ml-[15vh] mt-[2vh] xsmall:mt-[2vh] medium:ml-[17vh] large:ml-[32vh] xlarge:ml-[12vh]">
          <span className="min-w-[50vw]">
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

        <div className="flex flex-wrap items-center mt-2  ml-[20vw] xsmall:ml-[16vw]  medium:ml-[14vw] large:ml-[19vw] xlarge:ml-[6vw]">
          <h1 className="text-[3.5vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[2.5vw] large:text-[1.8vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw]">
            <span className="min-w-[50vw]">
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
          </h1>

          <span className="text-green-400 text-[5vw] xsmall:text-[3.5vw] small:text-[2.5vw] medium:text-[2.2vw] large:text-[1.6vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] font-semibold ml-[22vw] xsmall:ml-[24vw] medium:ml-[15vw] -mt-[11vh] xsmall:-mt-[10vh]  medium:-mt-[11vh] large:-mt-[13vh] xlarge:-mt-[12vh] 2xlarge:-mt-[13vh] ">
            {CoinDetails?.market_data?.price_change_percentage_24h >= 0 ? (
              <FaCaretUp className="inline-flex blink-green text-[5.5vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2.3vw] large:text-[1.5vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] relative -top-1 xlarge:-top-1  large:top-0" />
            ) : (
              <FaCaretDown className="inline-flex blink-red text-[5.5vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2.3vw] large:text-[1.8vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] relative -top-1" />
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
        </div>

        <span className="inline-block relative -top-7 left-[50vw] mt-2 small:left-[40vw] small:mt-1 medium:-mt-1   ml-[20vw] medium:ml-[8vw] xsmall:ml-[15vw] xlarge:left-[22vw]  text-[4vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[2.2vw] large:text-[1.5vw] xlarge:text-[1.4vw] 2xlarge:text-[1vw]">
          {CoinDetails?.market_data?.price_change_percentage_24h_in_currency
            ?.btc >= 0 ? (
            <FaCaretUp className="inline-flex blink-green relative -top-[0.3vw] xlarge:-top-1" />
          ) : (
            <FaCaretDown className="inline-flex blink-red" />
          )}
          <span
            className={`${
              CoinDetails?.market_data?.price_change_percentage_24h_in_currency
                ?.btc >= 0
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
        <svg
          viewBox="0 0 300 50"
          className="w-full  xsmall:w-[80vw]  xsmall:mx-auto medium:w-[70vw] large:w-[60vw] large:ml-[20vw] xlarge:ml-[5vw] xlarge:w-[35vw]  2xlarge:w-[35vw] h-auto"
        >
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" style={{ stopColor: "red", stopOpacity: 1 }} />
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
            height={
              window.innerWidth === 1536
                ? 1
                : window.innerWidth < 480
                ? 7
                : window.innerWidth > 1536
                ? 3
                : 3
            }
            fill="url(#priceGradient)"
            rx={window.innerWidth === 1536 ? 2 : 5}
            ry={window.innerWidth === 1536 ? 2 : 5}
          />
          <text
            x="10"
            y={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 27
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 30
                : window.innerWidth > 1536
                ? 27
                : 27
            }
            fontFamily="Arial"
            className="text-[3vw] xsmall:text-[2vw]  small:text-[1.5vw] medium:text-[1vw] large:text-[0.8vw] xlarge:text-[0.6vw] 2xlarge:text-[0.5vw]"
            fill="red"
          >
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
          <text
            x={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 240
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 245
                : window.innerWidth > 1536
                ? 245
                : 250
            }
            y={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 27
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 30
                : window.innerWidth > 1536
                ? 27
                : 27
            }
            fontFamily="Arial"
            className="text-[3vw] xsmall:text-[2vw] small:text-[1.5vw] medium:text-[1vw] large:text-[0.8vw] xlarge:text-[0.7vw] 2xlarge:text-[0.5vw]"
            fill="green"
          >
            $
            {CoinDetails?.market_data?.high_24h?.usd?.toFixed(
              CoinDetails?.market_data?.high_24h?.usd?.toString().split(".")[0]
                .length > 2
                ? 2
                : CoinDetails?.market_data?.high_24h?.usd
                    ?.toString()
                    .split(".")[0] === "0"
                ? 8
                : 4
            )}
          </text>
        </svg>
        <span className=" text-white relative -top-[6vh] xsmall:-top-[7vh] small:-top-[9vh] left-[40vw] text-[3vw] xsmall:text-[2.5vw] medium:text-[2vw] medium:left-[44vw]  medium:-top-[8vh] large:text-[1.5vw] large:-top-[11vh] xlarge:text-[1vw] xlarge:-top-[8vh] xlarge:left-[18vw] 2xlarge:text-[0.8vw]">
          24 Hour Range
        </span>

        <div className=" relative left-5 xsmall:left-[10vw] medium:left-[14vw] large:ml-[5vw] xlarge:left-[42vw] xlarge:bottom-[45vh]">
          <h1 className=" text-[6vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2vw] xlarge:text-[1.5vw] xlarge:grid xlarge:grid-cols-4 2xlarge:text-[1.3vw] ">
            {CoinDetails?.name} Price Chart{" "}
            {`(${CoinDetails?.symbol?.toUpperCase()})`}
          </h1>
          <div className=" small:flex small:gap-4 large:gap-10 xlarge:gap-2">
            <button
              class="button TimeGraph mt-5 "
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
          <div className=" small:flex small:gap-4 large:gap-10 xlarge:gap-5">
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
        <div className="relative top-[8vh] w-[100vw]">
          <div className="w-[95vw] xsmall:w-[93vw] small:w-[90vw] xlarge:w-[50vw] xlarge:left-[47vw] xlarge:bottom-[45vh]  h-96 rounded-lg shadow relative small:left-5    ">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "price" ? (
                <LineChart data={chartData2}>
                  {console.log("LineChart is rendering")}
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    strokeDasharray="0.5"
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatXAxis}
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                    domain={xDomain}
                    axisLine={{ stroke: "gray" }}
                    tickLine={{ stroke: "gray" }}
                  />
                  <YAxis
                    className=" text-[3vw] xsmall:text-[2vw] medium:text-[1.5vw] large:text-[1.1vw]"
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
                    axisLine={true}
                    tickLine={true}
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
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    strokeDasharray="0.5"
                    stroke="#E5E7EB"
                  />
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
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
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
                    axisLine={true}
                    tickLine={true}
                    className="text-[3vw] xsmall:text-[2vw] medium:text-[1.5vw] large:text-[1.1vw]"
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
        <div className="relative top-[10vh] small:right-10 xlarge:left-[8vw] xlarge:-top-[30vh]">
          <div className="flex justify-between w-[95vw] mx-auto bg-gray-500/30 backdrop-blur-md border-2 text-black p-2 overflow-x-auto hide-scrollbar rounded-2xl medium:w-[70vw] large:w-[60vw] small:w-[80vw] xsmall:w-[90vw] xsmall:mr-10 medium:mr-[14vw] xlarge:w-[45vw] ">
            {timeframes.map((timeframe, index) => (
              <div key={timeframe.label} className="text-center">
                <div
                  className={`font-bold mb-2  ${
                    index === 0
                      ? "bg-yellow-600 text-black p-2 rounded-t-lg SmallTable ml-3 xsmall:ml-4 small:ml-5 medium:ml-6  "
                      : "bg-yellow-600 text-black p-2 rounded-t-lg SmallTable ml-3 small:ml-5 medium:ml-4"
                  }`}
                >
                  {timeframe.label}
                </div>
                <div
                  className={
                    "text-[4vw] xsmall:text-[3vw] small:text-[2vw] medium:text-[2vw] w-[28vw] xsmall:w-[20vw] small:w-[18vw] medium:w-[13vw] large:text-[1.5vw] xlarge:text-[1.2vw] large:w-[10vw] xlarge:w-[8vw]  mx-auto bg-stone-700 border-r-[1px] relative    border-gray-400 p-2"
                  }
                >
                  {formatPercentage(
                    CoinDetails?.market_data?.[timeframe.dataKey]?.usd
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" relative top-[18vh] left-5 small:left-[8vw] medium:left-[12vw] large:left-[17vw] xlarge:left-[6vw] xlarge:-top-[90vh] 2xlarge:-top-[80vh] ">
          <h1 className=" text-[6vw] xsmall:text-[4vw] small:text-[3.5vw] medium:text-[2.5vw] large:text-[1.5vw] 2xlarge:text-[1.2vw] ">
            {CoinDetails?.name} Converter
          </h1>
          <div className="bg-white shadow-md rounded-lg p-4 w-[90vw] small:w-[80vw] medium:w-[60vw] large:w-[55vw] xlarge:w-[37vw] 2xlarge:w-[35vw] mt-5">
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
            <div className="text-[5vw] xsmall:text-[3vw] medium:text-[2vw] large:text-[1.6vw] 2xlarge:text-[1.3vw] font-bold text-red-600">
              {!isNaN(convertedAmount) ? convertedAmount.toFixed(2) : "0.00"}{" "}
              {selectedCurrency.toUpperCase()}
            </div>
          </div>
        </div>
        <div className=" relative top-[24vh] left-5 small:left-[8vw] medium:left-[12vw] large:left-[17vw] xlarge:left-[6vw] xlarge:-top-[80vh] 2xlarge:-top-[75vh]">
          <h1 className=" text-[6vw] xsmall:text-[4vw] small:text-[3.5vw] medium:text-[2.7vw] large:text-[2vw] 2xlarge:text-[1.3vw]">
            {CoinDetails?.name} Figures
          </h1>
          <div className=" inline-flex mt-5 ">
            <h1 className="mr-[25vw]  xsmall:mr-[45vw] large:text-[1.5vw] xlarge:mr-[25vw] 2xlarge:text-[1vw] 2xlarge:mr-[28vw]">
              Market cap
            </h1>
            <h1 className=" font-bold small:ml-[3vw] medium:-ml-[10vw] large:-ml-[9vw]">
              ${CoinDetails?.market_data?.market_cap?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[40vw] xsmall:mr-[50vw] medium:mr-[34vw] large:text-[1.5vw] xlarge:mr-[13vw] 2xlarge:text-[1vw] 2xlarge:mr-[17vw]">
              Market Cap/FDV
            </h1>
            <h1 className="font-bold small:ml-[3vw] ">
              {CoinDetails?.market_data?.market_cap_fdv_ratio}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[5vw] xsmall:mr-[30vw] medium:mr-[22vw] large:mr-[25vw] large:text-[1.5vw] xlarge:mr-[5vw] 2xlarge:text-[1vw] 2xlarge:mr-[10vw]">
              Fully Diluted Valuation
            </h1>
            <h1 className=" font-bold small:ml-[3vw]">
              $
              {CoinDetails?.market_data?.fully_diluted_valuation?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[20vw] xsmall:mr-[40vw] large:text-[1.5vw] xlarge:mr-[19vw] 2xlarge:text-[1vw] 2xlarge:mr-[22vw]">
              Circulating Supply
            </h1>
            <h1 className="font-bold small:ml-[5vw] medium:-ml-[8vw] large:-ml-[6vw] ">
              {CoinDetails?.market_data?.circulating_supply.toFixed(0)}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[35vw] xsmall:mr-[45vw] large:text-[1.5vw] xlarge:mr-[24vw] 2xlarge:text-[1vw] 2xlarge:mr-[26vw]">
              Total Supply
            </h1>
            <h1 className="font-bold small:ml-[5vw] medium:-ml-[10vw] large:-ml-[7vw]">
              {CoinDetails?.market_data?.total_supply.toFixed(0)}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[35vw] xsmall:mr-[45vw] large:text-[1.5vw] xlarge:mr-[24vw] 2xlarge:text-[1vw] 2xlarge:mr-[26vw]">
              Max Supply
            </h1>
            <h1 className="font-bold small:ml-[5vw] medium:-ml-[10vw] large:-ml-[7vw]">
              {CoinDetails?.market_data?.total_supply.toFixed(0)}
            </h1> 
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
          <div className=" inline-flex mt-3">
            <h1 className=" mr-[30vw] xsmall:mr-[40vw] large:text-[1.5vw] xlarge:mr-[19vw] 2xlarge:text-[1vw] 2xlarge:mr-[22vw]">
              Total Volume
            </h1>
            <h1 className="font-bold small:ml-[5vw] medium:-ml-[7vw] large:-ml-[4vw]">
              ${CoinDetails?.market_data?.total_volume?.usd.toLocaleString()}
            </h1>
          </div>
          <div className=" border-b-[1px] mt-4  w-[90vw] small:w-[80vw] medium:w-[60vw] xlarge:w-[35vw]"></div>
        </div>
        <div className="relative top-[30vh] left-5 xsmall:left-3 small:left-4 medium:left-[6vw] large:left-[11vw] xlarge:-top-[70vh] xlarge:left-[6vw] xlarge:max-w-[35vw] 2xlarge:-top-[70vh]  ">
          <h1 className="text-[6vw] xsmall:text-[4vw] small:text-[3.5vw] small:ml-[6vw] medium:text-[2.7vw] large:text-[2vw] xlarge:ml-0 2xlarge:text-[1.5vw] ">
            Info
          </h1>

          {CoinDetails?.detail_platforms?.ethereum?.contract_address && (
            <div className="flex flex-col">
              <div className="small:ml-[6vw] flex flex-row xsmall:flex-row items-start xsmall:items-center space-y-2 xsmall:space-y-0 xsmall:space-x-2 text-gray-600 mt-5 xlarge:ml-0">
                <span className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] 2xlarge:text-[1vw]">
                  Contract
                </span>
                <div className="flex items-center relative -top-2 xsmall:top-0 xsmall:left-[34vw] left-[10vw] medium:left-[25vw] large:left-[27vw] xlarge:left-[15vw] space-x-2 bg-gray-100 rounded-full px-3 py-1 mt-1 xsmall:mt-0">
                  <img
                    src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                    alt=""
                    className="w-[4vw] h-[2vh] xsmall:w-4 xsmall:h-4 object-cover rounded-full"
                  />
                  <span className="text-xs font-medium">Ethereum</span>
                  <span className="text-xs font-semibold">
                    {truncatedAddress}
                  </span>
                  <Copy
                    className="w-4 h-4 text-gray-800 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        CoinDetails?.detail_platforms?.ethereum
                          ?.contract_address
                      );
                    }}
                  />
                  <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>
              <div className="mt-2 border-b border-gray-200 w-[90vw] small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:w-full xlarge:ml-0"></div>
            </div>
          )}

          {(CoinDetails?.links?.homepage[0] ||
            CoinDetails?.links?.announcement_url[0]) && (
            <div className="flex flex-row xsmall:flex-row mt-5 gap-2">
              <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] medium:-mt-2 xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw] ">
                Website
              </h1>
              <div className="flex flex-wrap gap-2 relative left-[15vh] xsmall:left-[35vh] small:left-[45vw] medium:left-[30vw] xlarge:left-[15vw] 2xlarge:left-[18vw]">
                {CoinDetails?.links?.homepage[0] && (
                  <Link to={CoinDetails?.links?.homepage[0]}>
                    <h1 className="bg-white px-3 py-1 xsmall:px-3 xsmall:py-2 rounded-xl font-bold text-xs medium:-mt-1">
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
                    <h1 className="bg-white px-3 py-1 xsmall:px-3 xsmall:py-2 rounded-xl font-bold text-xs medium:-mt-1  ">
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
            </div>
          )}

          <div className="border-b-[1px] mt-2 w-[90vw] small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:w-[35vw] xlarge:ml-0 medium:mt-1"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 gap-2 medium:mt-2">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Explorers
            </h1>
            <div className="relative left-[12vh] xsmall:left-[35vh] small:left-[40vh] medium:left-[30vw] xlarge:left-[15vw] 2xlarge:left-[18vw]">
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

          <div className="border-b-[1px] mt-2 w-[90vw] small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 gap-2 medium:mt-2">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Community
            </h1>
            <div className="flex flex-wrap gap-2 relative left-[8vh] xsmall:left-[30vh] xlarge:left-[12vw] 2xlarge:left-[16vw]">
              <Link
                to={`https://x.com/${CoinDetails?.links?.twitter_screen_name}`}
                className=""
              >
                <h1 className="bg-white px-2 py-1 inline-flex items-center rounded-xl text-[3.5vw] xsmall:text-xs small:text-sm font-bold">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzPDlXeNQE8FwF2AhD7WUcVhfn2NlrqfJdmZJUOp1Tk0T4yYeuF50V3aVtd4H7YzdZOjc&usqp=CAU"
                    alt=""
                    className="w-[5vw] h-[2.5vh] xsmall:w-6 xsmall:h-6 object-cover rounded-full mr-1"
                  />
                  Twitter
                </h1>
              </Link>
              <Link to={CoinDetails?.links?.subreddit_url}>
                <h1 className="bg-white px-2 py-1 rounded-xl inline-flex items-center text-[3.5vw] xsmall:text-xs small:text-sm font-bold">
                  <img
                    src="https://pbs.twimg.com/profile_images/1729909787029078016/dBjB3Fnr_400x400.jpg"
                    alt=""
                    className="w-[5vw] h-[2.5vh] xsmall:w-6 xsmall:h-6 object-cover rounded-full mr-1"
                  />
                  Reddit
                </h1>
              </Link>
            </div>
          </div>

          <div className="border-b-[1px] mt-2 w-[90vw] small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-4 gap-2 medium:mt-2  ">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Search on
            </h1>
            <Link
              to="https://x.com/?lang=en"
              className="relative left-[19vh] xsmall:left-[40vh] xlarge:left-[15vw] 2xlarge:left-[18vw] -top-1"
            >
              <h1 className="bg-white px-3 py-1 xsmall:px-3 xsmall:py-2 rounded-xl inline-flex items-center font-bold text-[3.5vw]  xsmall:text-[2.2vw] small:text-[2.5vw] medium:text-[1.3vw] 2xlarge:text-[1vw] medium:py-1">
                <Search className="mr-1 " /> Twitter
              </h1>
            </Link>
          </div>

          <div className="border-b-[1px]  w-[90vw] small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 small:mt-3 gap-2 medium:mt-1">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Source Code
            </h1>
            <Link
              to={CoinDetails?.links?.repos_url?.github[0]}
              className="relative left-[16vh] xsmall:left-[38vh] xlarge:left-[15vw] 2xlarge:left-[18vw]"
            >
              <h1 className="bg-white px-2 py-1 xsmall:px-3 xsmall:py-2 rounded-xl gap-2 inline-flex items-center font-bold text-[3.5vw] xsmall:text-xs small:text-sm medium:py-2">
                <img
                  src="https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU"
                  alt=""
                  className="w-[6vw] h-[3vh] xsmall:w-4 xsmall:h-4 object-cover rounded-full"
                />
                Github
              </h1>
            </Link>
          </div>

          <div className="border-b-[1px] mt-4 w-[90vw] small:mt-2 small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 small:mt-2 gap-2 medium:mt-2">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw] ">
              API ID
            </h1>
            <div className="flex items-center relative left-[35vw] xsmall:left-[45vh] xlarge:left-[18vw] 2xlarge:left-[20vw]">
              <h1 className="bg-white text-black px-2 py-1 xsmall:px-2 xsmall:py-2 rounded-xl font-bold text-[3.5vw] xsmall:text-[2.4vw] small:text-sm">
                {CoinDetails?.id}
              </h1>
              <button
                className="ml-2"
                onClick={() => navigator.clipboard.writeText(CoinDetails?.id)}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-b-[1px] mt-4 w-[90vw] small:mt-2 small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 small:mt-2 gap-2 medium:mt-2">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Chains
            </h1>
            <div className="relative left-[28vw] xsmall:left-[46vw] small:left-[40vw] medium:left-[30vw] xlarge:left-[15vw] 2xlarge:left-[18vw]">
              <h1
                className="bg-white text-black px-2 py-1 xsmall:px-3 xsmall:py-2 rounded-xl font-bold text-[3.5vw] xsmall:text-[2.4vw] small:text-sm flex items-center cursor-pointer"
                onClick={toggleDropdownChains}
              >
                {CoinDetails?.categories?.find((category) =>
                  category.includes("Ecosystem")
                )}
                <ChevronDown className="w-5 h-5 ml-2" />
              </h1>
              {isDropdownOpen && (
                <div className="absolute mt-2 z-50 w-full bg-gray-500 rounded-xl">
                  {CoinDetails?.categories
                    ?.filter(
                      (category) =>
                        category.includes("Ecosystem") &&
                        category !== ecosystemCategory
                    )
                    .map((category) => (
                      <h1
                        key={category}
                        className="px-2 py-3 font-bold text-[3.5vw] xsmall:text-xs small:text-sm"
                      >
                        {category}
                      </h1>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-b-[1px] mt-4 w-[90vw] small:mt-2 small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>

          <div className="flex flex-row xsmall:flex-row items-start xsmall:items-center mt-5 small:mt-2 gap-2 medium:mt-2">
            <h1 className="text-white text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] small:ml-[6vw] medium:text-[2.2vw] large:text-[1.8vw] xlarge:text-[1.3vw] xlarge:ml-0 2xlarge:text-[1vw]">
              Categories
            </h1>
            <div className="relative left-[25vw] xsmall:left-[35vw] small:left-[30vw] medium:left-[20vw] xlarge:left-[9vw] 2xlarge:left-[14vw]">
              <h1
                className="bg-white text-black px-2 py-1 xsmall:px-3 xsmall:py-2 rounded-xl font-bold text-[3.5vw] xsmall:text-xs small:text-sm flex items-center cursor-pointer"
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
                className="absolute w-full hidden z-50 bg-gray-500 mt-2 rounded-xl"
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
                      className="px-2 py-1 font-bold text-[3.5vw] xsmall:text-xs small:text-sm"
                    >
                      {category}
                    </h1>
                  ))}
              </div>
            </div>
          </div>

          <div className="border-b-[1px] mt-4 w-[90vw] small:mt-2 small:w-[80vw] small:ml-[6vw] medium:w-[60vw] xlarge:ml-0 xlarge:w-[35vw]"></div>
        </div>

        <div className="relative top-[35vh] left-5 xsmall:left-4 small:left-[8vw]  medium:left-[12vw] large:left-[50vw] large:-top-[100vh] xlarge:-top-[60vh] xlarge:left-[6vw] 2xlarge:-top-[65vh] xlarge:ml-0">
          <h1 className="font-semibold text-[4vw] xsmall:text-lg small:text-[2.5vw] medium:text-[2.2vw] large:text-[2.3vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw]   ">
            How Do You Feel About{" "}
            <span className="text-[5vw] xsmall:text-xl small:text-[2.5vw] medium:text-[2.2vw] large:text-[2.2vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] font-bold text-lime-400">
              {CoinDetails?.name}
            </span>{" "}
            Today?
          </h1>
          <h1 className="text-[3.5vw] xsmall:text-sm small:text-base medium:text-lg large:text-xl font-light mt-1">
            The Community is{" "}
            <span
              className={
                CoinDetails?.sentiment_votes_up_percentage >
                CoinDetails?.sentiment_votes_down_percentage
                  ? "text-green-400 font-semibold text-[4.5vw] xsmall:text-base small:text-lg medium:text-xl large:text-2xl"
                  : "text-red-600 font-semibold text-[4.5vw] xsmall:text-base small:text-lg medium:text-xl large:text-2xl"
              }
            >
              {CoinDetails?.sentiment_votes_up_percentage >
              CoinDetails?.sentiment_votes_down_percentage
                ? "Bullish"
                : "Bearish"}
            </span>{" "}
            about{" "}
            <span>
              {CoinDetails?.name} ({CoinDetails?.symbol})
            </span>
          </h1>
          <div className="flex mt-5 space-x-4 xsmall:space-x-6 small:space-x-8 medium:space-x-10">
            <button className="CommunityBullishButton text-[3vw] xsmall:text-[2.5vw] small:text-[2.5vw] medium:text-base large:text-lg">
              🚀 {CoinDetails?.sentiment_votes_up_percentage.toFixed(0)}%
            </button>
            <button className="CommunityBullishButton text-[3vw] xsmall:text-[2.5vw] small:text-sm medium:text-base large:text-lg">
              📉 {CoinDetails?.sentiment_votes_down_percentage.toFixed(0)}%
            </button>
          </div>
        </div>

        <div className="relative top-[42vh] left-5 small:left-[8vw] medium:left-[12vw] large:left-[17vw]  xlarge:left-[6vw] xlarge:-top-[50vh] xlarge:ml-0 xlarge:mb-0 xlarge:mt-0 xlarge:mr-0 2xlarge:-top-[57vh] 2xlarge:ml-0 2xlarge:mb-0 2xlarge:mr-0 2xlarge:mr-0">
          <h1 className="text-[6vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2.5vw] large:text-[2.2vw] 2xlarge:text-[1.5vw] font-semibold">
            About
          </h1>
          <p
            className="leading-10 w-[90vw] mt-5 small:w-[80vw] large:w-[70vw] large:text-[1.5vw] xlarge:w-[90vw] xlarge:text-[1.2vw] 2xlarge:text-[1vw]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className=" relative top-[45vh] left-5 xsmall:left-2 small:left-[8vw] medium:left-[12vw] large:left-[17vw]  xlarge:-top-[40vh]  xlarge:left-[6vw] 2xlarge:-top-[50vh]">
          <h1 className=" text-[6vw] xsmall:text-[4vw] medium:text-[2.5vw] xlarge:text-[1.8vw] font-semibold">
            {CoinDetails?.name} Markets
          </h1>

          <div className="mt-5 overflow-x-auto w-[90vw] xsmall:w-[90vw] small:w-[85vw] medium:w-[80vw] xlarge:w-[92vw]">
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
                  <th className="p-2 text-left mt-[2vh] xlarge:mt-0 text-sm font-semibold text-white flex items-center">
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
              className="Paginationbutton xlarge:left-[25vw]"
              onClick={handlePreviousPage}
              disabled={disablePrevious}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">Previous</span>
            </button>
            <span>Page {currentPage}</span>
            <button
              className={`Paginationbutton mr-[10vw] small:mr-[20vw] medium:mr-[30vw] large:mr-[25vw] xlarge:right-[20vw] ${
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
        <div className=" relative w-[90vw] top-[46vh] xlarge:top-[150vh] left-5">
          <div className="mt-10">
            <CoinNewsInDetails />
          </div>
        </div>
        <div className="p-4 relative xsmall:-left-5  top-[50vh] w-full xsmall:max-w-[90%] small:max-w-[80%] medium:max-w-2xl medium:-left-2 large:max-w-3xl xlarge:max-w-[40vw] xlarge:top-[70vh] xlarge:-left-[25vw] 2xlarge:max-w-[40vw] 2xlarge:top-[60vh] mx-auto">
          <h1 className="text-xl xsmall:text-[4vw] small:text-[4vw] medium:text-[2.5vw] xlarge:text-[1.7vw] font-semibold mb-4">
            Trending Coins
          </h1>
          <div className="space-y-2 xlarge:space-y-0 xlarge:grid xlarge:grid-cols-2 xlarge:w-[60vw] xlarge:gap-8 ">
            {TrendingCoins &&
              TrendingCoins.map((coin, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 border-b-2 border-yellow-400 hover:border-blue-600 hover:border-t-2 rounded-lg px-2 xsmall:px-4 py-4 xsmall:py-6 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-2 xsmall:space-x-3 flex-1 min-w-0">
                    <img
                      src={coin.item.thumb}
                      alt={coin.item.name}
                      className="w-6 h-6 xsmall:w-8 xsmall:h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate text-sm xsmall:text-base">
                        {coin.item.symbol}
                      </span>
                      <span className="text-xs xsmall:text-sm text-gray-500 truncate">
                        ₹{coin.item.data.price.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`flex items-center text-xs xsmall:text-sm ${
                        coin.item.data.price_change_percentage_24h.usd > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.item.data.price_change_percentage_24h.usd > 0 ? (
                        <ChevronUp
                          size={14}
                          className="xsmall:w-4 xsmall:h-4"
                        />
                      ) : (
                        <ChevronDown
                          size={14}
                          className="xsmall:w-4 xsmall:h-4"
                        />
                      )}
                      {Math.abs(
                        coin.item.data.price_change_percentage_24h.usd
                      ).toFixed(1)}
                      %
                    </span>
                    <Star
                      size={14}
                      className="ml-2 text-gray-400 xsmall:w-4 xsmall:h-4"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="relative top-[53vh] left-5 xsmall:top-[53vh] small:top-[53vh] small:left-[9vw] medium:top-[53vh] medium:left-[14vw] large:left-[16vw] xlarge:left-[6vw] xlarge:top-[75vh] 2xlarge:top-[65vh]">
          <h1 className="text-[4.5vw] xsmall:text-[3.5vw] small:text-[3vw] medium:text-[2.5vw] large:text-[2vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw] text-blue-700 font-semibold">
            {CoinDetails?.name} ({CoinDetails?.symbol.toUpperCase()}) price has
            increased today.
          </h1>
          <p className="w-[90vw] xsmall:w-[90vw] small:w-[85vw] medium:w-[70vw]  2xlarge:w-[80vw] 2xlarge:text-[1vw] leading-7 mt-5 text-gray-500">
            The price of {CoinDetails?.name} (
            {CoinDetails?.symbol.toUpperCase()}) is{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.current_price?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>
            today with a total volume of{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.total_volume?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>
            .This represents a{" "}
            <span className="text-amber-200">
              {" "}
              {CoinDetails?.market_data?.price_change_percentage_24h.toFixed(2)}
              %{" "}
            </span>
            price increase in the last 24 hours and a{" "}
            <span className="text-amber-200">
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
        <div className=" relative  top-[60vh] xlarge:top-[80vh] xlarge:ml-0  xlarge:mb-0 xlarge:mr-0 small:w-[100vw] ">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CoinFullDetails;
