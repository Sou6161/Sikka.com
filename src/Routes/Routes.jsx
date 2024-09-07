import { Routes, Route } from 'react-router-dom';
import App from '../App.jsx';
import LatestAllArticlesData from '../LatestArticles/LatestAllArticlesData.jsx';
import CoinFullDetails from '../components/CoinDetails/CoinFullDetails.jsx';

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/learn/see-more-articles" element={<LatestAllArticlesData />} />
      <Route path="/en/coins/:id" element={<CoinFullDetails/>}/>
    </Routes>
  );
};

export default RoutesConfig;