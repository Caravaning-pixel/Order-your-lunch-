import type { Order, Employee } from '../types';

// This is a MOCK service. In a real application, these functions would
// make fetch() calls to a deployed Google Apps Script web app URL.

const MOCK_API_DELAY = 1000; // Simulate 1 second network delay
let mockOrders: Order[] = []; // Mock database for orders

/**
 * Simulates publishing the daily menu.
 * In a real app, this might not be needed if the menu is only client-side state.
 * However, it could be used to store historical menus in a separate sheet.
 */
export const publishMenu = async (dailySpecials: { name: string }[]): Promise<{ success: boolean }> => {
  console.log('Simulating publishing menu to Google Sheets...', dailySpecials);
  
  // In a real app:
  // const response = await fetch('YOUR_APPS_SCRIPT_URL?action=publishMenu', {
  //   method: 'POST',
  //   body: JSON.stringify(dailySpecials),
  // });
  // if (!response.ok) return { success: false };
  // const result = await response.json();
  // return { success: result.status === 'success' };
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log('Menu published successfully (simulated).');
  return { success: true };
};

/**
 * Simulates submitting an order to be appended to a Google Sheet.
 */
export const submitOrder = async (order: Order): Promise<{ success: boolean }> => {
  console.log('Simulating submitting order to Google Sheets...', order);

  // In a real app:
  // const response = await fetch('YOUR_APPS_SCRIPT_URL?action=submitOrder', {
  //   method: 'POST',
  //   body: JSON.stringify(order),
  // });
  // if (!response.ok) return { success: false };
  // const result = await response.json();
  // return { success: result.status === 'success' };
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  // Add to our mock database
  const newOrder = { ...order, id: `order-${Date.now()}` };
  mockOrders.push(newOrder);
  console.log('Order submitted successfully (simulated).');
  return { success: true };
};

/**
 * Simulates fetching the entire order history.
 */
export const getOrderHistory = async (): Promise<{ success: boolean, orders: Order[] }> => {
    console.log('Simulating fetching order history...');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    // Return orders newest first
    const sortedOrders = [...mockOrders].reverse();
    console.log('Order history fetched successfully (simulated).');
    return { success: true, orders: sortedOrders };
};


/**
 * Simulates triggering a Google Apps Script function to send monthly email reports.
 * This function would need access to the employee list with emails.
 */
export const sendMonthlyReport = async (): Promise<{ success: boolean }> => {
  console.log('Simulating request to send monthly report...');

  // In a real app:
  // const response = await fetch('YOUR_APPS_SCRIPT_URL?action=sendReport', {
  //   method: 'POST',
  // });
  // if (!response.ok) return { success: false };
  // const result = await response.json();
  // return { success: result.status === 'success' };
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY * 2)); // Longer delay for "heavier" task
  console.log('Monthly report sent successfully (simulated).');
  return { success: true };
};

/**
 * Simulates exporting daily orders to a new Google Sheet.
 */
export const exportOrdersToSheet = async (orders: Order[]): Promise<{ success: boolean }> => {
  const today = new Date().toISOString().split('T')[0];
  const sheetName = `Malice - ${today}`;
  console.log(`Simulating exporting ${orders.length} orders to Google Sheet: "${sheetName}"`);

  // Transform data to match the required columns: Datum, Ime osebe, Malica
  const exportData = orders.map(order => ({
    'Datum': order.date,
    'Ime osebe': order.user,
    'Malica': order.meal,
  }));

  console.log('Data to be exported:', exportData);

  // In a real app:
  // const response = await fetch('YOUR_APPS_SCRIPT_URL?action=exportOrders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ sheetName, data: exportData }),
  // });
  // if (!response.ok) return { success: false };
  // const result = await response.json();
  // return { success: result.status === 'success' };
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY * 1.5));
  console.log('Orders exported successfully (simulated).');
  return { success: true };
};

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