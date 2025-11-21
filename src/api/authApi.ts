// src/api/authApi.ts
import httpClient from "./httpClient";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string; // "Bearer"
  username: string;
  permissions: string[];
}

export const AuthApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await httpClient.post<LoginResponse>(
      "/api/auth/login",
      payload
    );
    return res.data;
  },
};
