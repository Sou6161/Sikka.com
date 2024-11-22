export const persistenceNftsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith('watchlistNfts/')) {
    const watchlistNftsState = store.getState().watchlistNfts; // Changed from watchlist to watchlistNfts
    localStorage.setItem('watchlistNftsState', JSON.stringify(watchlistNftsState));
  }

  return result;
};