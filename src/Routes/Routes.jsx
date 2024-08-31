import { Routes, Route } from 'react-router-dom';
import App from '../App.jsx';
import LatestAllArticlesData from '../LatestArticles/LatestAllArticlesData.jsx';

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/learn/see-more-articles" element={<LatestAllArticlesData />} />
    </Routes>
  );
};

export default RoutesConfig;