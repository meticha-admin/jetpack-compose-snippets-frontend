import { configureStore } from "@reduxjs/toolkit";
import combosReducer from "./slices/combosSlice";
import categoriesReducer from "./slices/categoriesSlice";
import snippetsReducer from "./slices/snippetsSlice";
import ordersReducer from "./slices/ordersSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    combos: combosReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    adminUsers: adminUsersReducer,
    dashboard: dashboardReducer,
    snippets: snippetsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
