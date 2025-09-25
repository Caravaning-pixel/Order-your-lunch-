import type { Meal, Employee } from './types';

export const PERMANENT_MEALS: Meal[] = [
  { id: '3', name: 'Dunajski zrezek, Pommes frites, tatarska omaka ali solata' },
  { id: '4', name: 'Ocvrti sir, Pommes frites, tatarska omaka ali solata' },
  { id: '5', name: 'Kebab Krožnik' },
  { id: '6', name: 'Solata s piščancem' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Davor', email: 'ana.novak@example.com', role: 'admin', pin: '1234' },
  { id: 'emp-7', name: 'Anja', email: 'anja@example.com', role: 'admin', pin: '8520' },
  { id: 'emp-2', name: 'Božo', email: 'luka.horvat@example.com', role: 'user' },
  { id: 'emp-3', name: 'Klemen', email: 'eva.kovacic@example.com', role: 'user' },
  { id: 'emp-4', name: 'Jakob', email: 'jan.kovac@example.com', role: 'user' },
  { id: 'emp-5', name: 'Janja', email: 'nina.zupancic@example.com', role: 'user' },
  { id: 'emp-6', name: 'Lenča', email: 'marko.krajnc@example.com', role: 'user' },
  { id: 'emp-8', name: 'monika', email: 'monika@example.com', role: 'user' },
];