import React from "react";
import AnimatedGridBackground from "../components/AllBackgrounds/AnimatedGridPatternBg";
import { useSelector } from "react-redux";
import { FaCaretUp } from "react-icons/fa";

const MainContainer = () => {
  const MarqueeData = useSelector((state) => state.Marquee.MarqueeData);
  const MarqueeData2 = useSelector((state) => state.Marquee2.MarqueeData2);

  {
    MarqueeData2 && console.log(MarqueeData2);
  }
  return (
    <div className="relative">
      <h1 className="absolute top-10 left-5 z-10 text-[#fbbf24] text-[5vw] 2xlarge:text-[2vw] 2xlarge:left-[5vw] font-semibold  ">
        Cryptocurrency Prices by Market Cap
        <p className=" text-sky-400 text-[3.5vw] 2xlarge:text-[1vw] mt-2">
          The global cryptocurrency market cap today is{" "}
          <span>
            {MarqueeData2?.cap ? (
              <span className=" text-white">
                {(MarqueeData2.cap / 1e12).toFixed(3)} Trillions, a{" "}
                <span className="text-[#4BCC00] text-[3.5vw] relative top-1 2xlarge:text-[1vw] inline-flex items-center">
                  <FaCaretUp className="text-[4vw] 2xlarge:text-[1vw]" />{" "}
                  {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                    1
                  )}
                  %
                </span>
              </span>
            ) : (
              ""
            )}
          </span>{" "}
          change in the last 24 hours.{" "}
          <span className="text-purple-500 hover:text-orange-400 text-[3.5vw] 2xlarge:text-[1vw] hover:cursor-pointer hover:underline">
            Read more
          </span>
        </p>
      </h1>
      <div className=" dingdong absolute top-[20vh] left-5 2xlarge:left-[5vw] w-[90vw] h-[15vh] 2xlarge:w-[30vw] bg-zinc-100 border-[2px]  border-teal-600 shadow-teal-glow rounded-lg">
        <h1 className="relative top-4 left-5  text-[5vw] font-semibold text-blue-600 ">
          ${MarqueeData2?.cap?.toLocaleString("en-US")}
        </h1>
        <h1 className=" relative top-5 left-5 flex font-semibold  ">
          Market Cap{" "}
          <FaCaretUp className=" text-[4.5vw] text-[#4BCC00]  relative top-1  2xlarge:text-[1vw]" />{" "}
          <span className=" text-[#4BCC00] font-semibold">
            {MarqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(
              1
            )}{" "}
            %
          </span>
        </h1>
        <div className="">
          <h1>jojjp</h1>
        </div>
      </div>
      <AnimatedGridBackground />
    </div>
  );
};

export default MainContainer;
