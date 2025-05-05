/**
 * Enhanced error logging utilities for terminal output
 */

/**
 * Log API errors with detailed information
 */
export const logApiError = (error: any): void => {
  console.error('\n=== API ERROR ===');
  console.error(`Request URL: ${error.config?.url}`);
  console.error(`Request Method: ${error.config?.method?.toUpperCase()}`);
  
  if (error.response) {
    // The request was made and the server responded with a status code outside of 2xx
    console.error(`Status: ${error.response.status} ${error.response.statusText}`);
    console.error('Response headers:', error.response.headers);
    console.error('Response data:', error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Error message:', error.message);
  }
  
  console.error('Error stack:', error.stack);
  console.error('=================\n');
};

/**
 * Log React Query errors with detailed information
 */
export const logQueryError = (error: unknown): void => {
  console.error('\n=== QUERY ERROR ===');
  if (error instanceof Error) {
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
  } else {
    console.error('Unknown error:', error);
  }
  console.error('===================\n');
};

/**
 * Log general application errors
 */
export const logAppError = (error: unknown, context?: string): void => {
  console.error(`\n=== APP ERROR ${context ? `(${context})` : ''} ===`);
  if (error instanceof Error) {
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
  } else {
    console.error('Unknown error:', error);
  }
  console.error('===================\n');
}; 