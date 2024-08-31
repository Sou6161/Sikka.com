import { createSlice } from "@reduxjs/toolkit";

export const LatestAllArticlesSlice = createSlice({
  name: "AllArticles" ,
  initialState: {
    ArticlesData: null,
  },
  reducers: {
    addArticlesData: (state, action) => {
      if (state.ArticlesData === null) {
        state.ArticlesData = action.payload;
      } else {
        state.ArticlesData = [...state.ArticlesData, action.payload];
      }
    },
  },
});

export const { addArticlesData } = LatestAllArticlesSlice.actions;

export default LatestAllArticlesSlice.reducer;
