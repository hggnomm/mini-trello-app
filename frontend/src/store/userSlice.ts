import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
  isVerified: boolean;
  githubId: string | null;
  githubName: string | null;
  isGithubLinked: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },

    clearUser(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
