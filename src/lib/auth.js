import { account } from "./appwrite";

const signUp = async (email, password, name) => {
    try {
      const userId = await account.create('unique()', email, password, name);
      await signIn(email, password);
      window.localStorage.setItem('isUserLoggedIn', 'true');
      window.location.reload(); // Reload page after login
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

const signIn = async (email, password) => {
    try {
      await account.createSession(email, password);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

const signOut = async () => {
    try {
      const response = await fetch('https://cloud.appwrite.io/v1/account/sessions/current', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-project': '673f06330007eb8bd6e4',
        }
      });
      const data = await response.json();
      window.localStorage.removeItem('isUserLoggedIn');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

const isAuthenticated = async () => {
  try {
    const session = await account.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
};

export { signUp, signIn, signOut, isAuthenticated };
