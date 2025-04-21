import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../app';

export class TestUtils {
  private static prisma: PrismaClient;
  private static app: Express;

  static async initializeTestApp(): Promise<Express> {
    if (!this.app) {
      this.app = await createApp();
    }
    return this.app;
  }

  static async getPrismaClient(): Promise<PrismaClient> {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
    }
    return this.prisma;
  }

  static async clearDatabase(): Promise<void> {
    const prisma = await this.getPrismaClient();
    const tables = Reflect.ownKeys(prisma).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$')
    );

    for (const table of tables) {
      if (typeof table === 'string') {
        await (prisma as any)[table].deleteMany();
      }
    }
  }

  static async makeRequest(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    data?: any,
    token?: string
  ): Promise<request.Response> {
    const app = await this.initializeTestApp();
    const req = request(app)[method](url);

    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }

    if (data) {
      req.send(data);
    }

    return req;
  }

  static async createTestUser(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    const prisma = await this.getPrismaClient();
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Note: In real tests, this should be hashed
        name: data.name,
      },
    });
  }

  static async generateTestToken(userId: string): Promise<string> {
    const app = await this.initializeTestApp();
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    return response.body.token;
  }

  static async cleanup(): Promise<void> {
    if (this.prisma) {
      await this.clearDatabase();
      await this.prisma.$disconnect();
    }
  }
} 