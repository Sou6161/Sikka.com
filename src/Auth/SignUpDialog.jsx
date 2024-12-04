import { useState, useEffect } from "react";
import { signUp, signIn, signOut, isAuthenticated } from "../lib/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Sign Up/Sign In Dialog Box component
const SignUpDialog = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn(email, password);
    onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      await signUp(email, password, name);
      onClose();
    } else {
      alert("Passwords do not match");
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const checkAuth = async () => {
    const auth = await isAuthenticated();
    if (auth) {
      onClose();
      // Notify Header component about login status change
      window.localStorage.setItem("isUserLoggedIn", "true");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div
      className={`absolute top-[10vh] 2xlarge:top-16 left-[3vw] xsmall:left-[20vw] small:left-[30vw] medium:left-[40vw] large:left-[50vw] xlarge:left-[60vw] 2xlarge:left-[63vw] z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 xsmall:block small:block medium:hidden large:hidden xlarge:hidden 2xlarge:hidden"></div>
      )}
      <div className="bg-white w-[90vw] xsmall:w-[90vw] small:w-[80vw] medium:w-[60vw] large:w-[40vw] xlarge:w-[30vw] 2xlarge:w-[20vw] p-4 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute 2xlarge:hidden top-2 right-2 text-gray-500 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl mb-5 font-bold">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <form>
          {isSignIn ? (
            <>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <br />
              <label>Password</label>
              <div className="relative">
                <input
                  type={passwordType ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                <span
                  onClick={() => setPasswordType(!passwordType)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {passwordType ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
            </>
          ) : (
            <>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <br />
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <br />
              <label>Password</label>
              <div className="relative">
                <input
                  type={passwordType ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                <span
                  onClick={() => setPasswordType(!passwordType)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {passwordType ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
              <br />
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={confirmPasswordType ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                <span
                  onClick={() => setConfirmPasswordType(!confirmPasswordType)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {confirmPasswordType ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
            </>
          )}
          <button
            onClick={isSignIn ? handleSignIn : handleSignUp}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
          <p className="text-sm">
            {isSignIn ? (
              <a
                href="#"
                onClick={() => setIsSignIn(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Create an account
              </a>
            ) : (
              <a
                href="#"
                onClick={() => setIsSignIn(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Already have an account? Sign In
              </a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpDialog;
