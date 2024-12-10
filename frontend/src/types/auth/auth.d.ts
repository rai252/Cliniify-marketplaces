export interface IRegisterResponse {
  message: string;
  user_id: number;
  doctor_id: number;
}

export interface IresendOTP {
  message: string;
}

export interface IOTPResponse {
  message: string;
}

export interface IForgotPassword {
  message: string;
}

export interface IForgotPasswordEmailVerify {
  message: string;
}

export interface IresetPassword {
  message: string;
}

export interface Ilogin {
  access_token: string;
  refresh_token: string;
}

export interface IRefreshToken {
  access: string;
}