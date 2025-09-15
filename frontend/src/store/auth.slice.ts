import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
};

type Auth = {
  user: User;
  isAuthenticated: boolean;
};

const initialState: Auth = {
  user: {},
  isAuthenticated: false,
};
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        loginUser : (state,action:PayloadAction<User>)=>{
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser : (state,action:PayloadAction<User>)=>{
            state.user = action.payload;
            state.isAuthenticated = false;
        }
    }
});

export const {loginUser,logoutUser} = authSlice.actions;

export default authSlice.reducer;