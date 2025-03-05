import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "@/interface/user";

interface AuthState {
  user: UserInterface | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: UserInterface; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // Kept in memory only
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUser: (state, action: PayloadAction<UserInterface>) => {
      state.user = action.payload; // Only update the user, keep token unchanged
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
