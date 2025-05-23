import { configureStore } from "@reduxjs/toolkit";

import auth from "./slices/auth";
import user from "./slices/user";
import rooms from "./slices/rooms";

const store = configureStore({
  reducer: {
    auth,
    user,
    rooms,
  },
});

export default store;
