import { configureStore } from "@reduxjs/toolkit"
import combosReducer from "./slices/combosSlice"
import categoriesReducer from "./slices/categoriesSlice"
import snippetsReducer from "./slices/snippetsSlice"
import ordersReducer from "./slices/ordersSlice"
import adminUsersReducer from "./slices/adminUsersSlice"
import dashboardReducer from "./slices/dashboardSlice"

export const store = configureStore({
  reducer: {
    combos: combosReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    adminUsers: adminUsersReducer,
    dashboard: dashboardReducer,
    snippets: snippetsReducer,
  },
})
