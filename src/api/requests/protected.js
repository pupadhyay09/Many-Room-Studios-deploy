import { withAuthApi } from "../api";

const getUserInfoApi = async (userId) => {
  const { data } = await withAuthApi.get(`user/${userId}`);
  return data;
};

const updateUserApi = async (userId) => {
  const { data } = await withAuthApi.put(`updateUser${userId}`);
  return data;
};

//rooms
const getRoomListApi = async (jsonData) => {
  console.log('jsonData===>', jsonData)
  const { data } = await withAuthApi.post(`/api/v1/rooms/search`, jsonData);
  console.log('data===>', data)
  return data;
};

const getMasterDetailsApi = async (category) => {
  const { data } = await withAuthApi.get(`/api/v1/masterDetails/getitemsbycategory?Category=${category}`);
  return data;
};

const roomBookingApi = async (jsonData) => {
  console.log('jsonData====>', jsonData)
  const { data } = await withAuthApi.post(`/api/v1/booking/studiobooking`, jsonData);
  console.log('data====>', data)
  return data;
};

const getRoomDetailsApi = async (id) => {
  console.log('id====>', id)
  const { data } = await withAuthApi.get(`/api/v1/rooms/${id}`);
  console.log('data====>', data)
  return data;
};

const getAvilableSlotApi = async (id, bookingDate) => {
  console.log('id====>', id)
  console.log('bookingDate====>', bookingDate)
  const { data } = await withAuthApi.get(`/api/v1/rooms/available/slots?bookingDate=${bookingDate}&roomId=${id}`);
  console.log('data====>', data)
  return data;
};


export { getUserInfoApi, roomBookingApi, updateUserApi, getRoomListApi, getMasterDetailsApi, getRoomDetailsApi, getAvilableSlotApi };
