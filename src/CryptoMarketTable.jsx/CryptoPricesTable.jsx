import React, { useEffect, useState } from "react";
import { TokenInsightApi } from "../api/CoinGeckoApi/TokenInsightApi";

const CryptoPricesTable = () => {
  const [AllCoinsList, setAllCoinsList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage, setCoinsPerPage] = useState(100);

  useEffect(() => {
    const GetAllCoins = async () => {
      const response = await fetch(
        "https://api.tokeninsight.com/api/v1/coins/list?limit=1500",
        TokenInsightApi
      );
      const data = await response.json();
      setAllCoinsList(data?.data?.items);
    };
    GetAllCoins();
  }, []);

  const lastCoinIndex = currentPage * coinsPerPage;
  const firstCoinIndex = lastCoinIndex - coinsPerPage;
  const currentCoins = AllCoinsList && AllCoinsList.slice(firstCoinIndex, lastCoinIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full h-full text-left">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="px-4 py-2 sticky left-0 bg-gray-200">Counting</th>
            <th className="px-4 py-2 sticky left-16 bg-gray-200">Coin</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">24h</th>
            <th className="px-4 py-2">7d</th>
            <th className="px-4 py-2">24h Volume</th>
            <th className="px-4 py-2">Market Cap</th>
            <th className="px-4 py-2">Ratings</th>
            <th className="px-4 py-2">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {currentCoins &&
            currentCoins.map((coin, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2 sticky left-0 bg-gray-200">{(currentPage - 1) * coinsPerPage + index + 1}</td>
                <td className="px-4 py-2 sticky left-16 bg-gray-200">{coin.name}</td>
                <td className="px-4 py-2">{coin.current_price}</td>
                <td className="px-4 py-2">{coin.price_change_percentage_24h}</td>
                <td className="px-4 py-2">{coin.price_change_percentage_7d}</td>
                <td className="px-4 py-2">{coin.total_volume}</td>
                <td className="px-4 py-2">{coin.market_cap}</td>
                <td className="px-4 py-2">{coin.public_interest_score}</td>
                <td className="px-4 py-2">{coin.price_change_percentage_7d}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(AllCoinsList && AllCoinsList.length / coinsPerPage)} className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded mx-2">
          Next Page
        </button>
      </div>
    </div>
  );
};

export default CryptoPricesTable;