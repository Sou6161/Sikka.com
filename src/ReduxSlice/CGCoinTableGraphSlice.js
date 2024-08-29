import { createSlice } from "@reduxjs/toolkit";

export const CGCoinTableGraphSlice = createSlice({
  name: "CGCoinGraph",
  initialState: {
    CGCoinGraphData: null,
    CGCoinId: null,
    CGCoinSymbol: null,
  },
  reducers: {
    addCGCoinGraphData: (state, action) => {
      if (state.CGCoinGraphData === null) {
        state.CGCoinGraphData = action.payload;
      } else {
        state.CGCoinGraphData = [...state.CGCoinGraphData, action.payload];
      }
    },
    addCGCoinId: (state, action) => {
      if (state.CGCoinId === null) {
        state.CGCoinId = action.payload;
      } else {
        state.CGCoinId = [...state.CGCoinId, action.payload];
      }
    },
    addCGCoinSymbol: (state, action) => {
      if (state.CGCoinSymbol === null) {
        state.CGCoinSymbol = action.payload;
      } else {
        state.CGCoinSymbol = [...state.CGCoinSymbol, action.payload];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCGCoinGraphData,addCGCoinId,addCGCoinSymbol } = CGCoinTableGraphSlice.actions;

export default CGCoinTableGraphSlice.reducer;
