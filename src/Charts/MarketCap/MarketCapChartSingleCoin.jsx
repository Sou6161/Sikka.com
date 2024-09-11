// import React, { useEffect, useState } from "react";
// import { Sparklines, SparklinesLine } from "react-sparklines";
// import { CoinGeckoApi } from "../../api/CoinGeckoApi/CoinGeckoApi";

// const CoinSparkline = ({ coinData }) => {
//   const trend =
//     coinData[coinData.length - 1] > coinData[0] ? "#00FF00" : "#FF0000";
//   const [blink, setBlink] = useState(false);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setBlink((prevBlink) => !prevBlink);
//     }, 1000); // blink every 500ms
//     return () => clearInterval(intervalId);
//   }, []);

//   const getBlinkColor = () => {
//     if (trend === "#00FF00") {
//       return blink ? "#2E865F" : "#64f86e"; // blink between dark green and light green
//     } else {
//       return blink ? "#fc6060" : "#ff001e"; // blink between light red and dark red
//     }
//   };

//   useEffect(() => {
//     const FetchCoinChart = async () => {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1&precision=2`,
//         CoinGeckoApi
//       );
//       const chartdata = await response.json();
//       // console.log(chartdata);
//       setCoinChartDetails(chartdata);
//     };
//     FetchCoinChart()
//   }, []);

//   useEffect(() => {
//     CoinChartDetails && console.log(CoinChartDetails);
//   }, [CoinChartDetails]);

//   return (
//     <Sparklines data={coinData} width={300} height={70}>
//       <SparklinesLine
//         color={getBlinkColor()} // blink between different shades
//         style={{ strokeWidth: 2 }}
//       />
//     </Sparklines>
//   );
// };
// const MarketCapChartSingleCoin = () => {
//   const [CoinChartDetails, setCoinChartDetails] = useState(null);

//   return <div>MarketCapChartSingleCoin</div>;
// };

// export default MarketCapChartSingleCoin;
