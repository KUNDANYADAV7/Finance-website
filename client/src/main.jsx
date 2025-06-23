
// import './index.css';
// import { createContext, StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";

// export const Context = createContext({
//   isAuthenticated: false,
//   setIsAuthenticated: () => {},
//   user: null,
//   setUser: () => {},
//   loading: true,
//   setLoading: () => {},
// });

// const AppWrapper = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState();
//   const [user, setUser] = useState();
//   const [loading, setLoading] = useState(true);

//   return (
//     <Context.Provider
//       value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading, setLoading }}
//     >
//       <App />
//     </Context.Provider>
//   );
// };

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AppWrapper />
//   </StrictMode>
// );





import './index.css';
import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ✅ Initial context with default values
export const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
