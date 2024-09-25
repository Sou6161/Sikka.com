import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import LatestAllArticlesData from "../LatestArticles/LatestAllArticlesData.jsx";
import CoinFullDetails from "../components/CoinDetails/CoinFullDetails.jsx";
import CryptoCategoriesByMC from "../components/CategoriesList/CryptoCategoriesByMC.jsx";
import CryptoHighlightsData from "../components/CryptoHighlights/CryptoHighlightsData.jsx";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/learn/see-more-articles"
        element={<LatestAllArticlesData />}
      />
      <Route path="/en/coins/:id" element={<CoinFullDetails />} />
      <Route path="/en/categories" element={<CryptoCategoriesByMC />} />
      <Route path="/en/highlights" element={<CryptoHighlightsData/>}/>
    </Routes>
  );
};

export default RoutesConfig;
