import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoStardasApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import { Plus, Star, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlistNfts,
  removeFromWatchlistNfts,
} from "../../ReduxSlice/WatchlistNftsSlice";

const NftFloorPriceList = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const watchlistNftsRedux = useSelector(
    (state) => state.watchlistNfts?.nfts || []
  );
  const dispatch = useDispatch();

  // Custom Dialog Component for Remove Confirmation
  const RemoveDialog = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Remove NFT from Portfolio
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Do you really want to remove this NFT from your portfolio?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Fetch NFTs on component mount
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
        setIsLoading(false);
      }
    };
    fetchNFTs();
  }, []);

  // State for remove dialog
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedNftToRemove, setSelectedNftToRemove] = useState(null);

  // Handle star/watchlist icon click
  const handleStarClick = (index, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Handle portfolio selection (add to watchlist)
  const handlePortfolioSelect = (nftId, event) => {
    event.stopPropagation();
    dispatch(addToWatchlistNfts(nftId));
    setActiveDropdown(null);
  };

  // Handle remove from watchlist
  const handleRemoveFromWatchlist = (nftId) => {
    setSelectedNftToRemove(nftId);
    setShowRemoveDialog(true);
  };

  // Confirm remove from watchlist
  const handleRemoveConfirm = () => {
    if (selectedNftToRemove) {
      dispatch(removeFromWatchlistNfts(selectedNftToRemove));
    }
    setShowRemoveDialog(false);
    setSelectedNftToRemove(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if the click is not on a star/dropdown element
      if (!event.target.closest(".dropdown-trigger")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

        {isLoading ? (
          <div className="text-white text-center mt-10">Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {nfts.map((nft, index) => (
              <div
                key={nft.id}
                className="w-[90vw] mt-[7vh] p-3 bg-gray-800 rounded-lg relative"
              >
                <div className="absolute top-2 right-2 dropdown-trigger">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // If already in watchlist, show remove dialog
                      if (watchlistNftsRedux.includes(nft.id)) {
                        handleRemoveFromWatchlist(nft.id);
                      } else {
                        // Otherwise, toggle dropdown
                        handleStarClick(index, e);
                      }
                    }}
                    className="hover:text-yellow-500 focus:outline-none dropdown-trigger"
                  >
                    {watchlistNftsRedux.includes(nft.id) ? (
                      <Check size={24} className="text-green-500" />
                    ) : (
                      <Star
                        size={24}
                        className={`transition-colors dropdown-trigger ${
                          activeDropdown === index
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown for adding to watchlist */}
                  {activeDropdown === index &&
                    !watchlistNftsRedux.includes(nft.id) && (
                      <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                        <div className="py-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={(e) => handlePortfolioSelect(nft.id, e)}
                          >
                            Add to My NFT Portfolio{" "}
                            <Plus className="ml-2" size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                </div>

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

      {/* Remove Confirmation Dialog */}
      <RemoveDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
};

export default NftFloorPriceList;
