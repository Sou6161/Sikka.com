import React, { useEffect, useState } from "react";
import {
  TokenInsightApi,
  TokenInsightApiCoinData,
} from "../api/CoinGeckoApi/TokenInsightApi";
import CryptoAreaChartForTable from "../Charts/MarketCap/MarketCapChartForTable";
import { CoinGeckoApi } from "../api/CoinGeckoApi/CoinGeckoApi";

const CryptoPricesTable = () => {
  const [AllCoinsList, setAllCoinsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [CoinGeckoCoinID, setCoinGeckoCoinID] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [CoinData, setCoinData] = useState({});
  const [coinIds, setCoinIds] = useState([]);

  const coinsPerPage = 100;

  const getAllCoins = async (currentPage, coinsPerPage) => {
    setIsLoading(true);
    const baseUrl = "https://api.tokeninsight.com/api/v1/coins/list";
    const limit = coinsPerPage;
    const offset = (currentPage - 1) * coinsPerPage;
    let allCoins = [];
    let ids = [];

    try {
      const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        ...TokenInsightApi,
        credentials: "same-origin",
      });
      const data = await response.json();
      allCoins = data?.data?.items || [];
      ids = allCoins.map((coin) => coin.id) || [];
      // Sort the coin IDs in the desired order
      ids = ids.sort((a, b) => {
        const order = {
          bitcoin: 1,
          ethereum: 2,
          tether: 3,
          // Add the rest of the IDs in the desired order
        };
        return (order[a] || Infinity) - (order[b] || Infinity);
      });
      console.log("Sorted coin IDs:", ids);
      setAllCoinsList(allCoins);
      setCoinIds(ids);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCoins(1, coinsPerPage);
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      if (coinIds.length === 0) return;

      const coinData = {};
      const queue = [...coinIds];
      const concurrency = 5;
      const delay = 2000;

      try {
        while (queue.length > 0) {
          const nextIds = queue.slice(0, concurrency);
          queue.splice(0, concurrency);
          await Promise.all(
            nextIds.map((id) => fetchCoinDataById(id, coinData, delay))
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const fetchCoinDataById = async (id, coinData, delay) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const response = await fetch(
        // `https://api.tokeninsight.com/api/v1/coins/${id}`,
        TokenInsightApiCoinData
      );
      if (!response.ok) {
        if (response.status === 429) {
          console.log("Rate limit exceeded. Waiting for 1 minute...");
          await new Promise((resolve) => setTimeout(resolve, 60000));
          return fetchCoinDataById(id, coinData, delay);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      coinData[id] = data;
      console.log(`Fetched coin data for ${id}:`, data);
      setCoinData((prevCoinData) => ({ ...prevCoinData, [id]: data }));
    };

    fetchCoinData();
  }, [coinIds]);

  useEffect(() => {
    console.log("CoinData:", CoinData);
  }, [CoinData]);

  

  useEffect(() => {
    const CoinGeckoCoinsList = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/list",
        CoinGeckoApi
      );
      const data = await response.json();
      console.log(data, "CoinGecko All Coins List Table section");
  
      // Calculate currentCoins inside the useEffect hook
      const lastCoinIndex = currentPage * coinsPerPage;
      const firstCoinIndex = lastCoinIndex - coinsPerPage;
      const currentCoins = AllCoinsList.slice(firstCoinIndex, lastCoinIndex);
      console.log(currentCoins, "Current Coins"); // Log currentCoins
  
      // Map through the data and match the symbol with currentCoins
      const matchedCoins = data.map((coin) => {
        const matchedCoin = currentCoins.find((currentCoin) =>
          currentCoin.symbol.toLowerCase() === coin.symbol.toLowerCase()
        );
        if (matchedCoin) {
          return { id: coin.id, index: currentCoins.indexOf(matchedCoin) };
        }
        return null;
      })
        .filter((coin) => coin !== null)
        .sort((a, b) => a.index - b.index); // Sort by index
      console.log(matchedCoins, "Matched Coins"); // Log matchedCoins
  
      // Filter out null values and store the first matched ID in state
      const firstMatchedID = matchedCoins[0].id;
      console.log(firstMatchedID, "First Matched ID"); // Log firstMatchedID
      setCoinGeckoCoinID(firstMatchedID);
    };
  
    CoinGeckoCoinsList();
  }, [AllCoinsList, currentPage, coinsPerPage]);

  
  // useEffect(() => {
  //   if (CoinGeckoCoinID > 0) {
  //     console.log(CoinGeckoCoinID);
  //   }
  // }, [CoinGeckoCoinID]);

  const lastCoinIndex = currentPage * coinsPerPage;
  const firstCoinIndex = lastCoinIndex - coinsPerPage;
  const currentCoins = AllCoinsList.slice(firstCoinIndex, lastCoinIndex);
  console.log(currentCoins, "Current coins");

  const totalPages = Math.ceil(AllCoinsList.length / coinsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllCoins(currentPage + 1, coinsPerPage);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      getAllCoins(currentPage - 1, coinsPerPage);
      setCurrentPage(currentPage - 1);
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
    <div>
      <div className="overflow-x-auto w-full border-2 border-purple-500 rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-100 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="sticky left-10 z-10 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px]">
                Coin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                7d
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ratings
              </th>
              <th className="px-6 py-3 max-w-[30vw] bg-purple-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last 7 Days
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCoins.map((coin, index) => (
              <tr key={coin.id} className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  {firstCoinIndex + index + 1}
                </td>
                <td className="sticky left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-3 py-4 max-w-[200px]">
                  <div className="flex items-center">
                    <img
                      src={coin.logo}
                      alt={coin.name}
                      className="w-6 h-6 mr-2 flex-shrink-0"
                    />
                    <span className="text-sm font-medium w-[33vw] text-gray-900">
                      {coin.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${coin.price.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap font-semibold text-sm ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-500 blink-green"
                      : "text-red-500 blink-red"
                  }`}
                >
                  {(coin.price_change_percentage_24h * 100).toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* {(coin.price_change_percentage_24h * 100).toFixed(2)}% */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${coin.spot_volume_24h.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  text-white">
                  <h1 className=" bg-black inline-block px-2 rounded-xl">
                    {" "}
                    {CoinData[coin.id]?.data?.rating?.rating || "N/A"}
                  </h1>
                </td>
                <td
                  className="px-6 py-4  whitespace-nowrap text-sm text-gray-500"
                  style={{ minWidth: "200px" }}
                >
                  <CryptoAreaChartForTable />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 px-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-cyan-600 ml-3 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoPricesTable;
