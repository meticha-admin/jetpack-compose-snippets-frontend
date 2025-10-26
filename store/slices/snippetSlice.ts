import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import axios from "axios";

export interface SnippetResponseDto {
  id: number;
  title: string;
  description: string;
  gistUrl: string;
  categoryIds: number[];
  previewUrl?: string | null;
  createdAt?: string;
  [key: string]: any;
}

interface CreateSnippetState {
  created?: SnippetResponseDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreateSnippetState = {
  created: null,
  loading: false,
  error: null,
};

/**
 * Expects a FormData instance containing:
 * - title (string)
 * - description (string)
 * - gistUrl (string)
 * - categoryIds repeated (categoryIds=1&categoryIds=2...)
 * - previewFile (File) optional
 */
export const createSnippet = createAsyncThunk<
  SnippetResponseDto,
  FormData,
  { rejectValue: string }
>("snippets/createSnippet", async (formData, { rejectWithValue }) => {
  try {
    // Do NOT set Content-Type header manually — axios will set multipart boundary.
    const response = await axios.post("http://localhost:9000/api/snippets", formData, {
      withCredentials: true,
    });
    // adjust depending on API shape (response.data or response.data.data)
    return response.data?.data ?? response.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to create snippet";
    return rejectWithValue(message);
  }
});

const snippetSlice = createSlice({
  name: "createSnippet",
  initialState,
  reducers: {
    clearCreateSnippetError(state) {
      state.error = null;
    },
    resetCreatedSnippet(state) {
      state.created = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSnippet.fulfilled,
        (state, action: PayloadAction<SnippetResponseDto>) => {
          state.loading = false;
          state.created = action.payload;
        }
      )
      .addCase(createSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to create snippet";
      });
  },
});

export const { clearCreateSnippetError, resetCreatedSnippet } =
  snippetSlice.actions;
export default snippetSlice.reducer;
