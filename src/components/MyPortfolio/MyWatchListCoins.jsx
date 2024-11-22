// Modified MyWatchListCoins.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import OnlyHeaderComp from '../Header Folder/OnlyHeaderComp';
import MainPageMarquee from '../MarqueeComponent/MainPageMarquee';

const MyWatchListCoins = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const watchlistIds = useSelector((state) => state.watchlist.coins);

  const fetchWatchlistData = async () => {
    setIsLoading(true);
    try {
      // Fetch data only for watchlist coins
      const promises = watchlistIds.map(id =>
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&sparkline=true&price_change_percentage=1h%2C24h%2C7d`)
          .then(res => res.json())
          .then(data => data[0])
      );
      
      const coins = await Promise.all(promises);
      setWatchlistData(coins.filter(Boolean)); // Filter out any null values
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (watchlistIds.length > 0) {
      fetchWatchlistData();
    } else {
      setWatchlistData([]);
      setIsLoading(false);
    }
  }, [watchlistIds]);

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass = value >= 0 ? "text-green-600" : "text-red-600";
    return <span className={`font-semibold ${colorClass}`}>{formattedValue}%</span>;
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
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
        {watchlistData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No coins in your watchlist yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              {/* Your existing table header structure */}
              <tbody className="bg-white divide-y divide-gray-200">
                {watchlistData.map((coin, index) => (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${coin.current_price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_1h_in_currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_24h)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_7d_in_currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyWatchListCoins;