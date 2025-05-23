import { getUserInfoApi, updateUserApi } from "../../api/requests/protected";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StorageKyes } from "../../constant/constant";

const initialState = {
  user: null,
};

export const getInfo = createAsyncThunk("user/getInfo", async () => {
  const data = await getUserInfoApi();
  return data;
});

export const updateUser = createAsyncThunk("user/update", async (data) => {
  const imageName = await updateUserApi(data);
  return imageName;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.fulfilled, (state, action) => {
        const payload = action.payload;
        state.user = payload;
        localStorage.setItem(StorageKyes.role, payload.role);
      })
      .addCase(getInfo.rejected, (state) => {
        state.user = null;
        localStorage.clear();
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const payload = action.payload;
        state.user = payload;
        localStorage.setItem(StorageKyes.role, payload.role);
      })
      .addCase(updateUser.rejected, (state) => {
        state.user = null;
        localStorage.clear();
      });
  },
});

export default userSlice.reducer;
