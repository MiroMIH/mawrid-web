export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type UserRole = 'BUYER' | 'SUPPLIER' | 'ADMIN' | 'SUPERADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  role: UserRole;
  enabled: boolean;
  wilaya?: string;
  createdAt?: string;
}
