export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Auth0User {
  sub?: string;
  email?: string;
  nickname?: string;
}

export interface UserData {
  id?: string | number;
  name: string;
  email: string;
  picture?: string;
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
