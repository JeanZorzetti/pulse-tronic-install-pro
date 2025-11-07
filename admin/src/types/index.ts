// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ATTENDANT = 'ATTENDANT',
  TECHNICIAN = 'TECHNICIAN',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Quote Types
export interface Quote {
  id: string;
  customerId: string;
  customer: Customer;
  serviceId?: string;
  service?: Service;
  equipmentBrand: string;
  equipmentModel: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  description?: string;
  status: QuoteStatus;
  estimatedPrice?: number;
  estimatedDuration?: number;
  assignedToId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export enum QuoteStatus {
  NEW = 'NEW',
  ANALYZING = 'ANALYZING',
  QUOTE_SENT = 'QUOTE_SENT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ContactStatus {
  NEW = 'NEW',
  READ = 'READ',
  REPLIED = 'REPLIED',
  CLOSED = 'CLOSED',
}

// Service Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  estimatedTime?: number; // in minutes
  isActive: boolean;
  displayOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  items: ServiceItem[];
  _count?: {
    quotes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  serviceId: string;
  item: string;
  displayOrder: number;
}

export enum ServiceCategory {
  MULTIMEDIA = 'MULTIMEDIA',
  SOUND = 'SOUND',
  CAMERA = 'CAMERA',
  SECURITY = 'SECURITY',
  ACCESSORIES = 'ACCESSORIES',
}

// Notification Types
export interface Notification {
  id: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  NEW_QUOTE = 'NEW_QUOTE',
  NEW_CONTACT = 'NEW_CONTACT',
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
  QUOTE_UPDATED = 'QUOTE_UPDATED',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  quotesToday: number;
  quotesWeek: number;
  quotesMonth: number;
  pendingQuotes: number;
  contactsToday: number;
  unreadNotifications: number;
  conversionRate: number;
}
