import { withAuthApi } from "../api";

const getUserInfoApi = async (userId) => {
  try {
    const { data } = await withAuthApi.get(`user/${userId}`);
    return data;
  } catch (error) {
    console.error('Error in getUserInfoApi:', error);
    throw error?.response?.data || { message: "Failed to fetch user info." };
  }
};

const updateUserApi = async (userId) => {
  try {
    const { data } = await withAuthApi.put(`updateUser${userId}`);
    return data;
  } catch (error) {
    console.error('Error in updateUserApi:', error);
    throw error?.response?.data || { message: "Failed to update user." };
  }
};

// rooms
const getRoomListApi = async (jsonData) => {
  try {
    const { data } = await withAuthApi.post(`/api/v1/rooms/search`, jsonData);
    return data;
  } catch (error) {
    console.error('Error in getRoomListApi:', error);
    throw error?.response?.data || { message: "Failed to fetch room list." };
  }
};

const getMasterDetailsApi = async (category) => {
  try {
    const { data } = await withAuthApi.get(`/api/v1/masterDetails/getitemsbycategory?Category=${category}`);
    return data;
  } catch (error) {
    console.error('Error in getMasterDetailsApi:', error);
    throw error?.response?.data || { message: "Failed to fetch master details." };
  }
};

const roomBookingApi = async (jsonData) => {
  try {
    const { data } = await withAuthApi.post(`/api/v1/booking/studiobooking`, jsonData);
    return data;
  } catch (error) {
    console.error('Error in roomBookingApi:', error);
    throw error?.response?.data || { message: "Failed to book room." };
  }
};

const getRoomDetailsApi = async (id) => {
  try {
    const { data } = await withAuthApi.get(`/api/v1/rooms/${id}`);
    return data;
  } catch (error) {
    console.error('Error in getRoomDetailsApi:', error);
    throw error?.response?.data || { message: "Failed to fetch room details." };
  }
};

const getAvilableSlotApi = async (id, bookingDate) => {
  try {
    const { data } = await withAuthApi.get(`/api/v1/rooms/available/slots?bookingDate=${bookingDate}&roomId=${id}`);
    return data;
  } catch (error) {
    console.error('Error in getAvilableSlotApi:', error);
    throw error?.response?.data || { message: "Failed to fetch available slots." };
  }
};

export {
  getUserInfoApi,
  roomBookingApi,
  updateUserApi,
  getRoomListApi,
  getMasterDetailsApi,
  getRoomDetailsApi,
  getAvilableSlotApi
};
