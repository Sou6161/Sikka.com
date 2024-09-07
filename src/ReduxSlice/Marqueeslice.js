import { createSlice } from "@reduxjs/toolkit";

export const Marqueeslice = createSlice({
  name: "Marquee",
  initialState: {
    MarqueeData: [], // Initialize as an empty array instead of null
    MarqueeData2: [], // Initialize as an empty array instead of null
  },
  reducers: {
    addMarqueeData: (state, action) => {
      state.MarqueeData = [...state.MarqueeData, action.payload];
    },
    addMarqueeData2: (state, action) => {
      state.MarqueeData2 = [...state.MarqueeData2, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMarqueeData, addMarqueeData2 } = Marqueeslice.actions;

export default Marqueeslice.reducer;