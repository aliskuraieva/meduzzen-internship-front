export interface Company {
  id: number;
  name: string;
  description: string;
  visibility: boolean;
  ownerId: string;
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
