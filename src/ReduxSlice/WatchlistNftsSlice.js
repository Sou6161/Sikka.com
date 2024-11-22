// WatchlistNftsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  try {
    const persistedState = localStorage.getItem('watchlistNftsState');
    return persistedState ? JSON.parse(persistedState) : { nfts: [] };
  } catch (err) {
    console.error('Error loading persisted watchlist state:', err);
    return { nfts: [] };
  }
};

const WatchlistNftsSlice = createSlice({
  name: 'watchlistNfts',
  initialState: loadInitialState(),
  reducers: {
    addToWatchlistNfts: (state, action) => {
      if (!state.nfts || !state.nfts.includes(action.payload)) {
        state.nfts = state.nfts || []; // Ensure nfts is an array
        state.nfts.push(action.payload);
      }
      localStorage.setItem('watchlistNftsState', JSON.stringify(state));
    },
    removeFromWatchlistNfts: (state, action) => {
      state.nfts = state.nfts.filter(coinId => coinId !== action.payload);
      localStorage.setItem('watchlistNftsState', JSON.stringify(state));
    }
  }
});

export const { addToWatchlistNfts, removeFromWatchlistNfts } = WatchlistNftsSlice.actions;
export default WatchlistNftsSlice.reducer;