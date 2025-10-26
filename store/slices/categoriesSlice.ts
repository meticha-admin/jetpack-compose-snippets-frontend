import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: category[];
  loading: boolean;
  error: string | null;
}

// Async thunks
export const fetchCategories = createAsyncThunk<
  category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/categories");
    // expecting response.data.data to be array of categories
    return (response.data?.data as category[]) || [];
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Failed to fetch categories";
    return rejectWithValue(message);
  }
});

export const createSubcategory = createAsyncThunk<
  category,
  Partial<category>,
  { rejectValue: string }
>("subcategories/createSubcategory", async (subcategoryData, { rejectWithValue }) => {
  try {
    const response = await api.post("/sub-category", subcategoryData);
    return response.data as category;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "An unknown error occurred";
    return rejectWithValue(message);
  }
});

export const updateSubcategory = createAsyncThunk<
  category,
  { id: number } & Partial<category>,
  { rejectValue: string }
>("subcategories/updateSubcategory", async ({ id, ...subcategoryData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/sub-category/${id}`, subcategoryData);
    return response.data as category;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to update subcategory";
    return rejectWithValue(message);
  }
});

export const deleteSubcategory = createAsyncThunk<number, number, { rejectValue: string }>(
  "subcategories/deleteSubcategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sub-category/${id}`);
      return id;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete subcategory";
      return rejectWithValue(message);
    }
  }
);

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // optional helper to set items directly
    setItems: (state, action: PayloadAction<category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch categories";
      })
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action: PayloadAction<category>) => {
        state.categories.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? "Failed to create subcategory";
        state.loading = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action: PayloadAction<category>) => {
        const index = state.categories.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteSubcategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.categories = state.categories.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearError, setItems } = categoriesSlice.actions;

export default categoriesSlice.reducer;