import React from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";

const AllCoins = () => {
  return (
    <>
      <div className=" bg-black ">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className=" bg-black">
        <h1 className=" ml-5 relative top-10 text-[5vw] text-white font-semibold">
          All Cryptocurrencies
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          View a full list of active cryptocurrencies
        </p>
      </div>
    </>
  );
};

export default AllCoins;
