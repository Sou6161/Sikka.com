import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoinGeckoChaloApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";
import LatestArticlesData from "../../LatestArticles/LatestArticlesData";

const TopGainerAndLosers = () => {
  const [TopCryptoGainers, setTopCryptoGainers] = useState(null);
  const [TopCryptoLosers, setTopCryptoLosers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(50);

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
    const FetchTopGainersLosersHL = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1",
        CoinGeckoChaloApi
      )
        .then((response) => response.json())
        .then((data) => {
          // Sort coins by 24-hour price change percentage
          const sortedCoins = data.sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          );

          // Get top 10 gainers
          const gainers = sortedCoins.slice(0, 30);
          setTopCryptoGainers(gainers);

          // Get top 10 losers
          const losers = sortedCoins.slice(-30).reverse();
          setTopCryptoLosers(losers);
        })
        .catch((error) => console.error(error));
    };
    FetchTopGainersLosersHL();
  }, []);

  useEffect(() => {
    TopCryptoGainers && console.log(TopCryptoGainers, " Top Crypto Gainers");
    TopCryptoLosers && console.log(TopCryptoLosers, "Top Crypto Losers ");
  }, [TopCryptoGainers, TopCryptoLosers]);

  return (
    <>
      <div className=" bg-black ">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className=" bg-black ">
        <h1 className=" ml-5 relative top-10 text-[5vw] text-white font-semibold">
          Top Crypto Gainers and Losers
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          Discover the largest gainers and losers across all major
          cryptocurrencies listed on CoinGecko, based on price movements in the
          last 24 hours.
        </p>

        <h1 className=" relative top-[10vh] ml-5 font-semibold text-[6vw] text-yellow-400">
          🚀 Top Gainers
        </h1>
        <div className=" bg-black mt-[14vh] px-2 ">
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
                    24h
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Total Vol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {TopCryptoGainers &&
                  TopCryptoGainers.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-wrap text-gray-900">
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
                        {renderPercentageChange(
                          coin.price_change_percentage_24h
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <h1 className=" relative top-[10vh] ml-5 font-semibold text-[6vw] text-yellow-400">
          📉 Top Losers
        </h1>
        <div className=" bg-black mt-[14vh] px-2 ">
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
                    24h
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Total Vol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {TopCryptoLosers &&
                  TopCryptoLosers.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-wrap text-gray-900">
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
                        {renderPercentageChange(
                          coin.price_change_percentage_24h
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <LatestArticlesData />
        <div className=" mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default TopGainerAndLosers;
