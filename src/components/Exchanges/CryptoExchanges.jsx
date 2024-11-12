import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoSanakApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";

const CryptoExchanges = () => {
  const [CryptoExchangesList, setCryptoExchangesList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);

  useEffect(() => {
    const FetchExchanges = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/exchanges?per_page=${coinsPerPage}&page=${currentPage}`,
        CoingeckoSanakApi
      );
      const ExchangesList = await response.json();
      setCryptoExchangesList(ExchangesList);
    };
    FetchExchanges();
  }, []);

  useEffect(() => {
    CryptoExchangesList && console.log(CryptoExchangesList);
  }, [CryptoExchangesList]);

  return (
    <>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-black">
        <h1 className=" ml-5 relative top-10 text-[5vw] text-white font-semibold">
          Top Crypto Exchanges Ranked by Trust Score
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          As of today, we track 216 crypto exchanges with a total 24h trading
          volume of $418 Billion, a 35.63% change in the last 24 hours.
          Currently, the 3 largest cryptocurrency exchanges are Binance, Bybit,
          and OKX. Total tracked crypto exchange reserves currently stands at
          $244 Billion.
        </p>
        <div className=" bg-black mt-[14vh] px-2 ">
          <div className="overflow-x-auto   w-full border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-10 z-10 bg-gray-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-black  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Exchange
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 min-w-[29vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Trust Score
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 min-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-wrap text-black uppercase tracking-wider">
                    24h Volume(Normalized)
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Launched
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {CryptoExchangesList &&
                  CryptoExchangesList.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/exchanges/${coin.id}`}>
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
                      <td className="px-5 py-2  xsmall:px-6 xsmall:py-4 text-black font-bold  whitespace-nowrap text-xs xsmall:text-sm">
                        <span className="bg-green-300 rounded-lg p-1">
                          {coin?.trust_score}/10
                        </span>
                      </td>

                      <td className="px-8 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        ₹{" "}
                        {coin?.trade_volume_24h_btc_normalized?.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          ₹{" "}
                          {coin?.trade_volume_24h_btc?.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </h1>
                      </td>
                      <td className="px-5 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          {coin?.year_established}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoExchanges;
