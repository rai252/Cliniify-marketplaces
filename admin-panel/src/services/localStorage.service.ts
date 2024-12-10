
export const persistToken = (token: string): void => {
  localStorage.setItem("adminPanel_accessToken", token);
};

export const readToken = (): string => {
  return localStorage.getItem("adminPanel_accessToken") || "";
};

export const persistRefreshToken = (token: string): void => {
  localStorage.setItem("adminPanel_refreshToken", token);
};

export const readRefreshToken = (): string => {
  return localStorage.getItem("adminPanel_refreshToken") || "";
};

export const deleteToken = (): void =>
  localStorage.removeItem("adminPanel_accessToken");
export const deleteRefreshToken = (): void =>
  localStorage.removeItem("adminPanel_refreshToken");
