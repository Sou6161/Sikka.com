import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

const DynamicSearchBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isTrendingCoins, setIsTrendingCoins] = useState(true);
  const [isTrendingNFTs, setIsTrendingNFTs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trendingData, setTrendingData] = useState({ coins: [], nfts: [] });
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [showAllCoins, setShowAllCoins] = useState(false);

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

    fetchTrendingData();
  }, []);

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

      // Filter and limit categories to 4 exact matches
      const filteredCategories = (data.categories || [])
        .filter(
          (category) =>
            category.name.toLowerCase() === query.toLowerCase() ||
            category.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4);

      // Filter and limit exchanges to 3 exact matches
      const filteredExchanges = (data.exchanges || [])
        .filter(
          (exchange) =>
            exchange.name.toLowerCase() === query.toLowerCase() ||
            exchange.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);

      setSearchResults({
        ...data,
        categories: filteredCategories,
        exchanges: filteredExchanges,
      });
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
    if (query) {
      setShowPopup(true);
    }
  };

  // Get displayed coins based on showAllCoins state
  const getDisplayedCoins = () => {
    return showAllCoins ? trendingData.coins : trendingData.coins.slice(0, 6);
  };

  // Render search result item based on type
  const renderResultItem = (item, type) => {
    const commonClasses =
      "flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer";

    switch (type) {
      case "coins":
        return (
          <Link to={`/en/coins/${item.id}`}>
            <div key={item.id} className={commonClasses}>
              <img
                src={item.thumb}
                alt={item.name}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="flex-grow">
                <div className="text-white">{item.name}</div>
                <div className="text-sm text-gray-400">
                  {item.symbol?.toUpperCase()}
                </div>
              </div>
              {item.market_cap_rank && (
                <div className="text-gray-400">#{item.market_cap_rank}</div>
              )}
            </div>
          </Link>
        );

      case "exchanges":
        return (
          <div key={item.id} className={commonClasses}>
            <img
              src={item.thumb}
              alt={item.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-grow">
              <div className="text-white">{item.name}</div>
              <div className="text-sm text-gray-400">{item.market_type}</div>
            </div>
          </div>
        );

      case "nfts":
        return (
          <div key={item.id} className={commonClasses}>
            <img
              src={item.thumb}
              alt={item.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-grow">
              <div className="text-white">{item.name}</div>
              <div className="text-sm text-gray-400">{item.symbol}</div>
            </div>
          </div>
        );

      case "categories":
        return (
          <div key={item.id} className={commonClasses}>
            <div className="text-white">{item.name}</div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render section if it has results
  const renderSection = (title, items, type) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">{title}</div>
        <div className="space-y-2">
          {items.map((item) => renderResultItem(item, type))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="bg-black py-1 large:hidden 2xlarge:hidden">
        <div className="group mt-1 mx-auto w-[95vw] relative">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            placeholder="Search coins, NFTs, exchanges and more..."
            value={searchQuery}
            onChange={handleSearchInput}
            onClick={() => setShowPopup(true)}
          />

          {showPopup && (
            <div className="absolute top-full left-0 w-full mt-1 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {!searchQuery ? (
                  <div className="flex space-x-2">
                    <button
                      className={`${
                        isTrendingCoins
                          ? "bg-gray-800 text-green-400"
                          : "text-gray-400 hover:bg-gray-800"
                      } px-2 py-1 rounded-full text-sm font-medium`}
                      onClick={() => {
                        setIsTrendingCoins(true);
                        setIsTrendingNFTs(false);
                      }}
                    >
                      🔥 Trending Coins
                    </button>
                    <button
                      className={`${
                        isTrendingNFTs
                          ? "bg-gray-800 text-green-400"
                          : "text-gray-400 hover:bg-gray-800"
                      } px-2 py-1 rounded-full text-sm font-medium`}
                      onClick={() => {
                        setIsTrendingCoins(false);
                        setIsTrendingNFTs(true);
                      }}
                    >
                      🖼 Trending NFTs
                    </button>
                  </div>
                ) : (
                  <div className="text-white">Search Results</div>
                )}
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {searchQuery ? (
                  // Search Results
                  isLoading ? (
                    <div className="text-center text-gray-400 py-4">
                      Searching...
                    </div>
                  ) : Object.keys(searchResults).length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      No results found
                    </div>
                  ) : (
                    <div>
                      {renderSection("Coins", searchResults.coins, "coins")}
                      {renderSection("NFTs", searchResults.nfts, "nfts")}
                      {renderSection(
                        "Exchanges",
                        searchResults.exchanges,
                        "exchanges"
                      )}
                      {renderSection(
                        "Categories",
                        searchResults.categories,
                        "categories"
                      )}
                    </div>
                  )
                ) : (
                  // Trending Content
                  <>
                    {isTrendingLoading ? (
                      <div className="text-center text-gray-400 py-4">
                        Loading trending data...
                      </div>
                    ) : (
                      <>
                        {isTrendingCoins && (
                          <div>
                            <div className="text-sm text-gray-400 mb-3">
                              Trending Coins 🔥
                            </div>
                            <div className="space-y-2">
                              {getDisplayedCoins().map(({ item }) => (
                                <div
                                  key={item.id}
                                  className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                                >
                                  <img
                                    src={item.thumb}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full mr-3"
                                  />
                                  <div>
                                    <div className="text-white">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {item.symbol.toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="ml-auto">
                                    <div className="text-gray-400">
                                      #{item.market_cap_rank}
                                    </div>
                                    {item.data?.price_change_percentage_24h && (
                                      <div
                                        className={`text-sm ${
                                          item.data.price_change_percentage_24h
                                            .usd >= 0
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                      >
                                        {item.data.price_change_percentage_24h
                                          .usd >= 0
                                          ? "+"
                                          : ""}
                                        {item.data.price_change_percentage_24h.usd.toFixed(
                                          2
                                        )}
                                        %
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {/* Show More button */}
                              {trendingData.coins.length > 6 && (
                                <button
                                  onClick={() => setShowAllCoins(!showAllCoins)}
                                  className="w-full mt-4 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors duration-200"
                                >
                                  {showAllCoins ? "Show Less" : "Show More"}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {isTrendingNFTs && (
                          <div>
                            <div className="text-sm text-gray-400 mb-3">
                              Trending NFTs 🖼
                            </div>
                            <div className="space-y-2">
                              {trendingData.nfts.map((nft) => (
                                <div
                                  key={nft.id}
                                  className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                                >
                                  <img
                                    src={nft.thumb}
                                    alt={nft.name}
                                    className="w-8 h-8 rounded-full mr-3"
                                  />
                                  <div>
                                    <div className="text-white">{nft.name}</div>
                                    <div className="text-sm text-gray-400">
                                      {nft.symbol}
                                    </div>
                                  </div>
                                  {nft.floor_price_24h_percentage_change && (
                                    <div
                                      className={`ml-auto text-sm ${
                                        nft.floor_price_24h_percentage_change >=
                                        0
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {nft.floor_price_24h_percentage_change >=
                                      0
                                        ? "+"
                                        : ""}
                                      {nft.floor_price_24h_percentage_change.toFixed(
                                        2
                                      )}
                                      %
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicSearchBar;
