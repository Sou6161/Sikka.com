export const persistenceMiddleware = (key) => (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith('watchlist/')) {
    const watchlistState = store.getState().watchlist;
    localStorage.setItem(key, JSON.stringify(watchlistState));
  }

  return result;
};    