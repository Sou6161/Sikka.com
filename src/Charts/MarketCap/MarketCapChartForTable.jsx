import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const CoinSparkline = ({ coinData }) => {
  const trend = coinData[coinData.length - 1] > coinData[0] ? "#00FF00" : "#FF0000";

  return (
    <Sparklines data={coinData} width={300} height={90}>
      <SparklinesLine color={trend} />
    </Sparklines>
  );
};

const Example = () => {
  const prices = [
    60935.99484313054,
    60842.721465040064,
    60894.232083015864,
    60958.824053964636,
    60932.02359297336,
    61211.045261694686,
    61376.73740019104,
    60862.17994470777,
    60901.35189172805,
    60755.24024762029,
    60289.44581145123,
    60318.613294064446,
    60300.558880810284,
    60394.12509145167,
    60308.28537322583,
    60517.9067058922,
    60532.15699045179,
    60383.66005871233,
    60519.48661932766,
    60827.69960219288,
    60818.06398338,
    // ... add the rest of your prices here
  ];

  return (
    <div style={{ width: "150px" }}>
      <CoinSparkline coinData={prices} />
    </div>
  );
};

export default Example;