import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  activeTab: string;
};
const initialState: InitialState = {
  activeTab: "Dashboard",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {setActive} = appSlice.actions;
export default appSlice.reducer;
