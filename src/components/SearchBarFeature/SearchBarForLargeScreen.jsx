import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBarForLargeScreen = () => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [trendingData, setTrendingData] = useState({ coins: [], nfts: [] });
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);
    const [isTrendingCoins, setIsTrendingCoins] = useState(true);
    const [isTrendingNFTs, setIsTrendingNFTs] = useState(false);
    const [showAllCoins, setShowAllCoins] = useState(false);
    const searchRef = useRef(null);
  
    // Fetch trending data
    useEffect(() => {
      const fetchTrendingData = async () => {
        try {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/search/trending"
          );
          const data = await response.json();
          setTrendingData({
            coins: data.coins || [],
            nfts: data.nfts || [],
          });
        } catch (error) {
          console.error("Error fetching trending data:", error);
        } finally {
          setIsTrendingLoading(false);
        }
      };
  
      if (isSearchExpanded) {
        fetchTrendingData();
      }
    }, [isSearchExpanded]);
  
    // Handle outside clicks
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsSearchExpanded(false);
          setShowResults(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    // Get displayed coins based on showAllCoins state
    const getDisplayedCoins = () => {
      return showAllCoins ? trendingData.coins : trendingData.coins.slice(0, 6);
    };
  
    // Debounce function
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
  
    const fetchSearchResults = async (query) => {
      if (!query) {
        setSearchResults({});
        setShowResults(false);
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setSearchResults({
          coins: (data.coins || []).slice(0, 5),
          nfts: (data.nfts || []).slice(0, 5)
        });
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults({});
      }
      setIsLoading(false);
    };
  
    const debouncedSearch = useCallback(
      debounce((query) => fetchSearchResults(query), 300),
      []
    );
  
    const handleSearchInput = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    };
  
    const toggleSearch = () => {
      setIsSearchExpanded(!isSearchExpanded);
    };
  
    return (
      <li
        className="hidden 2xlarge:block large:block absolute top-0 2xlarge:top-1 left-[50vw] medium:left-[45vw] large:left-[85vw]  xlarge:left-[77vw] 2xlarge:left-[77vw]"
        ref={searchRef}
      >
        <button
          onClick={toggleSearch}
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p-2 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
        >
          <Search
            size={30}
            className="text-red-600 relative large:left-[9vw] large:top-1 xlarge:left-[17vw] 2xlarge:top-2"
          />
        </button>
        {isSearchExpanded && (
          <div className="absolute right-0 -mt-[5vh] w-[20vw] large:w-[28vw] xlarge:w-[33vw] 2xlarge:w-[30vw] 2xlarge:-mt-[4vh] large:-mt-[5vh] large:-right-[5vw] xlarge:-right-[14vw] bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Coins, NFTs..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-[20vw] large:w-[28vw] xlarge:w-[33vw] 2xlarge:w-[30vw] p-2 pl-10 text-sm text-gray-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
              />
              <span className="absolute left-0 top-2 2xlarge:-left-3 text-gray-600 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-[4vw] h-[3vh]"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
            </div>
  
            {/* Search Results or Trending Content */}
            <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {/* Trending/Search Toggle Header */}
              {!searchQuery && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        isTrendingCoins
                          ? "bg-gray-100 dark:bg-gray-700 text-blue-500"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setIsTrendingCoins(true);
                        setIsTrendingNFTs(false);
                      }}  
                    >
                      🔥 Trending Coins
                    </button>
                    <button
                      className={`px-2 py-1  rounded-full text-sm font-medium ${
                        isTrendingNFTs
                          ? "bg-gray-100 dark:bg-gray-700 text-blue-500"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setIsTrendingCoins(false);
                        setIsTrendingNFTs(true);
                      }}
                    >
                      🖼 Trending NFTs
                    </button>
                  </div>
                </div>
              )}
  
              {/* Content Area */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery && showResults ? (
                  // Search Results
                  isLoading ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Loading...
                    </div>
                  ) : (
                    <div>
                      {/* Coins Section */}
                      {searchResults.coins?.length > 0 && (
                        <div className="p-2">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                            Coins
                          </div>
                          {searchResults.coins.map((coin) => (
                            <Link
                              key={coin.id}
                              to={`/en/coins/${coin.id}`}
                              className="block"
                            >
                              <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <img
                                  src={coin.thumb}
                                  alt={coin.name}
                                  className="w-6 h-6 rounded-full mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {coin.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {coin.symbol.toUpperCase()}
                                  </div>
                                </div>
                                {coin.market_cap_rank && (
                                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                    #{coin.market_cap_rank}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
  
                      {/* NFTs Section */}
                      {searchResults.nfts?.length > 0 && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                            NFTs
                          </div>
                          {searchResults.nfts.map((nft) => (
                            <div
                              key={nft.id}
                              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                            >
                              <img
                                src={nft.thumb}
                                alt={nft.name}
                                className="w-6 h-6 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {nft.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {nft.symbol}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
  
                      {searchResults.coins?.length === 0 && searchResults.nfts?.length === 0 && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No results found
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  // Trending Content
                  <div className="p-4">
                    {isTrendingLoading ? (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        Loading trending data...
                      </div>
                    ) : (
                      <>
                        {isTrendingCoins && (
                          <div>
                            {getDisplayedCoins().map(({ item }) => (
                              <Link key={item.id} to={`/en/coins/${item.id}`}>
                                <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                  <img
                                    src={item.thumb}
                                    alt={item.name}
                                    className="w-6 h-6 rounded-full mr-3"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.symbol.toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="ml-auto text-right">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      #{item.market_cap_rank}
                                    </div>
                                    {item.data?.price_change_percentage_24h && (
                                      <div
                                        className={`text-xs ${
                                          item.data.price_change_percentage_24h.usd >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {item.data.price_change_percentage_24h.usd >= 0 ? "+" : ""}
                                        {item.data.price_change_percentage_24h.usd.toFixed(2)}%
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))}
  
                            {trendingData.coins.length > 6 && (
                              <button
                                onClick={() => setShowAllCoins(!showAllCoins)}
                                className="w-full mt-4 py-2 px-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                {showAllCoins ? "Show Less" : "Show More"}
                              </button>
                            )}
                          </div>
                        )}
  
                        {isTrendingNFTs && (
                          <div>
                            {trendingData.nfts.map((nft) => (
                            <div
                              key={nft.id}
                              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                            >
                              <img
                                src={nft.thumb}
                                alt={nft.name}
                                className="w-6 h-6 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {nft.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {nft.symbol}
                                </div>
                              </div>
                              {nft.floor_price && (
                                <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                  Floor: {nft.floor_price.toFixed(3)} ETH
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default SearchBarForLargeScreen;
