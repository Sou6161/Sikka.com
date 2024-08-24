import React, { useEffect, useState } from "react";
import { TokenInsightApi } from "../api/CoinGeckoApi/TokenInsightApi";

const CryptoPricesTable = () => {
  const [AllCoinsList, setAllCoinsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage, setCoinsPerPage] = useState(100);

  useEffect(() => {
    const getAllCoins = async () => {
      try {
        const response = await fetch(
          "https://api.tokeninsight.com/api/v1/coins/list",
          TokenInsightApi
        );
        const data = await response.json();
        setAllCoinsList(data?.data?.items || []);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    getAllCoins();
  }, []);


  const lastCoinIndex = currentPage * coinsPerPage;
  const firstCoinIndex = lastCoinIndex - coinsPerPage;
  const currentCoins = AllCoinsList && AllCoinsList.slice(firstCoinIndex, lastCoinIndex);

  // Random sample data
  const sampleData = [
    { id: 1, name: "Bitcoin", logo: "https://example.com/bitcoin.png", price: 30000, price_change_24h: 2.5, price_change_7d: 5.7, volume_24h: 50000000000, market_cap: 1000000000000, rating: "A+" },
    { id: 2, name: "Ethereum", logo: "https://example.com/ethereum.png", price: 2000, price_change_24h: 1.8, price_change_7d: 4.2, volume_24h: 25000000000, market_cap: 500000000000, rating: "A" },
    { id: 3, name: "Cardano", logo: "https://example.com/cardano.png", price: 1.5, price_change_24h: -0.5, price_change_7d: 2.1, volume_24h: 5000000000, market_cap: 50000000000, rating: "B+" },
    { id: 4, name: "Dogecoin", logo: "https://example.com/dogecoin.png", price: 0.3, price_change_24h: 3.2, price_change_7d: -1.5, volume_24h: 2000000000, market_cap: 40000000000, rating: "C" },
    { id: 5, name: "Polkadot", logo: "https://example.com/polkadot.png", price: 15, price_change_24h: -1.2, price_change_7d: 3.8, volume_24h: 1500000000, market_cap: 30000000000, rating: "B" },
  ];

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="sticky left-12 z-10 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px]">Coin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">7d</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Volume</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last 7 Days</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentCoins.map((coin, index) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="sticky left-12 z-10 bg-white px-6 py-4 whitespace-nowrap max-w-[200px]">
                <div className="flex items-center">
                  <img src={coin.logo} alt={coin.name} className="w-6 h-6 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">{coin.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${coin.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.price_change_percentage_24h.toFixed(2)}%</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.price_change_7d.toFixed(2)}%</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${coin.spot_volume_24h.toLocaleString()}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${coin.market_cap.toLocaleString()}</td> */}
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.rating}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Chart placeholder</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoPricesTable;