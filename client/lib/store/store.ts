import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./features/groupSlice";
import taskReducer from "./features/taskSlice";

export const store = configureStore({
    reducer: {
        groups: groupReducer,
        tasks: taskReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;