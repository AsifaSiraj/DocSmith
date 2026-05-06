export function calculateTotal(price: number, quantity: number, discount?: number): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  const base = price * quantity;
  return discount ? base - discount : base;
}
/**
 * Fetches data
 *
 * @async
 * @param {string} id - Id
 * @returns {Promise<{ name: string; email: string; }>} Async result
 * @throws {TypeError} When this error occurs
 *
 * @example
 * fetchUser(id)
 */
export async function fetchUser(id: string): Promise<{ name: string; email: string }> {
  if (!id) {
    throw new TypeError("ID is required");
  }
  return { name: "Alice", email: "alice@example.com" };
}

/**
 * greet function
 *
 * @param {string} name - Name
 * @returns {string} String result
 *
 * @example
 * greet(name)
 */
/**
 * greet function
 *
 * @param {string} name - Name
 * @returns {string} String result
 *
 * @example
 * greet(name)
 */
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

class UserService {
  /**
   * Creates something
   *
   * @param {string} name - Name
   * @param {string} role - Role
   *
   * @example
   * createUser(name, role)
   */
  createUser(name: string, role: string): void {
    console.log(`Creating ${name} as ${role}`);
  }
}