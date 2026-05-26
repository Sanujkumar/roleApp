export type Role = 'USER' | 'ADMIN';
export type RecordStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  _count?: { records: number };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Record {
  id: number;
  title: string;
  status: RecordStatus;
  createdAt: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
}
