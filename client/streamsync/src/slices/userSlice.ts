import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  username: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  username: "Guest",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; username: string }>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.id = null;
      state.username = "Guest";
      state.isAuthenticated = false;
    },
    updateUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUsername } = userSlice.actions;
export default userSlice.reducer;
