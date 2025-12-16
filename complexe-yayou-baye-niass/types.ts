export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  id?: string; // Helper for frontend compatibility
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  joinDate?: string;
}

export interface Product {
  _id: string;
  id?: string; // Helper for frontend compatibility
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  stock: number;
  isPromo?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  productId: Product | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  id?: string;
  userId: User | string;
  customerName?: string; // Computed on frontend
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
}

export interface Promotion {
  _id: string;
  productId: Product | string;
  discount: number;
  startDate: string;
  endDate: string;
}