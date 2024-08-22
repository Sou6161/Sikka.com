import { configureStore } from "@reduxjs/toolkit";
import Marqueeslice from "../ReduxSlice/Marqueeslice";

export default configureStore({
  reducer: {
    Marquee: Marqueeslice,
    Marquee2:Marqueeslice,
  },
});
