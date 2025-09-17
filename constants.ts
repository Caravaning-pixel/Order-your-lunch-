import type { Meal, Employee } from './types';

export const PERMANENT_MEALS: Meal[] = [
  { id: '3', name: 'Dunajski zrezek, Pommes frites, tatarska omaka ali solata' },
  { id: '4', name: 'Ocvrti sir, Pommes frites, tatarska omaka ali solata' },
  { id: '5', name: 'Kebab Krožnik' },
  { id: '6', name: 'Solata s piščancem' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Ana Novak', email: 'ana.novak@example.com', role: 'admin', pin: '1234' },
  { id: 'emp-7', name: 'Anja', email: 'anja@example.com', role: 'admin', pin: '8520' },
  { id: 'emp-2', name: 'Luka Horvat', email: 'luka.horvat@example.com', role: 'user' },
  { id: 'emp-3', name: 'Eva Kovačič', email: 'eva.kovacic@example.com', role: 'user' },
  { id: 'emp-4', name: 'Jan Kovač', email: 'jan.kovac@example.com', role: 'user' },
  { id: 'emp-5', name: 'Nina Zupančič', email: 'nina.zupancic@example.com', role: 'user' },
  { id: 'emp-6', name: 'Marko Krajnc', email: 'marko.krajnc@example.com', role: 'user' },
];