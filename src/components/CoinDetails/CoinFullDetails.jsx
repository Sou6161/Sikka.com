import React, { useEffect } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { useParams } from "react-router-dom";

const CoinFullDetails = () => {
  const { id } = useParams();

  console.log(id, "iouhouhgghuoggoo");

  useEffect(() => {
    const FetchCoinDetails = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=true&sparkline=true`
      );
      const CoinData = await response.json();
      console.log(CoinData);
    };
    FetchCoinDetails();
  }, []);
  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-[100vw] h-[100vh] bg-black"></div>
    </>
  );
};

export default CoinFullDetails;
