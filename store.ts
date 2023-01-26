import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./slices/sidebarSlice";
import exploreSlice from "./slices/exploreSlice";
import worldSlice from "./slices/worldSlice";

export const store = configureStore({
	reducer: { 
		sidebar: sidebarSlice,
		explore: exploreSlice,
		world: worldSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
