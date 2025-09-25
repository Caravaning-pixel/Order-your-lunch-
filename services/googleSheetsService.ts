import type { Order, Employee } from '../types';

// This is a MOCK service that uses Local Storage for data persistence.
// In a real application, these functions would make fetch() calls
// to a server or a deployed Google Apps Script web app URL.

const MOCK_API_DELAY = 500;
const ORDERS_STORAGE_KEY = 'maliceAppOrders';

// --- Local Storage Persistence Logic ---

const loadOrdersFromStorage = (): Order[] => {
  try {
    const storedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (error) {
    console.error("Error loading orders from Local Storage:", error);
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]) => {
  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to Local Storage:", error);
  }
};

// Initialize the mock database from Local Storage
let mockOrders: Order[] = loadOrdersFromStorage();

/**
 * Simulates publishing the daily menu.
 */
export const publishMenu = async (dailySpecials: { name: string }[]): Promise<{ success: boolean }> => {
  console.log('Simulating publishing menu...', dailySpecials);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log('Menu published successfully (simulated).');
  return { success: true };
};

/**
 * Submits an order and saves it to Local Storage.
 */
export const submitOrder = async (order: Order): Promise<{ success: boolean }> => {
  console.log('Submitting order and saving to Local Storage...', order);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  const newOrder = { ...order, id: `order-${Date.now()}` };
  mockOrders.push(newOrder); // Update in-memory array
  saveOrdersToStorage(mockOrders); // Persist to Local Storage
  
  console.log('Order submitted successfully (simulated).');
  return { success: true };
};

/**
 * Fetches the entire order history from Local Storage.
 */
export const getOrderHistory = async (): Promise<{ success: boolean, orders: Order[] }> => {
    console.log('Fetching order history from Local Storage...');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    // It's good practice to reload from storage in case it was modified elsewhere
    mockOrders = loadOrdersFromStorage(); 
    const sortedOrders = [...mockOrders].reverse(); // Show newest first
    
    console.log('Order history fetched successfully (simulated).');
    return { success: true, orders: sortedOrders };
};

/**
 * Clears all order history from memory and Local Storage.
 */
export const clearAllOrders = async (): Promise<{ success: boolean }> => {
    console.log('Clearing all order history...');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    mockOrders = [];
    saveOrdersToStorage([]);
    
    console.log('Order history cleared successfully (simulated).');
    return { success: true };
};


// --- Employee Management (unchanged, as it's not related to orders) ---

/**
 * Simulates adding a new employee.
 */
export const addEmployee = async (name: string, email: string, role: 'admin' | 'user', pin?: string): Promise<{ success: boolean, newEmployee?: Employee }> => {
  console.log(`Simulating adding employee: ${name} (${email}) with role: ${role}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  const newEmployee: Employee = { id: `emp-${Date.now()}`, name, email, role };
  if (role === 'admin' && pin) {
    newEmployee.pin = pin;
  }
  console.log('Employee added successfully (simulated).', newEmployee);
  return { success: true, newEmployee };
};

/**
 * Simulates updating an employee's data.
 */
export const updateEmployee = async (id: string, name: string, email: string, role: 'admin' | 'user', pin?: string): Promise<{ success: boolean }> => {
  console.log(`Simulating updating employee ${id} to name: ${name}, email: ${email}, role: ${role}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  console.log('Employee updated successfully (simulated).');
  return { success: true };
};

/**
 * Simulates deleting an employee.
 */
export const deleteEmployee = async (id: string): Promise<{ success: boolean }> => {
  console.log(`Simulating deleting employee ${id}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  console.log('Employee deleted successfully (simulated).');
  return { success: true };
};
