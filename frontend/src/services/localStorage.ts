const USER_KEY = "carbonwise_userKey";
const USER_NAME = "carbonwise_userName";

export const saveUserKey = (key: string) => {
  localStorage.setItem(USER_KEY, key);
};

export const getUserKey = () => {
  const value = localStorage.getItem(USER_KEY)?.trim();

  return value || null;
};

export const getUserName = () => {
  return localStorage.getItem(USER_NAME);
};

export const clearUserKey = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_NAME);
};
