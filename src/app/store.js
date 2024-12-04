import { configureStore } from "@reduxjs/toolkit";
import Marqueeslice from "../ReduxSlice/Marqueeslice";
import CGCoinTableGraphSlice from "../ReduxSlice/CGCoinTableGraphSlice";
import LatestAllArticlesSlice from "../ReduxSlice/LatestAllArticlesSlice";
import HomePageMarketCapChart from "../ReduxSlice/HomePageMCapChart";
import WatchlistCoinsSlice from "../ReduxSlice/WatchlistCoinsSlice";
import { authMiddleware, persistenceMiddleware } from "../ReduxSlice/persistenceMiddleware";
import WatchlistNftsSlice from "../ReduxSlice/WatchlistNftsSlice";
import { persistenceNftsMiddleware } from "../ReduxSlice/persistenceNftsMiddleware";


const store = configureStore({
  reducer: {
    Marquee: Marqueeslice,
    Marquee2: Marqueeslice,
    CGCoinGraph: CGCoinTableGraphSlice,
    AllArticles: LatestAllArticlesSlice,
    // HomePageMcapChart: HomePageMarketCapChart,
    watchlist: WatchlistCoinsSlice,
    watchlistNfts: WatchlistNftsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(persistenceMiddleware("watchlistState"))
      .concat(authMiddleware),
});

export default store;
