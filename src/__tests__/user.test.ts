import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository';

describe('User Registration API', () => {
  let app: Express;
  let prisma: PrismaClient;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await createApp();
    prisma = new PrismaClient();
    userRepository = new UserRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up tables in the correct order to handle foreign key constraints
    await prisma.playlist.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/users/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(validUser.email);
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data.isVerified).toBe(false);
    });

    it('should not allow duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      // Attempt duplicate registration
      const response = await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email already exists');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          ...validUser,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email address');
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          ...validUser,
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Password must be at least 8 characters long');
    });
  });

  describe('POST /api/v1/users/verify-email', () => {
    it('should verify email with valid token', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'verify@example.com',
          password: 'Password123!',
        });

      // Get the user from database to get the verification token
      const user = await userRepository.findByEmail('verify@example.com');
      expect(user).toBeTruthy();
      expect(user?.verifyToken).toBeTruthy();

      // Verify email
      const response = await request(app)
        .post('/api/v1/users/verify-email')
        .send({ token: user?.verifyToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isVerified).toBe(true);
      expect(response.body.data.verifyToken).toBeNull();
    });

    it('should reject invalid verification token', async () => {
      const response = await request(app)
        .post('/api/v1/users/verify-email')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid verification token');
    });
  });
}); 