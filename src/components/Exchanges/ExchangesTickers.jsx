import React, { useEffect, useState } from "react";
import { CoingeckoSanakApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link, useParams } from "react-router-dom";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";

const ExchangesTickers = () => {
  const [exchangesTickers, setExchangesTickers] = useState(null);
  const [ExchangeTickersFullList, setExchangeTickersFullList] = useState(null);
  const [TickersImages, setTickersImages] = useState(null);
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);
  const exchangeRate = 84.38; // Static exchange rate

  useEffect(() => {
    const fetchExchangesTickers = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/exchanges/${id}`,
        CoingeckoSanakApi
      );
      const exchangesTickersData = await response.json();
      setExchangesTickers(exchangesTickersData);
    };
    fetchExchangesTickers();
  }, [id]);

  useEffect(() => {
    exchangesTickers &&
      console.log(exchangesTickers, "Coins comes under Exchanges ");
  }, [exchangesTickers]);

  useEffect(() => {
    const FetchFullTickers = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/exchanges/${id}/tickers?include_exchange_logo=true&page=1&depth=true`,
        CoingeckoSanakApi
      );
      const TickersList = await response.json();
      setExchangeTickersFullList(TickersList);
    };
    FetchFullTickers();
  }, []);

  useEffect(() => {
    ExchangeTickersFullList &&
      console.log(ExchangeTickersFullList, " pairs comes under exchanges  ");
  }, [ExchangeTickersFullList]);

  //   useEffect(() => {
  //     const FetchTickersImage = async () => {
  //       const response = await fetch(
  //         `https://api.coingecko.com/api/v3/coins/${ExchangeTickersFullList?.tickers.map(
  //           (coin, index) => {
  //             return coin?.coin_id;
  //           }
  //         )}`
  //       );
  //       const TickersImageList = await response.json();
  //       setTickersImages(TickersImageList);
  //     };
  //     FetchTickersImage();
  //   }, []);

  //   useEffect(() => {
  //     TickersImages && console.log(TickersImages, "Coins pairs Images ");
  //   }, [TickersImages]);

  return (
    <>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
        <div className=" ml-10 mt-10 flex  ">
          <img
            className=" rounded-lg w-[10vw] h-[5vh] border-2"
            src={exchangesTickers && exchangesTickers?.image}
            alt=""
          />
          <h1 className=" ml-3 text-[6vw] mt- font-semibold text-white">
            {exchangesTickers && exchangesTickers?.name}
          </h1>
        </div>
        <div className="mt-10 ml-10 ">
          <h1 className="font-bold text-[6vw] text-white">Spot Markets</h1>
        </div>
        <div className=" bg-black mt-[8vh] px-2 ">
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
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 min-w-[29vw] 2xlarge:min-w-[15vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Pair
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 min-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-wrap text-black uppercase tracking-wider">
                    Price
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    spread
                  </th>
                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    +2% depth
                  </th>
                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    -2% depth
                  </th>
                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    24 Volume
                  </th>

                  <th className="px-0 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-2 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Trust Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ExchangeTickersFullList &&
                  ExchangeTickersFullList?.tickers.map((coin, index) => (
                    <tr key={index} className="hover:bg-gray-50">
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
                              <span className="text-sm font-medium text-wrap text-gray-900 capitalize">
                                {coin?.coin_id}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold whitespace-nowrap text-xs xsmall:text-sm">
                        <Link to={coin?.trade_url}>
                          <span className="rounded-lg p-1 text-black">
                            {coin?.base}/{coin?.target}
                          </span>
                        </Link>
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        ₹
                        <span className="rounded-lg p-1">
                          {parseFloat(
                            coin?.converted_last?.usd * exchangeRate
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          {coin?.bid_ask_spread_percentage?.toFixed(2)}%
                        </h1>
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $ {coin?.cost_to_move_up_usd?.toFixed(0)}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $ {coin?.cost_to_move_down_usd?.toFixed(0)}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          ₹{" "}
                          {parseFloat(
                            coin?.converted_volume?.usd * exchangeRate
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </h1>
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          {new Date(coin?.last_fetch_at) >
                          new Date(Date.now() - 86400000)
                            ? "Recently"
                            : `${Math.floor(
                                (Date.now() - new Date(coin?.last_fetch_at)) /
                                  86400000
                              )} days ago`}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        {coin?.trust_score === "green" ? (
                          <div className="inline-block px-5 xsmall:px-2 rounded-xl font-bold">
                            <svg
                              className="w-3 h-3 text-green-500"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="12" fill="green" />
                            </svg>
                          </div>
                        ) : (
                          <h1 className="inline-block px-2 xsmall:px-2 rounded-xl font-bold">
                            {coin?.trust_score}
                          </h1>
                        )}
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

export default ExchangesTickers;
