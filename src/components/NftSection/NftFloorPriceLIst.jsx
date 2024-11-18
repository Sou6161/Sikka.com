import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoStardasApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";

const NftFloorPriceList = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/nfts/list?order=market_cap_usd_desc&per_page=100&page=1",
          CoingeckoStardasApi
        );
        const data = await response.json();
        setNFTs(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching NFT list:", error);
      }
    };
    fetchNFTs();
  }, []);

  useEffect(() => {
    if (nfts && nfts.length > 0) {
      console.log(nfts, "All NFTs List");
    }
  }, [nfts]);

  return (
    <>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-black min-h-screen">
        <h1 className="ml-5 relative top-10 text-[5vw] text-white font-semibold">
          Top NFT Collection Ranked by Market Cap
        </h1>
        <p className="text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          The global NFT market cap today is $5.17 Billion, a 10.6% change in
          the last 24 hours. Read more
        </p>

        {nfts === null ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {nfts.map((nft, index) => (
              <div
                key={index}
                className="w-[90vw] mt-[7vh]  p-3 bg-gray-800  rounded-lg"
              >
                <Link to={`/en/nft/${nft.id}`}>
                  <h2 className="text-white text-2xl hover:underline capitalize">
                    {nft.name}
                  </h2>
                </Link>
                <p className="text-gray-500 mt-2 capitalize">
                  NFT Platform: {nft.asset_platform_id}
                </p>
                <p className="text-gray-500">Symbol: {nft.symbol}</p>
                <p className="text-gray-500 truncate">
                  Contract Address: {nft.contract_address}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NftFloorPriceList;
