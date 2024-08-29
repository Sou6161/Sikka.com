import { configureStore } from "@reduxjs/toolkit";
import Marqueeslice from "../ReduxSlice/Marqueeslice";
import CGCoinTableGraphSlice from "../ReduxSlice/CGCoinTableGraphSlice";

export default configureStore({
  reducer: {
    Marquee: Marqueeslice,
    Marquee2:Marqueeslice,
    CGCoinGraph: CGCoinTableGraphSlice,
    
  },
});
