"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ProvidersClientWrapper({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
