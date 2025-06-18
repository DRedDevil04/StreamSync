/**
 * Extend the Request interface to include the user property.
 */
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};
