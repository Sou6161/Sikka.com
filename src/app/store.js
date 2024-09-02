import { configureStore } from "@reduxjs/toolkit";
import Marqueeslice from "../ReduxSlice/Marqueeslice";
import CGCoinTableGraphSlice from "../ReduxSlice/CGCoinTableGraphSlice";
import LatestAllArticlesSlice from "../ReduxSlice/LatestAllArticlesSlice";
import HomePageMarketCapChart from "../ReduxSlice/HomePageMCapChart";

export default configureStore({
  reducer: {
    Marquee: Marqueeslice,
    Marquee2: Marqueeslice,
    CGCoinGraph: CGCoinTableGraphSlice,
    AllArticles: LatestAllArticlesSlice,
    // HomePageMcapChart: HomePageMarketCapChart,
  },
});
