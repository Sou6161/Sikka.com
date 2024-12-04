import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CosmicSearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSearchResults({
        coins: (data.coins || []).slice(0, 5),
        nfts: (data.nfts || []).slice(0, 5),
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

  return (
    <div className="relative" ref={searchRef}>
      <div id="search-container" className="relative top- right-5 ">
        <div className="nebula"></div>
        <div className="starfield"></div>
        <div className="cosmic-dust"></div>
        <div className="cosmic-dust"></div>
        <div className="cosmic-dust"></div>
        <div className="stardust"></div>
        <div className="cosmic-ring"></div>
        <div id="main">
          <input
            className="input"
            name="text"
            type="text"
            placeholder="Search Your Crypto Coin..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <div id="input-mask"></div>
          <div id="cosmic-glow"></div>
          {/* <div className="wormhole-border"></div>
          <div id="wormhole-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              stroke="#a9c7ff"
              fill="none"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <circle r="10" cy="12" cx="12"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div> */}
          <div id="search-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              stroke="url(#cosmic-search)"
              fill="none"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <circle r="8" cy="11" cx="11"></circle>
              <line y2="16.65" x2="16.65" y1="21" x1="21"></line>
              <defs>
                <linearGradient
                  gradientTransform="rotate(45)"
                  id="cosmic-search"
                >
                  <stop stopColor="#a9c7ff" offset="0%"></stop>
                  <stop stopColor="#6e8cff" offset="100%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {showResults &&
        (searchResults.coins?.length > 0 || searchResults.nfts?.length > 0) && (
            <div className="absolute w-full z-[100]  mt-4 2xlarge:mt-0 2xlarge:right-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <div className="max-h-[60vh] 2xlarge:h-[36vh] hide-scrollbar    overflow-y-auto  2xlarge:z-[100]">
                {searchResults.coins?.length > 0 && (
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                      Coins
                    </div>
                    {searchResults.coins.map((coin) => (
                      <Link key={coin.id} to={`/en/coins/${coin.id}`}>
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
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default CosmicSearchInput;
