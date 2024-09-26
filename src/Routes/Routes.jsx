import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import LatestAllArticlesData from "../LatestArticles/LatestAllArticlesData.jsx";
import CoinFullDetails from "../components/CoinDetails/CoinFullDetails.jsx";
import CryptoCategoriesByMC from "../components/CategoriesList/CryptoCategoriesByMC.jsx";
import CryptoHighlightsData from "../components/CryptoHighlights/CryptoHighlightsData.jsx";
import AllCoins from "../components/CryptoTools/AllCoins.jsx";
import CompareCoins from "../components/CryptoTools/CompareCoins.jsx";
import CoinConverter from "../components/CryptoTools/CoinConverter.jsx";
import NewCryptocurrenciesPage from "../components/NewCryptos/NewCryptocurrenciesPage.jsx";
import TopGainersLosers from "../components/Gainers&Losers/TopGainers&Losers.jsx";

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
      <Route path="/en/all-cryptocurrencies" element={<AllCoins/>}/>
      <Route path="/en/compare-cryptocurrencies" element={<CompareCoins/>}/>
      <Route path="/en/coin-converter" element={<CoinConverter/>}/>
      <Route path="/en/new-cryptocurrencies" element={<NewCryptocurrenciesPage/>}/>
      <Route path="/en/crypto-Top-gainers-losers" element={<TopGainersLosers/>}/>

    </Routes>
  );
};

export default RoutesConfig;
