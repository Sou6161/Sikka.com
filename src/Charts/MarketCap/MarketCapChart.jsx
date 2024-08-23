import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data with time and price
const data = [
  { time: '00:00', price: 50000 },
  { time: '02:00', price: 51000 },
  { time: '04:00', price: 52000 },
  { time: '06:00', price: 51500 },
  { time: '08:00', price: 52500 },
  { time: '10:00', price: 53000 },
  { time: '12:00', price: 52800 },
  { time: '14:00', price: 53200 },
  { time: '16:00', price: 53500 },
  { time: '18:00', price: 54000 },
  { time: '20:00', price: 53800 },
  { time: '22:00', price: 54200 },
];

const CryptoAreaChart = () => {
  return (
    <div className="w-full h-[20vh] rounded-lg">
      <ResponsiveContainer width="120%" height="50%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          {/* <XAxis 
            dataKey="time" 
            interval={1} // Show every data point
            tickFormatter={(time) => time} // Format as HH:MM
          /> */}
          {/* <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`} // Format as currency
          /> */}
          {/* <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
            labelFormatter={(label) => `Time: ${label}`}
          /> */}
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#84cc16" 
            fill="#84cc16" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoAreaChart;