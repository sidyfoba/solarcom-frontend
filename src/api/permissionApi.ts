// src/api/permissionApi.ts
import httpClient from "./httpClient";
import { PermissionDto } from "../apps/admin/types/iam";

export const PermissionApi = {
  async list(): Promise<PermissionDto[]> {
    const res = await httpClient.get<PermissionDto[]>("/api/permissions");
    return res.data;
  },

  async create(payload: PermissionDto): Promise<PermissionDto> {
    const res = await httpClient.post<PermissionDto>(
      "/api/permissions",
      payload
    );
    return res.data;
  },
};
