import { commonrequest } from "./ApiCall";
import { BACKEND_URL } from "./helper";

export const registerfunction = async (data) => {
  try {
    const response = await commonrequest("POST", `${BACKEND_URL}/api/user/register`, data);
    return response;
  } catch (error) {
    console.error('Error in registerfunction:', error);
    throw error; 
  }
};

export const sentOtpFunction = async (data) => {
  try {
    const response = await commonrequest("POST", `${BACKEND_URL}/api/user/sendotp`, data);
    return response;
  } catch (error) {
    console.error('Error in sentOtpFunction:', error);
    throw error;
  }
};

export const userVerify = async (data) => {
  try {
    const response = await commonrequest("POST", `${BACKEND_URL}/api/user/login`, data);
    return response;
  } catch (error) {
    console.error('Error in userVerify:', error);
    throw error;
  }
};

