import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  username: string;
  isAuthenticated: boolean;
  friendsList?: string[]; // Optional: Add a friends list if needed
}

const initialState: UserState = {
  id: null,
  username: "Guest",
  isAuthenticated: false,
  friendsList: [], // Initialize with an empty array if needed
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; username: string, friendsList?: string[] }>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.friendsList = action.payload.friendsList || [];
    },
    clearUser(state) {
      state.id = null;
      state.username = "Guest";
      state.isAuthenticated = false;
      state.friendsList = []; // Reset friends list
    },
    updateUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateFriendsList(state, action: PayloadAction<string[]>) {
      state.friendsList = action.payload;
    },
    addFriend(state, action: PayloadAction<string>) {
      if (!state.friendsList?.includes(action.payload)) {
        state.friendsList?.push(action.payload);
      }
    },
  },
});

export const { setUser, clearUser, updateUsername, updateFriendsList, addFriend } = userSlice.actions;
export default userSlice.reducer;
