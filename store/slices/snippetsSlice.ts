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
  snippets: SnippetResponseDto[];
  loading: boolean;
  error: string | null;
}

const initialState: CreateSnippetState = {
  created: null,
  snippets: [],
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
    const response = await axios.post(
      "http://localhost:9000/api/snippets",
      formData,
      {
        withCredentials: true,
      }
    );
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

// New: fetchSnippets action to get list of snippets
export const fetchSnippets = createAsyncThunk<
  SnippetResponseDto[],
  void,
  { rejectValue: string }
>("snippets/fetchSnippets", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/snippets", {
      withCredentials: true,
    });
    // adapt depending on API shape
    return response.data?.data.content ?? response.data.content ?? [];
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch snippets";
    return rejectWithValue(message);
  }
});

// New: fetchSingleSnippets action to get single of snippet
export const fetchSingleSnippet = createAsyncThunk<
  SnippetResponseDto,
  String,
  { rejectValue: string }
>("snippets/fetchSingleSnippets", async (slug, { rejectWithValue }) => {
  try {
    const response = await api.get(`/snippets/${slug}`, {
      withCredentials: true,
    });
    // adapt depending on API shape
    return response.data?.data ?? response.data ?? [];
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch snippets";
    return rejectWithValue(message);
  }
});

// like likeUnlikeSnippet, action to like and unLike single snippet
export const likeUnlikeSnippet = createAsyncThunk<
  SnippetResponseDto,
  String,
  { rejectValue: string }
>("snippets/likeUnlikeSnippet", async (slug, { rejectWithValue }) => {
  try {
    const response = await api.get(`/reaction/${slug}`, {
      withCredentials: true,
    });
    // adapt depending on API shape
    return response.data?.data ?? response.data ?? [];
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to like/unlike snippet";
    return rejectWithValue(message);
  }
});

const snippetsSlice = createSlice({
  name: "snippets",
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
      })
      // fetchSnippets handlers
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSnippets.fulfilled,
        (state, action: PayloadAction<SnippetResponseDto[]>) => {
          state.loading = false;
          state.snippets = action.payload;
        }
      )
      .addCase(fetchSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch snippets";
      })

      // fetchSingleSnippet handlers
      .addCase(fetchSingleSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSingleSnippet.fulfilled,
        (state, action: PayloadAction<SnippetResponseDto>) => {
          state.loading = false;
        }
      )
      .addCase(fetchSingleSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch snippet";
      })

      // likeUnlikeSnippet handlers
      .addCase(likeUnlikeSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        likeUnlikeSnippet.fulfilled,
        (state, action: PayloadAction<SnippetResponseDto>) => {
          state.loading = false;
        }
      )
      .addCase(likeUnlikeSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to like/unlike snippet";
      });
  },
});

export const { clearCreateSnippetError, resetCreatedSnippet } =
  snippetsSlice.actions;
export default snippetsSlice.reducer;
