import { createSlice } from "@reduxjs/toolkit";

export const Marqueeslice = createSlice({
  name: "Marquee",
  initialState: {
    MarqueeData: null,
    MarqueeData2: null,
  },
  reducers: {
    addMarqueeData: (state, action) => {
      if (state.MarqueeData === null) {
        state.MarqueeData = action.payload;
      } else {
        state.MarqueeData = [...state.MarqueeData, action.payload];
      }
    },
    addMarqueeData2: (state, action) => {
      if (state.MarqueeData2 === null) {
        state.MarqueeData2 = action.payload;
      } else {
        state.MarqueeData2 = [...Satellite.MarqueeData2, action.payload];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMarqueeData,addMarqueeData2 } = Marqueeslice.actions;

export default Marqueeslice.reducer;
