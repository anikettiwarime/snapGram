import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import QueryProvider from "./lib/react-query/QueryProvider.tsx";
import AuthContextProvider from "./context/AuthContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
