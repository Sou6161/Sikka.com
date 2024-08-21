import React, { useEffect, useState } from "react";
import { CoinGeckoApi } from "../CoinGeckoApi/CoinGeckoApi";

const MainPageMarquee = () => {
  const [MarketData, setMarketData] = useState(null);

  useEffect(() => {
    const GetMarketData = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/global",
        CoinGeckoApi
      );
      const data = await response.json();
      console.log(data);
    };
    GetMarketData(); 
  }, []);

  return (
    <div class="relative flex overflow-x-hidden">
      <div class=" animate-marquee whitespace-nowrap">
        <span class="text-xl mx-4">Coins: Item 1</span>
        <span class="text-xl mx-4">Marquee Item 2</span>
        <span class="text-xl mx-4">Marquee Item 3</span>
        <span class="text-xl mx-4">Marquee Item 4</span>
        <span class="text-xl mx-4">Marquee Item 5</span>
      </div>

      <div class="absolute top-0  animate-marquee2 whitespace-nowrap">
        <span class="text-xl mx-4">Marquee Item 1</span>
        <span class="text-xl mx-4">Marquee Item 2</span>
        <span class="text-xl mx-4">Marquee Item 3</span>
        <span class="text-xl mx-4">Marquee Item 4</span>
        <span class="text-xl mx-4">Marquee Item 5</span>
      </div>
    </div>
  );
};

export default MainPageMarquee;
