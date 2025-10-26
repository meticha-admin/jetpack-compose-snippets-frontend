import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}) => {
    const response = await api.get("/category");
    return response.data.data;
  }
);

export const createSubcategory = createAsyncThunk(
  "subcategories/createSubcategory",
  async (subcategoryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sub-category", subcategoryData);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";

      return rejectWithValue(message);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  "subcategories/updateSubcategory",
  async ({ id, ...subcategoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/sub-category/${id}`, subcategoryData);
      return response.data;
    } catch (err) {
      // Handle known error structure or fallback
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update subcategory";
      return rejectWithValue(message);
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  "subcategories/deleteSubcategory",
  async (id) => {
    await api.delete(`/sub-category/${id}`);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
