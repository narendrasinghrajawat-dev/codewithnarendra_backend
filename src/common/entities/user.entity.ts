export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
