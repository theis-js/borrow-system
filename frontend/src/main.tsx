import { Provider } from "@/components/ui/provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import i18n from "./utils/i18n"; // import i18n configuration DO NOT REMOVE

// Prevent unused variable tree shaking
let i18nUnused = i18n;
console.log(i18nUnused);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
