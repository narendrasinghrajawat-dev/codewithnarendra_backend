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
