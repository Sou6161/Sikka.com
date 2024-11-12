import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExchangeVolumeChart = ({ ExchangeID }) => {
  const [ExchangeVolume, setExchangeVolume] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);
  const [timeFrame, setTimeFrame] = useState("24h");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
        );
        const data = await response.json();
        setBtcPrice(data.bitcoin.inr);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };
    fetchBtcPrice();
  }, []);

  useEffect(() => {
    const fetchExchangeVolume = async () => {
      setIsLoading(true);
      try {
        // Convert timeFrame to days for API
        const daysMap = {
          "24h": "1",
          "7d": "7",
          "1m": "30",
          "3m": "90",
          "1y": "365"
        };
        
        const days = daysMap[timeFrame];
        const response = await fetch(
          `https://api.coingecko.com/api/v3/exchanges/binance/volume_chart?days=${days}`
        );
        const ExchangeVoLData = await response.json();
        setExchangeVolume(ExchangeVoLData);
      } catch (error) {
        console.error("Error fetching exchange volume:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExchangeVolume();
  }, [timeFrame]); // Add timeFrame as dependency

  const getChartData = () => {
    if (!ExchangeVolume || !btcPrice) return [];
    return ExchangeVolume.map((item) => ({
      timestamp: item[0],
      volume: parseFloat(item[1]) * btcPrice,
    }));
  };

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    const formatOptions = {
      "24h": { hour: "2-digit", minute: "2-digit" },
      "7d": { month: "short", day: "numeric", hour: "2-digit" },
      "1m": { month: "short", day: "numeric" },
      "3m": { month: "short", day: "numeric" },
      "1y": { month: "short", year: "numeric" },
    };
    return date.toLocaleString([], formatOptions[timeFrame]);
  };

  const formatYAxis = (value) => {
    const formats = [
      { threshold: 1e9, divisor: 1e9, suffix: "B" },
      { threshold: 1e6, divisor: 1e6, suffix: "M" },
      { threshold: 1e3, divisor: 1e3, suffix: "K" },
    ];

    const format = formats.find((f) => value >= f.threshold);
    if (format) {
      return `₹${(value / format.divisor).toFixed(0)}${format.suffix}`;
    }
    return `₹${value.toFixed(1)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm text-gray-600">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-sm font-semibold">
            ₹
            {payload[0].value.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  const TimeFrameButton = ({ value, label }) => (
    <button
      className={`button TimeGraph px-3 py-2 rounded transition-colors
                ${
                  timeFrame === value
                    ? "bg-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }
                xsmall:text-sm small:text-base`}
      onClick={() => setTimeFrame(value)}
      disabled={isLoading}
    >
      {label}
    </button>
  );

  const chartData = getChartData();
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 0];
    const volumes = chartData.map((item) => item.volume);
    const minVolume = Math.min(...volumes);
    const maxVolume = Math.max(...volumes);
    const padding = (maxVolume - minVolume) * 0.1;
    return [minVolume - padding, maxVolume + padding];
  };

  return (
    <div className="text-white p-4">
      <h1
        className="text-2xl xsmall:text-3xl small:text-4xl medium:text-5xl large:text-6xl xlarge:text-7xl 
                          mb-6 medium:mb-8 large:mb-10"
      >
        Exchange Trade Volume
      </h1>

      <div className="flex flex-wrap gap-2 xsmall:gap-3 small:gap-4 mb-6">
        <TimeFrameButton value="24h" label="24h" />
        <TimeFrameButton value="7d" label="7d" />
        <TimeFrameButton value="1m" label="1m" />
        <TimeFrameButton value="3m" label="3m" />
        <TimeFrameButton value="1y" label="1y" />
      </div>

      {isLoading ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        chartData.length > 0 && (
          <div
            className="w-[90vw] h-[300px] xsmall:h-[350px] small:h-[400px] medium:h-[450px] 
                              large:h-[500px] xlarge:h-[600px] 
                              bg-white/5 -ml-3 backdrop-blur-sm rounded-lg p-4"
          >
            <ResponsiveContainer width="110%" className="-ml-8" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="rgba(229, 231, 235, 0.2)"
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  tick={{
                    fontSize: "0.75rem",
                    fill: "white",
                  }}
                  axisLine={{ stroke: "rgba(229, 231, 235, 0.2)" }}
                  tickLine={{ stroke: "rgba(229, 231, 235, 0.2)" }}
                />
                <YAxis
                  dataKey="volume"
                  domain={getYAxisDomain()}
                  tickFormatter={formatYAxis}
                  axisLine={{ stroke: "rgba(229, 231, 235, 0.2)" }}
                  tickLine={{ stroke: "rgba(229, 231, 235, 0.2)" }}
                  tick={{
                    fontSize: "0.75rem",
                    fill: "white",
                  }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  fill="url(#gradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      )}
    </div>
  );
};

export default ExchangeVolumeChart;   