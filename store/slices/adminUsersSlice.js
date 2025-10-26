import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Async thunks
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (params = {}) => {
    const response = await api.get("/admin-users", { params });
    return response.data;
  }
);

export const createAdminUser = createAsyncThunk(
  "adminUsers/createAdminUser",
  async (userData) => {
    const response = await api.post("/admin-users", userData);
    return response.data;
  }
);

export const updateAdminUser = createAsyncThunk(
  "adminUsers/updateAdminUser",
  async ({ id, ...userData }) => {
    const response = await api.put(`/admin-users/${id}`, userData);
    return response.data;
  }
);

export const deleteAdminUser = createAsyncThunk(
  "adminUsers/deleteAdminUser",
  async (id) => {
    await api.delete(`/admin-users/${id}`);
    return id;
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
