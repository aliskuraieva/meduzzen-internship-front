export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id?: number;
  username: string;
  email: string;
}

export interface UsersDetail {
  page: number;
  pageSize: number;
  total: number;
  users: User[];
}

export interface UsersResponse {
  status_code: number;
  result: string;
  detail: UsersDetail;
}
