import axiosInstance from "../utils/axios";

export const sendOtp = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/send-otp", data);
  return response.data;
};

export const signUp = async (data: { email: string; verifyCode: number }) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const signIn = async (data: { email: string; verifyCode: number }) => {
  const response = await axiosInstance.post("/auth/signin", data);
  return response.data;
};
