export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
  timestamp: string;
  error?: any;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  email: string;
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  projectUrl: string;
  repositoryUrl: string;
  isFeatured?: boolean;
  sortOrder?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  _id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface About {
  _id: string;
  title: string;
  description: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
