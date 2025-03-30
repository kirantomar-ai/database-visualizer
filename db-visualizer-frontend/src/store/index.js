import { configureStore } from "@reduxjs/toolkit";
import dbReducer from "./dbSlice";

export const store = configureStore({
  reducer: {
    db: dbReducer,
    // add other slices here
  },
});
