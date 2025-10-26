import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/services/api";

// Async thunks
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (params = {}) => {
  const response = await api.get("/order", { params })
  return response.data.data
})

export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async ({ id, status }) => {
  const response = await api.patch(`/orders/${id}/status`, { status })
  return response.data
})

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
    error: null,
    newOrdersCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setNewOrdersCount: (state, action) => {
      state.newOrdersCount = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.orders || action.payload
        // Count new orders (pending status)
        state.newOrdersCount = state.items.filter((order) => order.status === "pending").length
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        // Update new orders count
        state.newOrdersCount = state.items.filter((order) => order.status === "pending").length
      })
  },
})

export const { clearError, setNewOrdersCount } = ordersSlice.actions
export default ordersSlice.reducer
