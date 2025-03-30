import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  db_type: "",
  host: "",
  database_name: "",
  is_active: false,
  created_at: "",
  metadata: [], // tables/collections
};

const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    setDbInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearDbInfo: () => initialState,
  },
});

export const { setDbInfo, clearDbInfo } = dbSlice.actions;
export default dbSlice.reducer;
