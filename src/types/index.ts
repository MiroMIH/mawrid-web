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

export type DemandeStatus = 'OPEN' | 'CLOSED' | 'CANCELLED' | 'EXPIRED';

export interface Demande {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unit: string;
  deadline: string;
  status: DemandeStatus;
  qualityScore: number;
  categoryId: number;
  categoryName: string;
  categoryPath: string;
  buyerWilaya: string;
  attributes: DemandeAttribute[];
  totalReponses: number;
  disponibleCount: number;
  indisponibleCount: number;
  createdAt: string;
  closedAt?: string;
  daysUntilDeadline: number;
}

export interface DemandeAttribute {
  key: string;
  value: string;
  custom: boolean;
}

export interface CreateDemandeRequest {
  title: string;
  description?: string;
  quantity: number;
  unit: string;
  deadline: string;
  categoryId: number;
  wilaya: string;
  attributes: DemandeAttribute[];
}

export type ReponseStatus = 'DISPONIBLE' | 'INDISPONIBLE';

export interface SupplierReponse {
  supplierId: number;
  supplierName: string;
  supplierCompany: string;
  supplierWilaya: string;
  supplierPhone: string;
  supplierScore: number;
  status: ReponseStatus;
  note?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  depth: number;
  nodeType: string;
  active: boolean;
  children: Category[];
}

export type AttributeType = 'TEXT' | 'NUMBER' | 'SELECT' | 'BOOLEAN';

export interface CategoryAttribute {
  key: string;
  label: string;
  type: AttributeType;
  required: boolean;
  inherited: boolean;
  inheritedFrom?: string;
  options?: string[];
  unit?: string;
}
