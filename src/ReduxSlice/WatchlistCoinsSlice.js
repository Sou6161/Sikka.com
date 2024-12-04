// WatchlistCoinsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const WatchlistCoinsSlice = createSlice({
  name: 'watchlist',
  initialState: { coins: [] },
  reducers: {
    addToWatchlistCoins: (state, action) => {
      if (!state.coins.includes(action.payload)) {
        state.coins.push(action.payload);
      }
    },
    removeFromWatchlistcoins: (state, action) => {
      state.coins = state.coins.filter(coinId => coinId !== action.payload);
    },
    clearWatchlist: (state) => {
      state.coins = [];
    },
    setWatchlist: (state, action) => {
      state.coins = action.payload;
    }
  }
});

export const { 
  addToWatchlistCoins, 
  removeFromWatchlistcoins,
  clearWatchlist,
  setWatchlist 
} = WatchlistCoinsSlice.actions;

export default WatchlistCoinsSlice.reducer;
