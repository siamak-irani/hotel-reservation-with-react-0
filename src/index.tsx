import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StoreContextProvider } from "./components/context";

const root = ReactDOM.createRoot(
  document.getElementById("hotel-reservation") as HTMLElement
);
root.render(
  <StoreContextProvider>
    <App />
  </StoreContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
