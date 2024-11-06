import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoinGeckoChaloApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import TrendingCoins from "./TrendingCoins";
import TopGainers from "./TopGainers";
import TopLosers from "./TopLosers";
import NewCoins from "./NewCoins";
import HighestCoinVolume from "./HighestCoinVolume";
import AllTimeHighPrice from "./AllTimeHIghPrice";
import MostVotedCoins from "./MostVotedCoins";
import Footer from "../../Footer/Footer"

const CryptoHighlightsData = () => {
  const [TrendingCoinsHL, setTrendingCoinsHL] = useState(null);
  const [TopCryptoGainers, setTopCryptoGainers] = useState(null);
  const [TopCryptoLosers, setTopCryptoLosers] = useState(null);
  const [CoinsByTradingVol, setCoinsByTradingVol] = useState(null);
  const [AllTimeHighCoinPrice, setAllTimeHighCoinPrice] = useState(null);
  const [NewCryptoCoin, setNewCryptoCoin] = useState([]);
  const [MostVoted, setMostVoted] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const FetchTrendingCoinsHL = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        CoinGeckoChaloApi
      );
      const TrendingData = await response.json();
      setTrendingCoinsHL(TrendingData);
    };
    FetchTrendingCoinsHL();
  }, []);

  useEffect(() => {
    // TrendingCoinsHL && console.log(TrendingCoinsHL, "Trending Coins ");
  }, [TrendingCoinsHL]);

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
          const gainers = sortedCoins.slice(0, 10);
          setTopCryptoGainers(gainers);

          // Get top 10 losers
          const losers = sortedCoins.slice(-10).reverse();
          setTopCryptoLosers(losers);
        })
        .catch((error) => console.error(error));
    };
    FetchTopGainersLosersHL();
  }, []);

  useEffect(() => {
    // TopCryptoGainers && console.log(TopCryptoGainers, " Top Crypto Gainers");
    // TopCryptoLosers && console.log(TopCryptoLosers, "Top Crypto Losers ");
  }, [TopCryptoGainers, TopCryptoLosers]);

  useEffect(() => {
    const FetchTopCoinsByVolume = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1&sparkline=false",
        CoinGeckoChaloApi
      );
      const newData = await response.json();
      // console.log(newData);
      setCoinsByTradingVol(newData);
    };
    FetchTopCoinsByVolume();
  }, []);

  // useEffect(() => {
  //   CoinsByTradingVol &&
  //     console.log(CoinsByTradingVol, "Top Coins By Trading Volume");
  // }, [CoinsByTradingVol]);

  useEffect(() => {
    const FetchAllTimeHighPrice = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&include_ath_change=true",
        CoinGeckoChaloApi
      );
      const HighData = await response.json();
      // console.log(HighData);
      setAllTimeHighCoinPrice(HighData);
    };
    FetchAllTimeHighPrice();
  }, []);

  // useEffect(() => {
  //   AllTimeHighCoinPrice &&
  //     console.log(AllTimeHighCoinPrice, "All Time High Coin Price");
  // }, [AllTimeHighCoinPrice]);

  useEffect(() => {
    setIsLoading(true);

    const fetchNewCryptos = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=id_asc&per_page=250&page=1&sparkline=false",
          CoinGeckoChaloApi
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
        const newestCryptos = sortedData.slice(0, 10);

        setNewCryptoCoin(newestCryptos);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch new cryptocurrencies");
        setLoading(false);
      }
    };
    setIsLoading(false);

    fetchNewCryptos();
  }, []);

  // useEffect(() => {
  //   NewCryptoCoin?.length > 0 &&
  //     console.log(NewCryptoCoin, "New Crytocurrencies");
  // }, [NewCryptoCoin]);


  useEffect(()=>{
    const FetchMostVotedCoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false",
        CoinGeckoChaloApi
      );
      const MostVotedData = await response.json();
      // console.log(MostViewedData);
      setMostVoted(MostVotedData);
    };
    FetchMostVotedCoins();
  },[])

  useEffect(() => {
    MostVoted?.length > 0 &&
        console.log(MostVoted, "Most Voted Coins");
    }, [MostVoted]);

   

  if (isLoading) {
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
  // if (error)
  //   return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-black h-[490vh] text-white">
        <h1 className=" ml-5 relative top-10 text-[4.5vw]">
          Crypto Highlights
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          Which cryptocurrencies are people more interested in? Track and
          discover the most interesting cryptocurrencies based on market and
          CoinFam activity.
        </p>

        <div className="">
          <TrendingCoins TrendingCoinsHL={TrendingCoinsHL} />
          <TopGainers TopCryptoGainers={TopCryptoGainers}/>
          <TopLosers TopCryptoLosers={TopCryptoLosers}/>
          <NewCoins NewCryptoCoin={NewCryptoCoin}/>
          <HighestCoinVolume CoinsByTradingVol={CoinsByTradingVol}/>
          <AllTimeHighPrice AllTimeHighCoinPrice={AllTimeHighCoinPrice}/>
          <MostVotedCoins MostVotedCrytoCoins={MostVoted}/>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CryptoHighlightsData;
