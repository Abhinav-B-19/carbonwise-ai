import {
    getUserKey,
    saveUserKey,
  } from "../services/localStorage";
  
  export const useUserKey = () => {
    return {
      getUserKey,
      saveUserKey,
    };
  };