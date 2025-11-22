/**
 * Example: API-based storage implementation
 * This is a reference implementation showing how to create custom storage
 * that syncs with a backend API
 * 
 * @example
 * ```typescript
 * class MyApiStorage implements CartStorage {
 *   private userId: string;
 *   private apiUrl: string;
 * 
 *   constructor(userId: string, apiUrl: string = '/api/cart') {
 *     this.userId = userId;
 *     this.apiUrl = apiUrl;
 *   }
 * 
 *   save(state: CartState): void {
 *     // Fire and forget - sync in background
 *     fetch(`${this.apiUrl}/${this.userId}`, {
 *       method: 'PUT',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(state),
 *     }).catch(error => {
 *       console.error('Failed to sync cart to API:', error);
 *     });
 *   }
 * 
 *   load(): CartState | null {
 *     // Cannot return async result synchronously
 *     // Load initial state separately before creating manager
 *     return null;
 *   }
 * 
 *   clear(): void {
 *     fetch(`${this.apiUrl}/${this.userId}`, {
 *       method: 'DELETE',
 *     }).catch(error => {
 *       console.error('Failed to clear cart from API:', error);
 *     });
 *   }
 * }
 * 
 * // Usage:
 * const storage = new MyApiStorage('user-123');
 * const manager = createCartManager({ storage });
 * ```
 */

// This is an example file showing how to implement custom CartStorage
// The types are referenced in the JSDoc comments above
export {};

