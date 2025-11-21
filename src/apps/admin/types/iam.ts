// src/types/iam.ts

export type CustomerStatus = "ACTIVE" | "SUSPENDED" | "TERMINATED";

export interface CustomerDto {
  id: number;
  name: string;
  tenantKey: string;
  status: CustomerStatus;
}

export interface CreateCustomerRequest {
  name: string;
  // tenantKey removed; backend generates it
}

export interface PermissionDto {
  id: number;
  code: string;
  description?: string;
}

export interface RoleDto {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UserAccountDto {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  internalUser: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  internalUser: boolean;
}

export interface AssignUserRoleRequest {
  userId: number;
  customerId: number;
  roleId: number;
}

export interface UserRoleDto {
  id: number;
  userId: number;
  username: string;
  customerId: number;
  customerName: string;
  roleId: number;
  roleCode: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  enabled?: boolean;
  internalUser?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}
