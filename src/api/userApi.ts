// src/api/userApi.ts
import httpClient from "./httpClient";
import {
  UserAccountDto,
  CreateUserRequest,
  AssignUserRoleRequest,
  UserRoleDto,
  UpdateUserRequest,
  ResetPasswordRequest,
} from "../apps/admin/types/iam";

export const UserApi = {
  async list(): Promise<UserAccountDto[]> {
    const res = await httpClient.get<UserAccountDto[]>("/api/users");
    return res.data;
  },

  async get(id: number): Promise<UserAccountDto> {
    const res = await httpClient.get<UserAccountDto>(`/api/users/${id}`);
    return res.data;
  },

  async create(payload: CreateUserRequest): Promise<UserAccountDto> {
    const res = await httpClient.post<UserAccountDto>("/api/users", payload);
    return res.data;
  },

  async setEnabled(id: number, enabled: boolean): Promise<void> {
    await httpClient.patch(`/api/users/${id}/enabled`, null, {
      params: { enabled },
    });
  },

  update: async (
    id: number,
    req: UpdateUserRequest
  ): Promise<UserAccountDto> => {
    const res = await httpClient.patch(`/api/users/${id}`, req);
    return res.data;
  },

  resetPassword: async (
    id: number,
    req: ResetPasswordRequest
  ): Promise<void> => {
    await httpClient.post(`/api/users/${id}/reset-password`, req);
  },

  async assignRole(payload: AssignUserRoleRequest): Promise<UserRoleDto> {
    const res = await httpClient.post<UserRoleDto>(
      "/api/users/assign-role",
      payload
    );
    return res.data;
  },

  async listRolesForUser(userId: number): Promise<UserRoleDto[]> {
    const res = await httpClient.get<UserRoleDto[]>(
      `/api/users/${userId}/roles`
    );
    return res.data;
  },
};
