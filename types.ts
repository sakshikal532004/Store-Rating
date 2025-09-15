export enum UserRole {
  Admin = 'System Administrator',
  Normal = 'Normal User',
  StoreOwner = 'Store Owner',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Password should not be sent to client
  address: string;
  role: UserRole;
  storeId?: number; // Only for Store Owners
}

export interface Store {
  id: number;
  name:string;
  email: string;
  address: string;
  ownerId?: number;
  averageRating?: number;
}

export interface Rating {
  id: number;
  storeId: number;
  userId: number;
  value: 1 | 2 | 3 | 4 | 5;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}
