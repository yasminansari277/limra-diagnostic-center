import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </InternetIdentityProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
