import { withAuthApi, withoutAuthApi } from "../api";

const signInApi = async (candidate) => {
  console.log("candidateapi", candidate);
  try {
    const { data } = await withoutAuthApi.post("/api/v1/user/login", candidate);
    return data;
  } catch (error) {
    console.error("Sign-in failed:", error);
    throw error;
  }
};

const signUpApi = async (candidate) => {
  try {
    const { data } = await withAuthApi.post("/sign-up", candidate);
    return data;
  } catch (error) {
    console.error("Sign-up failed:", error);
    throw error;
  }
};

const forgotPassApi = async (candidate) => {
  try {
    const { data } = await withAuthApi.post("/forgot-pass", candidate);
    return data;
  } catch (error) {
    console.error("Forgot password failed:", error);
    throw error;
  }
};

const changePasswordApi = async (candidate) => {
  try {
    const { data } = await withAuthApi.post("/change-password", candidate);
    return data;
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
};

export { signInApi, signUpApi, forgotPassApi, changePasswordApi };
