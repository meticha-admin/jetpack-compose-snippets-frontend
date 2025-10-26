import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/services/api";

// Async thunks
export const fetchCombos = createAsyncThunk("combos/fetchCombos", async (params = {}) => {
  const response = await api.get("/combo", { params })
  return response.data.data
})

export const createCombo = createAsyncThunk("combos/createCombo", async (comboData) => {
  const response = await api.post("/combo", comboData)
  return response.data
})

export const updateCombo = createAsyncThunk("combos/updateCombo", async ({ id, ...comboData }) => {
  const response = await api.put(`/combo/${id}`, comboData)
  return response.data
})

export const deleteCombo = createAsyncThunk("combos/deleteCombo", async (id) => {
  await api.delete(`/combos/${id}`)
  return id
})

const combosSlice = createSlice({
  name: "combos",
  initialState: {
    items: [],
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
      .addCase(fetchCombos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCombos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCombos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createCombo.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateCombo.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteCombo.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const { clearError } = combosSlice.actions
export default combosSlice.reducer
