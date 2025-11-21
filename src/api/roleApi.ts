// src/api/roleApi.ts
import httpClient from "./httpClient";
import { RoleDto, CreateRoleRequest } from "../apps/admin/types/iam";

export const RoleApi = {
  async list(): Promise<RoleDto[]> {
    const res = await httpClient.get<RoleDto[]>("/api/roles");
    return res.data;
  },

  async create(payload: CreateRoleRequest): Promise<RoleDto> {
    const res = await httpClient.post<RoleDto>("/api/roles", payload);
    return res.data;
  },

  async addPermissionToRole(
    roleCode: string,
    permissionCode: string
  ): Promise<void> {
    await httpClient.post(
      `/api/roles/${encodeURIComponent(
        roleCode
      )}/permissions/${encodeURIComponent(permissionCode)}`
    );
  },
};
