import React, { useState, useRef, useEffect } from "react";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import HomePageData from "/Sourabh Web dev Projects/Sikka.com/src/HomePage/HomePageData";
import logo from "/Sourabh Web dev Projects/Sikka.com/src/Images Folder/HeaderLogo.png";
import { Search } from "lucide-react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState("Cryptocurrencies");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isExchangesOpen, setIsExchangesOpen] = useState(false);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);
  const toggleExchangesDropdown = () => setIsExchangesOpen(!isExchangesOpen);
  const searchRef = useRef(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isCryptocurrenciesOpen, setIsCryptocurrenciesOpen] = useState(false);

  const toggleCryptocurrenciesDropdown = () => {
    setIsCryptocurrenciesOpen(!isCryptocurrenciesOpen);
  };

  const toggleSignUp = () => {
    setIsSignedUp(!isSignedUp);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownmenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === "Exchanges") {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <>
        <nav className="relative z-10 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 2xlarge:p-[1.7vh]">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src={logo}
                className="h-8 relative top-1 2xlarge:h-10"
                alt="Logo"
              />
              <span className="self-center text-[5vw] 2xlarge:text-xl font-semibold whitespace-nowrap dark:text-white"></span>
            </a>

            <input
              className="hidden"
              id="burger-checkbox"
              type="checkbox"
              onChange={toggleDropdownmenu}
            />
            <label
              className="burger medium:hidden large:hidden xlarge:hidden 2xlarge:hidden"
              htmlFor="burger-checkbox"
            >
              <span></span>
              <span></span>
              <span></span>
            </label>

            <div
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } w-full medium:block large:block medium:max-w-[62vw] medium:relative medium:mr-[19vw] large:mr-[22vw] `}
              id="navbar-dropdown"
            >
              <ul className="2xlarge:ml-[0vw] relative flex flex-col font-medium p-4 medium:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 medium:space-x-2 rtl:space-x-reverse medium:flex-row medium:mt-0 medium:border-0 medium:bg-white dark:bg-gray-800 medium:dark:bg-gray-900 dark:border-gray-700">
                <div className="relative z-99999 inline-block  text-left">
                  <button
                    onClick={toggleCryptocurrenciesDropdown}
                    className="NavLinkBUtton medium:mt-2 flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Cryptocurrencies
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isCryptocurrenciesOpen && (
                    <div className="absolute z-20 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            By Market Cap
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Categories
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Chains
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative z-99998 inline-block top-2 text-left">
                  <button
                    onClick={toggleExchangesDropdown}
                    className=" NavLinkBUtton medium:mt-2 flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Exchanges
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isExchangesOpen && (
                    <div className="absolute z-9999 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Earnings
                          </a>
                        </li>
                      </ul>
                      <div className="py-1">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {["NFT", "Learn", "Products"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block py-2 px-3 medium:mt-2 text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p-2 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li
                  className="hidden large:block absolute top-0 left-[50vw] medium:left-[45vw] large:left-[57vw] xlarge:left-[52vw] 2xlarge:left-[55vw]"
                  ref={searchRef}
                >
                  <button
                    onClick={toggleSearch}
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p-2 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    <Search
                      size={30}
                      className=" text-red-600 relative large:left-[9vw] large:top-1 xlarge:left-[17vw]  "
                    />
                  </button>
                  {isSearchExpanded && (
                    <div className="absolute right-0 -mt-[5vh] w-[20vw] xlarge:w-[25vw] large:-mt-[5vh] large:-right-[5vw] xlarge:-right-[14vw]  bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <input
                        type="text"
                        placeholder=" Search Coins,Nfts ..."
                        className="w-[20vw] xlarge:w-[25vw] p-2 pl-10 text-sm text-gray-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                      />
                      <span className="absolute left-0 top-2 text-gray-600 dark:text-white">
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
                  )}
                </li>
                <button
                  className="SignButton hidden medium:block large:block absolute medium:top-1 top-0 right-0 medium:-right-[18vw] large:-right-[22vw] xlarge:-right-[22vw] 2xlarge:-right-[22vw]
                "
                  onClick={toggleSignUp}
                >
                  {isSignedUp ? (
                    <div className="  flex items-center medium:py-1 medium:w-[8vw] large:w-[6vw] 2xlarge:w-[4vw] large:py-1 ">
                      <img
                        src="https://t3.ftcdn.net/jpg/04/65/28/08/360_F_465280897_8nL6xlvBwUcLYIQBmyX0GO9fQjDwNYtV.jpg"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 ms-2"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M15 13l-3-3-3 3"
                        />
                      </svg>
                    </div>
                  ) : (
                    <h1 className=" hidden medium:block min-w-[9vw] medium:py-2  xlarge:min-w-[7vw] 2xlarge:min-w-[5vw]">
                      Sign Up
                    </h1>
                  )}
                </button>
                {isSignedUp && (
                  <div className=" z-99999 absolute top-0 hidden medium:block medium:top-2 large:top-2 right-[42vw] medium:-right-[15vw] large:-right-[18vw] xlarge:-right-[20vw] 2xlarge:-right-[20vw] mt-12 w-[20vw] large:w-[19vw] xlarge:w-[20vw] medium:w-[25vw]bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center p-4">
                      <img
                        src="https://t3.ftcdn.net/jpg/04/65/28/08/360_F_465280897_8nL6xlvBwUcLYIQBmyX0GO9fQjDwNYtV.jpg"
                        alt="Profile"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-lg ml-2 text-gray-900 dark:text-white">
                        Username
                      </span>
                    </div>
                    <div className=" border-b  border-purple-500 dark:border-purple-500"></div>
                    <ul>
                      <li className="border-b border-purple-500 dark:border-purple-500">
                        <a
                          href="#"
                          className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <img
                            src="https://img.freepik.com/premium-vector/crypto-portfolio-icon-icon_1076610-1132.jpg"
                            alt="Portfolio"
                            className="w-6 h-6 rounded-lg"
                          />
                          <span className="text-lg ml-2 text-gray-900 dark:text-white">
                            Portfolio
                          </span>
                        </a>
                      </li>
                      <li className="border-b border-purple-500 dark:border-purple-500">
                        <a
                          href="#"
                          className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <img
                            src="https://w7.pngwing.com/pngs/637/32/png-transparent-nft-nft-coin-nft-sign-non-fungible-token-nonfungible-token-crypto-token-3d-icon-thumbnail.png"
                            alt="NFTs"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-lg ml-2 text-gray-900 dark:text-white">
                            My NFTs
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                        >
                          <img
                            src="https://w7.pngwing.com/pngs/669/141/png-transparent-white-and-green-signage-grass-brand-sign-apps-dialog-logout-logo-grass-sign-thumbnail.png"
                            alt="Logout"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-lg ml-2 text-gray-900 dark:text-white">
                            Logout
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <div className="hidden 2xlarge:block w-full max-w-[100vw] 2xlarge:max-w-[100vw] mx-auto 2xlarge:w-full relative overflow-hidden z-0">
          <video
            className="w-full h-auto 2xlarge:h-[60vh] mx-auto object-cover"
            autoPlay
            playsInline
            muted
            loop
            src="src/Videos/221356_large.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>
          <div className="hidden 2xlarge:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[45vh] backdrop-filter backdrop-blur-md bg-zinc-500 bg-opacity-15 rounded-lg">
            <div className="card">
              <div className="content">
                <p className="heading relative bottom-[10vh]">
                  Your Crypto Checker
                </p>
                <div id="search-container" className="relative top-10 right-5">
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
                    />
                    <div id="input-mask"></div>
                    <div id="cosmic-glow"></div>
                    <div className="wormhole-border"></div>
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
                    </div>
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
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black py-1 large:hidden">
          <div className="group mt-1 mx-auto w-[95vw] 2xlarge:hidden">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              className="inputbox"
              type="search"
              placeholder="Search Coins,NFTs and more..."
            />
          </div>
        </div>

        <div className="2xlarge:hidden mt-0 w-[100vw] border-b-[3px] border-red-600"></div>
      </>
      <MainPageMarquee />
      <div className=" ">
        <HomePageData />
      </div>
    </>
  );
};

export default Header;
