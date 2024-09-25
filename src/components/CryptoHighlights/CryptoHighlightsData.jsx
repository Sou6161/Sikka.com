import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoinGeckoChaloApi } from "../../api/CoinGeckoApi/CoinGeckoApi";


const CryptoHighlightsData = () => {
  const [TrendingCoinsHL, setTrendingCoinsHL] = useState(null);

  useEffect(() => {
    const FetchTrendingCoinsHL = async () => {
      const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/gainers-losers&b709611f-b594-451f-87a0-a4e823e99d78");
      const TrendingHighlights = await response.json();
    //   console.log(TrendingHighlights);
      setTrendingCoinsHL(TrendingHighlights);
    };
    FetchTrendingCoinsHL();
  }, []);

  useEffect(() => {
    TrendingCoinsHL && console.log(TrendingCoinsHL);
  }, [TrendingCoinsHL]);

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-black h-screen text-white">
        <h1 className=" ml-5 relative top-10 text-[4.5vw]">
          Crypto Highlights
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          Which cryptocurrencies are people more interested in? Track and
          discover the most interesting cryptocurrencies based on market and
          CoinGecko activity.
        </p>
      </div>
    </>
  );
};

export default CryptoHighlightsData;
