// This file extends the Express Request interface to include the user property
// which is attached by the authMiddleware. This provides type safety.

declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      name: string;
      email: string;
      role: 'System Administrator' | 'Normal User' | 'Store Owner';
      storeId?: number;
    };
  }
}
