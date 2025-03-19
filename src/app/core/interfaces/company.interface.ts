import { User } from "./user.interface";

export interface Company {
  id: number;
  name: string;
  description: string;
  visibility: boolean;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesDetail {
  page: number;
  pageSize: number;
  total: number;
  companies: Company[];
}

export interface CompaniesResponse {
  status_code: number;
  result: string;
  detail: CompaniesDetail;
}

export interface BaseResponse<T> {
  status_code: number;
  result: string;
  detail: T;
}
