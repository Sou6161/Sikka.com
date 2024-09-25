import React, { useEffect, useState } from "react";
import CryptoAreaChartForTable from "../Charts/MarketCap/MarketCapChartForTable";
import { useDispatch } from "react-redux";
import {
  addCGCoinGraphData,
  addCGCoinId,
  addCGCoinSymbol,
} from "../ReduxSlice/CGCoinTableGraphSlice";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "react-router-dom";

const CoinSparkline = ({ coinData }) => {
  const trend =
    coinData[coinData.length - 1] > coinData[0] ? "#00FF00" : "#FF0000";
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlink((prevBlink) => !prevBlink);
    }, 1000); // blink every 500ms
    return () => clearInterval(intervalId);
  }, []);

  const getBlinkColor = () => {
    if (trend === "#00FF00") {
      return blink ? "#2E865F" : "#64f86e"; // blink between dark green and light green
    } else {
      return blink ? "#fc6060" : "#ff001e"; // blink between light red and dark red
    }
  };

  return (
    <Sparklines data={coinData} width={300} height={70}>
      <SparklinesLine
        color={getBlinkColor()} // blink between different shades
        style={{ strokeWidth: 2 }}
      />
    </Sparklines>
  );
};

const CryptoPricesTable = () => {
  const [allCoinsList, setAllCoinsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [CGCoinId, setCGCoinId] = useState([]);
  const [CGcoinSymbol, setCGcoinSymbol] = useState([]);
  const dispatch = useDispatch();

  const coinsPerPage = 100;

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass =
      value >= 0 ? "text-green-600 blink-green" : "text-red-600 blink-red ";
    return (
      <span className={`font-semibold ${colorClass}`}>{formattedValue}%</span>
    );
  };

  const fetchCoins = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y`
      );
      if (response.ok) {
        const coins = await response.json();
        if (Array.isArray(coins) && coins.length > 0) {
          // console.log(coins, "All CG Coins List per page 100");
          setAllCoinsList(coins);
          // console.log(coins)
          setHasNextPage(coins.length === coinsPerPage);

          // Map over coins and store IDs and symbols in state
          const coinIds = coins.map((coin) => coin.id);
          const coinSymbols = coins.map((coin) => coin.symbol);
          setCGCoinId(coinIds);
          setCGcoinSymbol(coinSymbols);

          // Dispatch to Redux store
          dispatch(addCGCoinId(coinIds));
          dispatch(addCGCoinSymbol(coinSymbols));
        } else {
          setHasNextPage(false);
        }
      } else if (response.status === 429) {
        console.error(
          "Rate limit exceeded. Waiting for 1 minute before retrying."
        );
        setTimeout(() => fetchCoins(page), 60000); // retry after 1 minute
      } else {
        console.error("Error fetching coin data:", response.status);
        setHasNextPage(false);
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setHasNextPage(false);
    }
    setIsLoading(false);
  };

  
  useEffect(() => {
    fetchCoins(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full border-2 border-purple-500 rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                #
              </th>
              <th className="sticky left-8 xsmall:left-10 z-10 bg-gray-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-black  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                Coin
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                1h
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                24h
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                7d
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                Total Volume
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                Last 7 Days
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allCoinsList.map((coin, index) => (
              <tr key={coin.id} className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                  {(currentPage - 1) * coinsPerPage + index + 1}
                </td>
                <td className="sticky left-8 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 max-w-[150px] xsmall:max-w-[200px]">
                  <div className="flex items-center">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-4 h-4 xsmall:w-6 xsmall:h-6 mr-1 xsmall:mr-2"
                    />
                    <Link to={`/en/coins/${coin.id}`}>
                      <span className="text-[4vw] xsmall:text-sm 2xlarge:text-[1vw] font-medium w-[20vw] h-[6vh]  whitespace-normal xsmall:w-[33vw] text-gray-900 truncate ">
                        {coin.name}
                        <h1 className="flex flex-col text-gray-600 text-[3vw] xsmall:text-[2vw] xlarge:text-[1vw] 2xlarge:text-[0.8vw]">
                          {coin?.symbol?.toUpperCase()}
                        </h1>
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                  ${coin.current_price ? coin.current_price.toFixed(2) : "N/A"}
                </td>
                <td className="px-2 py-2 xsmall:px-4 xsmall:py-4 whitespace-nowrap font-semibold text-xs xsmall:text-sm">
                  {renderPercentageChange(
                    coin.price_change_percentage_1h_in_currency
                  )}
                </td>
                <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm">
                  {renderPercentageChange(coin.price_change_percentage_24h)}
                </td>
                <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm">
                  {renderPercentageChange(
                    coin.price_change_percentage_7d_in_currency
                  )}
                </td>
                <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                  <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                    $
                    {coin.total_volume
                      ? coin.total_volume.toLocaleString()
                      : "N/A"}
                  </h1>
                </td>
                <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-bold text-gray-500">
                  ${coin.market_cap ? coin.market_cap.toLocaleString() : "N/A"}
                </td>
                <td
                  className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500"
                  style={{ minWidth: "150px" }}
                >
                  {coin.sparkline_in_7d && coin.sparkline_in_7d.price ? (
                    <CoinSparkline coinData={coin.sparkline_in_7d.price} />
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 px-3 xsmall:px-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-cyan-600 ml-2 xsmall:ml-3 font-semibold text-lg xsmall:text-sm">
          Page {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoPricesTable;
