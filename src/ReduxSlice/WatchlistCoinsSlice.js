// WatchlistCoinsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  try {
    const persistedState = localStorage.getItem('watchlistState');
    return persistedState ? JSON.parse(persistedState) : { coins: [] };
  } catch (err) {
    console.error('Error loading persisted watchlist state:', err);
    return { coins: [] };
  }
};

const WatchlistCoinsSlice = createSlice({
  name: 'watchlist',
  initialState: loadInitialState(),
  reducers: {
    addToWatchlistCoins: (state, action) => {
      if (!state.coins.includes(action.payload)) {
        state.coins.push(action.payload);
      }
      localStorage.setItem('watchlistState', JSON.stringify(state));
    },
    removeFromWatchlistcoins: (state, action) => {
      state.coins = state.coins.filter(coinId => coinId !== action.payload);
      localStorage.setItem('watchlistState', JSON.stringify(state));
    }
  }
});

export const { addToWatchlistCoins, removeFromWatchlistcoins } = WatchlistCoinsSlice.actions;
export default WatchlistCoinsSlice.reducer;