/* eslint-disable import/no-named-as-default */
import { configureStore } from '@reduxjs/toolkit';
import sidebarSlice from './slices/sidebarSlice';
import exploreSlice from './slices/exploreSlice';
import radialChartSlice from './slices/radialChartSlice';
import worldSlice from './slices/worldSlice';
import deltaSlice from './slices/deltaSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    explore: exploreSlice,
    radialChart: radialChartSlice,
    world: worldSlice,
    delta: deltaSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
