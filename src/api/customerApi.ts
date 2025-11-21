// src/api/customerApi.ts
import httpClient from "./httpClient";
import {
  CustomerDto,
  CreateCustomerRequest,
  CustomerStatus,
} from "../apps/admin/types/iam";

export const CustomerApi = {
  async list(): Promise<CustomerDto[]> {
    const res = await httpClient.get<CustomerDto[]>("/api/customers");
    return res.data;
  },

  async get(id: number): Promise<CustomerDto> {
    const res = await httpClient.get<CustomerDto>(`/api/customers/${id}`);
    return res.data;
  },

  async create(payload: CreateCustomerRequest): Promise<CustomerDto> {
    const res = await httpClient.post<CustomerDto>("/api/customers", payload);
    return res.data;
  },

  async update(
    id: number,
    payload: CreateCustomerRequest
  ): Promise<CustomerDto> {
    const res = await httpClient.put<CustomerDto>(
      `/api/customers/${id}`,
      payload
    );
    return res.data;
  },

  async changeStatus(id: number, status: CustomerStatus): Promise<void> {
    await httpClient.patch(`/api/customers/${id}/status`, null, {
      params: { status },
    });
  },
};
