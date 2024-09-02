// import React from "react";
// import { useSelector } from "react-redux";
// import { AreaChart, Area, ResponsiveContainer } from "recharts";

// const CryptoAreaChart = () => {
//   const FinalHomePageMarketCapChart = useSelector(
//     (state) => state?.HomePageMcapChart?.HomePageMarketCapChart
//   );

//   FinalHomePageMarketCapChart &&
//     console.log(
//       FinalHomePageMarketCapChart?.total_market_cap_change_percentage_24h
//     );

//   return (
//     <div className="w-full h-[20vh] rounded-lg">
//       <ResponsiveContainer width="100%" height="50%">
//         <AreaChart>
//           <Area
//             type="monotone"
//             dataKey="price"
//             stroke="#84cc16"
//             fill="#84cc16"
//             fillOpacity={0.3}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CryptoAreaChart;
