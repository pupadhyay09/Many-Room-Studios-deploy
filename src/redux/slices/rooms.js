import { getMasterDetailsApi, getRoomListApi, roomBookingApi, getRoomDetailsApi, getAvilableSlotApi } from "../../api/requests/protected";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  roomList: [],
  masterList: [],
  roomDetails: {},
  availableSlots: [],
};

export const getRoomList = createAsyncThunk("room/list", async (jsonData) => {
  const data = await getRoomListApi(jsonData);
  return data;
});

export const getMasterDetails = createAsyncThunk("master/list", async (eventtype) => {
  const data = await getMasterDetailsApi(eventtype);
  return data;
});

export const roomBooking = createAsyncThunk("room/bokking", async (jsonData) => {
  console.log('jsonData====>', jsonData)
  const data = await roomBookingApi(jsonData);
  console.log('data====>', data)
  return data;
});

export const getRoomDetails = createAsyncThunk("room/details", async (id) => {
  const data = await getRoomDetailsApi(id);
  console.log('data====>', data)
  return data;
});

export const getAvailableSlots = createAsyncThunk("room/availableSlots", async ({ id, bookingDate }) => {
  const data = await getAvilableSlotApi(id, bookingDate);
  return data;
});

const userSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRoomDetails: (state, action) => {
      state.roomDetails = action.payload;
    },
    setAvailableSlots: (state, action) => {
      state.availableSlots = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getRoomList.fulfilled, (state, action) => {
        const payload = action.payload;
        state.isLoading = false;
        state.roomList = payload;
      })
      .addCase(getRoomList.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getMasterDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getMasterDetails.fulfilled, (state, action) => {
        const payload = action.payload;
        state.isLoading = false;
        state.masterList = payload;
      })
      .addCase(getMasterDetails.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getRoomDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getRoomDetails.fulfilled, (state, action) => {
        const payload = action.payload;
        state.isLoading = false;
        state.roomDetails = payload;
      })
      .addCase(getRoomDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAvailableSlots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(getAvailableSlots.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setRoomDetails, setAvailableSlots } = userSlice.actions;

export default userSlice.reducer;
