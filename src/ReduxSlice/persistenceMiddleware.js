// persistenceMiddleware.js
export const persistenceMiddleware = (key) => (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type.startsWith('watchlist/')) {
    const isLoggedIn = window.localStorage.getItem('isUserLoggedIn') === 'true';
    const userId = window.localStorage.getItem('userId'); // Assuming you store userId on login
    
    if (isLoggedIn && userId) {
      const watchlistState = store.getState().watchlist;
      // Store watchlist with user-specific key
      localStorage.setItem(`${key}_${userId}`, JSON.stringify(watchlistState));
    }
  }
  
  return result;
};


// Add this new auth middleware
export const authMiddleware = (store) => (next) => (action) => {
  // Handle logout
  if (action.type === 'auth/logout') {
    store.dispatch(clearWatchlist());
    return next(action);
  }
  
  // Handle login
  if (action.type === 'auth/login') {
    const userId = action.payload.userId;
    const savedWatchlist = localStorage.getItem(`watchlistState_${userId}`);
    if (savedWatchlist) {
      const watchlistData = JSON.parse(savedWatchlist);
      store.dispatch(setWatchlist(watchlistData.coins));
    }
    return next(action);
  }
  
  return next(action);
};