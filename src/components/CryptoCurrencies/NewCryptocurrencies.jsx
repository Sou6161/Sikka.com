import React, { useEffect, useState } from "react";
import { CoinGeckoSanderApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { Link } from "react-router-dom";

const NewCryptocurrencies = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [NewCryptocurrencies, setNewCryptocurrencies] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(50);
  const [hasNextPage, setHasNextPage] = useState(true);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    const diff = (new Date() - new Date(dateString)) / 1000;
    const seconds = Math.floor(diff);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return (
      (days
        ? `${days}d`
        : hours
        ? `${hours}h`
        : minutes
        ? `${minutes}m`
        : `${seconds}s`) + " ago"
    );
  };

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass =
      value >= 0 ? "text-green-600 blink-green" : "text-red-600 blink-red";
    return (
      <span className={`font-semibold ${colorClass}`}>
        <span style={{ color: value < 0 ? "red" : "" }}>
          {value < 0 ? "" : "+"}
          {formattedValue}%
        </span>
      </span>
    );
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchNewCryptocurrencies = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=id_asc&per_page=${coinsPerPage}&page=${currentPage}&sparkline=false`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Sort by date added to CoinGecko (newest first)
        const sortedData = data.sort(
          (a, b) => new Date(b.atl_date) - new Date(a.atl_date)
        );

        // Take the 10 most recently added coins
        const newestCryptos = sortedData;

        setNewCryptocurrencies(newestCryptos);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch new cryptocurrencies");
        setLoading(false);
      }
    };

    fetchNewCryptocurrencies();
  }, [currentPage, coinsPerPage]);

  useEffect(() => {
    NewCryptocurrencies?.length > 0 &&
      console.log(NewCryptocurrencies, "New Crytocurrencies");
  }, [NewCryptocurrencies]);

  if (!isLoading) {
    return (
      <div className=" w-[100vw] h-[100vh] bg-black">
        <div className="loadingHighlight relative top-[40vh] left-[40vw]">
          <svg width="64px" height="48px">
            <polyline
              points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
              id="back"
            ></polyline>
            <polyline
              points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
              id="front"
            ></polyline>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" bg-black ">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <div className="bg-black text-white">
        <h1 className=" ml-5 relative top-10 text-[4.5vw]">
          New Cryptocurrencies
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          Discover new cryptocurrencies that were recently added to CoinGecko.
          Sort by trading volume and the latest price to identify new tokens
          that are gaining popularity in the market. Among all cryptocurrencies
          listed in the last 30 days, you might be interested to know that Major
          Frog and MAKE have the highest trading volume over the last 24 hours.
        </p>
        <div className=" bg-black mt-[10vh] px-2 ">
          <div className="overflow-x-auto   w-full border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-10 z-10 bg-gray-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-black  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Coin
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    ATH(24h)
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    24h
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    FDV
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Total Vol
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Last Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {NewCryptocurrencies &&
                  NewCryptocurrencies.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 max-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {coin.name}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold  whitespace-nowrap text-xs xsmall:text-sm">
                        ₹{" "}
                        {coin?.current_price?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(coin.ath_change_percentage)}
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_24h
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.fully_diluted_valuation
                            ? coin.fully_diluted_valuation.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>

                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        about {formatDate(coin?.last_updated)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between bg-black items-center mt-5  px-3 xsmall:px-6">
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
              disabled={
                NewCryptocurrencies && NewCryptocurrencies.length < coinsPerPage
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCryptocurrencies;
