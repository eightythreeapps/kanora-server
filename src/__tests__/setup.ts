import { PrismaClient } from '@prisma/client';
import '@jest/globals';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../../.env.test') });

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
}

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test setup
beforeAll(async () => {
  // Initialize test database connection
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});

// Global test teardown
afterAll(async () => {
  // Clean up test database
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    // Add cleanup logic here if needed
  } catch (error) {
    console.error('Failed to clean up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}); 