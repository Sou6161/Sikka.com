import { createSlice } from "@reduxjs/toolkit";

export const HomePageMarketCapChart = createSlice({
  name: "HomePageMcapChart",
  initialState: {
    HomePageMarketCapChart: null,
  },
  reducers: {
    addHomePageMarketCapChart: (state, action) => {
      if (state.HomePageMarketCapChart === null) {
        state.HomePageMarketCapChart = action.payload;
      } else {
        state.HomePageMarketCapChart = [
          ...state.HomePageMarketCapChart,
          action.payload,
        ];
      }
    },
  },
});

export const { addHomePageMarketCapChart } = HomePageMarketCapChart.actions;

export default HomePageMarketCapChart.reducer;
