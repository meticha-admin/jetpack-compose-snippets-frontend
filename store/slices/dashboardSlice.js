import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/services/api";

// Async thunks
export const fetchDashboardStats = createAsyncThunk("dashboard/fetchDashboardStats", async () => {
  const response = await api.get("/dashboard/stats")
  return response.data
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      activeUsers: 0,
    },
    recentOrders: [],
    topProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.stats || state.stats
        state.recentOrders = action.payload.recentOrders || []
        state.topProducts = action.payload.topProducts || []
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer
