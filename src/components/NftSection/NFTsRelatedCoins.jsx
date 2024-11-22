import React, { useEffect } from "react";
import { CoingeckoStardasApi } from "../../api/CoinGeckoApi/CoinGeckoApi";

const NFTsRelatedCoins = () => {
  useEffect(() => {
    const test = async () => {
      const testing = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1&sparkline=false&category=nft",
        CoingeckoStardasApi
      );
      const s = await testing.json();
      console.log(s);
    };
    test()
  }, []);
  return <div>NFTsRelatedCoins</div>;
};

export default NFTsRelatedCoins;
