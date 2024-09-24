import React, { useState, useRef, useEffect } from "react";
import logo from "/src/Images Folder/HeaderLogo.png?asset";
import { ChevronDown, Search } from "lucide-react";
import { PiRankingFill } from "react-icons/pi";
import { BiSolidCategory } from "react-icons/bi";
import { FaRectangleList } from "react-icons/fa6";
import { PiSparkleFill } from "react-icons/pi";
import { GiTrophy } from "react-icons/gi";
import { BsBank } from "react-icons/bs";
import { IoCubeSharp } from "react-icons/io5";
import { RiNftLine } from "react-icons/ri";
import { FaCoins } from "react-icons/fa";
import { TiStarburst } from "react-icons/ti";
import { FaBookOpen } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";
import { BiSolidUserAccount } from "react-icons/bi";
import { IoBagSharp } from "react-icons/io5";

const OnlyHeaderComp = () => {
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
  const [isNFTDropdownOpen, setIsNFTDropdownOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);
  const [isMyPortfolio, setisMyPortfolio] = useState(false);
  const [isMyAccountOpen, setisMyAccountOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const DropdownItem = ({ icon, label, isOpen, toggleOpen, subItems }) => (
    <div className="relative mt-1 ">
      <button
        onClick={toggleOpen}
        className="flex items-center w-full NavLinkBUtton   px-4 py-2 text-sm text-gray-700 hover:bg-gray-10 focus:outline-none"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        <ChevronDown className="w-4 h-4 ml-auto" />
      </button>
      {isOpen && (
        <div className="absolute NavLinkBUtton   left-full top-0 w-48 bg-whit rounded-md shadow-lg">
          {subItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const toggleMoreDropdown = () => setIsMoreDropdownOpen(!isMoreDropdownOpen);

  const toggleMyAccountDropdown = () => {
    setisMyAccountOpen(!isMyAccountOpen);
  };

  const toggleMyPortfolioDropdown = () => {
    setisMyPortfolio(!isMyPortfolio);
  };

  const toggleNFTDropdown = () => {
    setIsNFTDropdownOpen(!isNFTDropdownOpen);
  };

  const toggleLearnDropdown = () => {
    setIsLearnDropdownOpen(!isLearnDropdownOpen);
  };

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
      <nav className="relative z-10 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl   flex flex-wrap items-center justify-between mx-auto p-2 2xlarge:p-[1.7vh]">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={logo}
              className="h-8 relative top-1 2xlarge:h-10"
              alt="Logo"
            />
            <span className="self-center text-[5vw] xsmall:text-[4vw] small:text-[3vw] medium:text-[2vw] large:text-xl font-semibold whitespace-nowrap dark:text-white"></span>
          </a>

          <input
            className="hidden"
            id="burger-checkbox"
            type="checkbox"
            onChange={toggleDropdownmenu}
          />
          <label
            className=" xsmall:mr-10 burger medium:hidden large:hidden xlarge:hidden 2xlarge:hidden"
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
            <ul className="2xlarge:ml-[0vw] h-[56vh] medium:h-[6vh]  large:h-[7vh] 2xlarge:h-[6vh] relative flex flex-col font-medium p-4 medium:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 medium:space-x-2 rtl:space-x-reverse medium:flex-row medium:mt-0 medium:border-0 medium:bg-white dark:bg-gray-800 medium:dark:bg-gray-900 dark:border-gray-700">
              <div className="relative z-99999 inline-block  text-left">
                <button
                  onClick={toggleCryptocurrenciesDropdown}
                  className="NavLinkBUtton medium:mt-2 2xlarge:-mt-  flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
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
                  <div className="absolute z-20 right-0 w-[86vw] medium:w-[35vw] mt-2  2xlarge:w-[14vw] 2xlarge:-left-[vw]  bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                      <li className=" ">
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] medium:text-[2.5vw] inline-flex gap-2   block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <PiRankingFill className=" text-[6vw] medium:text-[3vw] 2xlarge:text-[1vw] text-white" />
                          <span className=" text-green-400 2xlarge:text-[1vw]">By Market Cap</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw]  2xlarge:w-[14vw] text-[4vw] medium:text-[2.5vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <BiSolidCategory className=" text-[6vw] text-white medium:text-[3vw] 2xlarge:text-[1vw]" />
                          <span className=" text-green-400 2xlarge:text-[1vw]">Categories</span>
                        </a>
                      </li>
                      <li className=" ml-5 mt-2 mb-3 inline-flex">
                        Popular
                        <div className=" w-[65vw] medium:w-[40vw] 2xlarge:w-[9vw] border-b-[1px] border-gray-500 relative -top-2 left-1"></div>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] medium:text-[2  vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 inline-flex gap-2 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            <FaRectangleList className=" text-white text-[6vw] medium:text-[3vw] 2xlarge:text-[1vw] " />
                            Highlights
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] medium:text-[2.5vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 truncate inline-flex gap-2 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            <PiSparkleFill className=" text-white text-[6vw] medium:text-[3vw] 2xlarge:text-[1vw]" />
                            <span className=" truncate 2xlarge:text-[1vw]">
                              New Cryptocurrencies
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 inline-flex gap-2 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            <GiTrophy className="  text-white text-[6vw] medium:text-[3vw] 2xlarge:text-[1vw]" />
                            Gainers & Losers
                          </span>
                        </a>
                      </li>
                      <li className=" ml-5 mt-2 mb-3 inline-flex 2xlarge:text-[1vw]">
                        Tools
                        <div className=" w-[70vw] 2xlarge:w-[9vw]  border-b-[1px] border-gray-500 relative -top-2 left-1"></div>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] 2xlarge:w-[9vw] text-[4vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 inline-flex ml-1 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            All Coins
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 inline-flex ml-1 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            Comapare Coins
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" w-[86vw] 2xlarge:w-[14vw] text-[4vw] inline-flex gap-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" text-green-400 inline-flex ml-1 text-[4vw] medium:text-[2.5vw] 2xlarge:text-[1vw]">
                            Converter
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative z-99998 inline-block top-2 2xlarge:top-0 text-left">
                <button
                  onClick={toggleExchangesDropdown}
                  className=" NavLinkBUtton 2xlarge:mt-2  flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
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
                  <div className="absolute z-9999 right-0 w-[86vw] medium:w-[35vw] 2xlarge:w-[8vw] mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className=" inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] medium:text-[3vw]  text-green-400">
                            <BsBank className=" text-[6vw] 2xlarge:text-[1vw] text-white" />
                            Crypto Exchanges
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                            <IoCubeSharp className=" text-[6vw] 2xlarge:text-[1vw] text-white" />
                            Derivatives
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className=" hidden medium:block large:block xlarge:hidden ">
                <button
                  onClick={toggleMoreDropdown}
                  className="flex items-center mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  More
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {isMoreDropdownOpen && (
                  <div className="absolute right-[9vw] xlarge:right-[20vw]  mt-2 w-56 bg-whit rounded-md shadow-lg z-20">
                    <div className="py-1 2xlarge:relative  2xlarge:top-10">
                      <DropdownItem
                        icon={<RiNftLine className="w-5 h-5" />}
                        label="NFT"
                        isOpen={isNFTDropdownOpen}
                        toggleOpen={toggleNFTDropdown}
                        subItems={[
                          { icon: <RiNftLine />, label: "NFT Floor Price" },
                          { icon: <FaCoins />, label: "NFT Related Coins" },
                          { icon: <TiStarburst />, label: "NFT Watchlist" },
                        ]}
                      />
                      <DropdownItem
                        icon={<FaBookOpen className="w-5 h-5" />}
                        label="Learn"
                        isOpen={isLearnDropdownOpen}
                        toggleOpen={toggleLearnDropdown}
                        subItems={[
                          { icon: <FaBookOpen />, label: "Research Insights" },
                          { icon: <ImNewspaper />, label: "Crypto News" },
                        ]}
                      />
                      <DropdownItem
                        icon={<IoBagSharp className="w-5 h-5" />}
                        label="My Portfolio"
                        isOpen={isMyPortfolio}
                        toggleOpen={toggleMyPortfolioDropdown}
                        subItems={[{ label: "My Coins" }, { label: "My NFTs" }]}
                      />
                      <DropdownItem
                        icon={<BiSolidUserAccount className="w-5 h-5" />}
                        label="My Account"
                        isOpen={isMyAccountOpen}
                        toggleOpen={toggleMyAccountDropdown}
                        subItems={[{ label: "Sign Up" }]}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* For Screens lower than medium */}

              <>
                <div className="relative block medium:hidden xlarge:block 2xlarge:block   inline-block text-left top-4 2xlarge:top-0 ">
                  <a
                    onClick={() => toggleNFTDropdown()}
                    className="NavLinkBUtton medium:-mt-2 2xlarge:mt-2 flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-white hover:text-white hover:bg-opacity-20 medium:hover:bg-transparent medium:border-0 dark:text-white medium:dark:hover:text-white dark:hover:bg-opacity-20 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    NFT
                    <svg
                      className="w-2.5 h-2.5 ms-2.5 text-white"
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
                  </a>
                  {isNFTDropdownOpen && (
                    <div className="absolute z-99999 right-0 w-[86vw] 2xlarge:w-[10vw] mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul>
                        <li>
                          <a
                            href="#"
                            className="block py-4 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              <RiNftLine className=" text-[6vw] 2xlarge:text-[1vw] text-white" />
                              NFT Floor Price
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              <FaCoins className="text-[6vw] 2xlarge:text-[1vw] text-white" />
                              NFT Related Coins
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              <TiStarburst className="text-[6vw] 2xlarge:text-[1vw] text-white" />
                              NFT Watchlist
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative block medium:hidden xlarge:block inline-block text-left top-6 2xlarge:top-0">
                  <a
                    href="#"
                    onClick={() => toggleLearnDropdown()}
                    className="NavLinkBUtton medium:-mt-4 2xlarge:mt-2 flex items-center justify-between w-full py-2 px-3 rounded medium:w-auto text-white hover:text-white hover:bg-opacity-20 medium:hover:bg-transparent medium:border-0 medium:hover:text-white dark:text-white medium:dark:hover:text-white dark:hover:bg-opacity-20 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    Learn
                    <svg
                      className="w-2.5 h-2.5 ms-2.5 text-white"
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
                  </a>
                  {isLearnDropdownOpen && (
                    <div className="absolute z-99999 right-0 w-[86vw] 2xlarge:w-[11vw] 2xlarge:-left-[2vw] mt-2  bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              <FaBookOpen className="text-[6vw] 2xlarge:text-[1vw] text-white" />
                              Research Insights
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              <ImNewspaper className=" text-[6vw] 2xlarge:text-[1vw] text-white" />
                              Crypto News
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative block medium:hidden xlarge:block z-99998 inline-block top-8 2xlarge:top-0 text-left">
                  <button
                    onClick={toggleMyPortfolioDropdown}
                    className=" NavLinkBUtton medium:-mt-7 2xlarge:mt-2  2xlarge:py-2 flex items-center justify-between w-full medium:py-[1.5vh]  py-2 px-3 rounded medium:w-[21vw] xlarge:w-[13vw] 2xlarge:w-[10vw]  text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    My Portfolio
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
                  {isMyPortfolio && (
                    <div className="absolute z-30 right-0 w-[86vw] 2xlarge:w-[9vw] mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <span className=" inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              My Coins
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <span className="inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              My NFTs
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative block medium:hidden xlarge:block z-20 inline-block top-10 2xlarge:top-0 text-left">
                  <button
                    onClick={toggleMyAccountDropdown}
                    className=" NavLinkBUtton medium:-mt-9 2xlarge:mt-2 2xlarge:px-2  2xlarge:py-2 flex items-center justify-between w-full py-3 px-3 rounded medium:w-[22vw] xlarge:w-[14vw] 2xlarge:w-[10vw] text-gray-900 hover:bg-gray-100 medium:hover:bg-transparent medium:border-0 medium:hover:text-blue-700 dark:text-white medium:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white medium:dark:hover:bg-transparent"
                  >
                    <span className=" inline-flex relative gap-2 2xlarge:py-0 2xlarge:px-0 2xlarge:text-[1vw]  text-green-400">
                      <BiSolidUserAccount className="text-[7.5vw] xlarge:text-[1.5vw]  2xlarge:text-[1vw] 2xlarge:mt-2 text-white" />
                      My Account
                    </span>
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
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
                  {isMyAccountOpen && (
                    <div className="absolute z-9999 2xlarge:w-[10vw] right-0 w-[86vw] mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <span className=" inline-flex relative gap-2 text-[4vw] 2xlarge:text-[1vw] text-green-400">
                              Sign Up
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>

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
                  <div className="absolute right-0 -mt-[5vh] w-[20vw] xlarge:w-[25vw] large:-mt-[5vh] large:-right-[5vw] xlarge:-right-[14vw] xlarge:top-[14vh]  bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <input
                      type="text"
                      placeholder=" Search Coins,Nfts ..."
                      className="w-[20vw] xlarge:w-[25vw] p-2 pl-10 xlarge:py-3 text-sm text-gray-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                    />
                    <span className="absolute left-0 top-2 xlarge:top-3  text-gray-600 dark:text-white">
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

      <div className="hidden 2xlarge:block w-full  2xlarge:max-w-[100vw] mx-auto 2xlarge:w-full relative overflow-hidden z-0">
        <video
          className="w-full h-auto 2xlarge:h-[60vh] mx-auto object-cover"
          autoPlay
          playsInline
          muted
          loop
          src="https://cdn.pixabay.com/video/2023/10/14/184941-874460311_large.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="hidden 2xlarge:block absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[45vh] backdrop-filter backdrop-blur-md bg-zinc-500 bg-opacity-15 rounded-lg">
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

      <div className=" mt-0 w-[99.4vw] border-b-[3px] border-red-600"></div>
    </>
  );
};

export default OnlyHeaderComp;
