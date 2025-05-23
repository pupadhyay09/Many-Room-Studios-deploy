import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInApi, signUpApi } from "../../api/requests/auth";
import { StorageKyes } from "../../constant/constant";
import { localGetItem, localSetItem } from "../../services/localStorage";

const initialState = {
  isLoading: false,
  token: localGetItem(StorageKyes.token),
};

export const signIn = createAsyncThunk("auth/signIn", async (candidate) => {
  console.log("candidate", candidate);
  const data = await signInApi(candidate);
  console.log("data", data);
  return data;
});

export const signUp = createAsyncThunk("auth/signUp", async (candidate) => {
  const data = await signUpApi(candidate);
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { token } = action.payload || {};
        console.log("token", token);
        state.isLoading = false;
        state.token = token;
        if (token) localSetItem(StorageKyes.token, token);
      })
      .addCase(signIn.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        const { token } = action.payload || {};
        state.isLoading = false;
        state.token = token;
        if (token) localSetItem(StorageKyes.token, token);
      })
      .addCase(signUp.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
