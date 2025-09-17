export interface Meal {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  pin?: string;
}

export interface Order {
  id?: string; // Added for unique key in lists
  date: string;
  user: string;
  meal: string;
  hasSoup: boolean;
  note?: string;
}

export enum View {
    Admin = 'admin',
    User = 'user'
}