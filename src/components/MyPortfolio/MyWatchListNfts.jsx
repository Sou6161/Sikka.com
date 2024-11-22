import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { removeFromWatchlistNfts } from "../../ReduxSlice/WatchlistNftsSlice";

const MyWatchListNfts = () => {
  const watchlistNfts = useSelector((state) => state.watchlistNfts.nfts);
  const [WatchlistNftData, setWatchlistNftData] = useState({});

  const dispatch = useDispatch();

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass = value >= 0 ? "text-green-600" : "text-red-600";
    return (
      <span className={`font-semibold ${colorClass}`}>{formattedValue}%</span>
    );
  };

  useEffect(() => {
    const fetchWatchlistNfts = async () => {
      if (watchlistNfts.length === 0) return;

      const promises = watchlistNfts.map((id) =>
        fetch(`https://api.coingecko.com/api/v3/nfts/${id}`)
          .then((response) => response.json())
          .catch((error) => console.error(error))
      );

      const data = await Promise.all(promises);
      const filteredData = data.filter((item) => item !== undefined);

      setWatchlistNftData(filteredData);
    };

    fetchWatchlistNfts();
  }, [watchlistNfts]);

  useEffect(() => {
    WatchlistNftData.length > 0 && console.log(WatchlistNftData);
  }, [WatchlistNftData]);

  const handleRemoveNft = (id) => {
    dispatch(removeFromWatchlistNfts(id));
    setWatchlistNftData(WatchlistNftData.filter((nft) => nft.id !== id));
  };

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="mt-10 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-5">NFT WatchList</h1>
        {WatchlistNftData.length > 0 ? (
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100 text-[3.5vw] text-nowrap">
              <tr>
                <th className="px-4 py-2 uppercase">#</th>
                <th className="px-4 py-2 uppercase">NFT</th>
                <th className="px-4 py-2 uppercase ">Floor Price</th>
                <th className="px-4 py-2 uppercase ">24%</th>
                <th className="px-4 py-2 uppercase">Market Cap</th>
                <th className="px-4 py-2 uppercase"> 24h Volume</th>
                <th className="px-4 py-2 uppercase">24h Sales</th>
                <th className="px-4 py-2 uppercase">24h Owners</th>
                <th className="px-4 py-2 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {WatchlistNftData.map((nft, index) => (
                <tr key={nft?.id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 flex items-center flex-col">
                    <img
                      src={nft?.image?.small}
                      alt={nft?.name}
                      className="w-10 h-10 rounded-full mb-2"
                    />
                    <Link
                      to={`/en/nft/${nft?.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {nft?.name}
                    </Link>
                    <p className="text-gray-500 text-sm">
                      {nft?.asset_platform_id}
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    {nft?.floor_price?.native_currency} ETH <br/>
                   ${nft?.floor_price?.usd?.toLocaleString()}
                  </td>

                  <td className="px-2 py-2">
                    {renderPercentageChange(
                      nft?.floor_price_in_usd_24h_percentage_change
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {nft?.market_cap?.native_currency.toLocaleString()} ETH{" "}
                    <br />${nft?.market_cap?.usd?.toLocaleString()}
                  </td>

                  <td className="px-4 py-2">
                    {nft?.volume_24h?.native_currency} ETH <br />$
                    {nft?.volume_24h?.usd?.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{nft?.one_day_sales}</td>
                  <td className="px-4 py-2">
                    {renderPercentageChange(
                      nft?.one_day_sales_24h_percentage_change
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRemoveNft(nft?.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No NFTs in watchlist.</p>
        )}
      </div>
    </>
  );
};

export default MyWatchListNfts;