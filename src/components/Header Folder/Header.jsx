import React, { useState, useEffect } from "react";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import HomePageData from "/Sourabh Web dev Projects/Sikka.com/src/HomePage/HomePageData"


const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState("Cryptocurrencies");
  const [isOpen, setIsOpen] = useState(false);

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
        <nav class=" relative z-10 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2  2xlarge:p-[1.7vh]">
            <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                src="src\Images Folder\images-removebg-preview.png"
                class="h-6 2xlarge:h-7"
                alt="Flowbite Logo"
              />
              <span class="self-center text-[5vw] 2xlarge:text-xl 2xla font-semibold whitespace-nowrap dark:text-white">
                CoinSpot
              </span>
            </a>
            <button
              onClick={toggleDropdownmenu}
              data-collapse-toggle="navbar-dropdown"
              type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg medium:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-dropdown"
              aria-expanded={isDropdownOpen}
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } w-full medium:block medium:w-auto`}
              id="navbar-dropdown"
            >
              <ul class=" 2xlarge:ml-[0vw] flex flex-col font-medium p-4 medium:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 medium:space-x-8 rtl:space-x-reverse medium:flex-row medium:mt-0 medium:border-0 medium:bg-white dark:bg-gray-800 medium:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a
                    href="#"
                    onClick={() => handleItemClick("Cryptocurrencies")}
                    className={`block py-2 px-3 rounded medium:p-2 ${
                      activeItem === "Cryptocurrencies"
                        ? "text-white hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                        : "text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                    }`}
                  >
                    Cryptocurrencies
                  </a>
                </li>
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Exchanges{" "}
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="absolute z-999 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
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
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p-2 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    NFT
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p-2 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Learn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 medium:p- dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Products
                  </a>
                </li>
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
            src="src\Videos\221356_large.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>
          <div className=" hiiden 2xlarge:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[45vh] backdrop-filter backdrop-blur-md bg-zinc-500 bg-opacity-15 rounded-lg">
            <div class="card">
              <div class="content">
                <p class="heading relative bottom-[10vh]">
                  Your Crypto Checker
                </p>
                {/* <div class="galaxy"></div> */}
                <div id="search-container" className=" relative top-10 right-5">
                  <div class="nebula"></div>
                  <div class="starfield"></div>
                  <div class="cosmic-dust"></div>
                  <div class="cosmic-dust"></div>
                  <div class="cosmic-dust"></div>

                  <div class="stardust"></div>

                  <div class="cosmic-ring"></div>

                  <div id="main">
                    <input
                      class="input"
                      name="text"
                      type="text"
                      placeholder="Search Your Crypto Coin..."
                    />
                    <div id="input-mask"></div>
                    <div id="cosmic-glow"></div>
                    <div class="wormhole-border"></div>
                    <div id="wormhole-icon">
                      <svg
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
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
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
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
                            <stop stop-color="#a9c7ff" offset="0%"></stop>
                            <stop stop-color="#6e8cff" offset="100%"></stop>
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

        <div class="bg-black py-1">
          <div class="group mt-1 mx-auto w-[95vw] 2xlarge:hidden">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              class="inputbox"
              type="search"
              placeholder="Search Coins,NFTs and more..."
            />
          </div>
        </div>
        <div className=" 2xlarge:hidden  mt- w-[100vw] border-b-[1px] border-gray-300"></div>
      </>
      <div className="  h-screen">
        <MainPageMarquee />
        <HomePageData/>
      </div>
    </>
  );
};

export default Header;
