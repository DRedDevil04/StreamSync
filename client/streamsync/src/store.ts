// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
// import videoReducer from "./slices/videoSlice";
// import chatReducer from "./slices/chatSlice";
// import roomReducer from "./slices/roomSlice";
// import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // video: videoReducer,
    // chat: chatReducer,
    // room: roomReducer,
    // socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
