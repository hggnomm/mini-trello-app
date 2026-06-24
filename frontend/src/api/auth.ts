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

export const verifyUser = async (data: { email: string; mode: "login" | "register" }) => {
  const response = await axiosInstance.post("/auth/verify-user", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};

export const getLinkUrl = async (): Promise<{ url: string }> => {
  const response = await axiosInstance.get("/auth/github/link");
  return response.data;
};

export const exchangeGithubCode = async (code: string) => {
  const response = await axiosInstance.post("/auth/github/exchange", { code });
  return response.data;
};
