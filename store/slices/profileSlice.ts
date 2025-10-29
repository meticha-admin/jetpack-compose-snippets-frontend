import api from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UserDto {
  username: string;
  avatarUrl?: string;
  [key: string]: any;
}

interface ProfileState {
  profile: UserDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk<
  UserDto,
  String,
  { rejectValue: string }
>("profile/fetchProfile", async (username, { rejectWithValue }) => {
  try {
    const response = await api.get(`/profile/${username}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch snippets";
    return rejectWithValue(message);
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<UserDto>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      });
  },
});

export default profileSlice.reducer;
