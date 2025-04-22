import { PrismaClient, Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../utils/errors';

export type User = Prisma.UserGetPayload<{}>;

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  verifyToken: string;
}

export interface UpdateUserData {
  name?: string;
  password?: string;
  isVerified?: boolean;
  verifyToken?: string | null;
  resetToken?: string | null;
  lastLoginAt?: Date;
}

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          isVerified: false,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Email already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByVerifyToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { verifyToken: token },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { resetToken: token },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('User not found');
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.findByVerifyToken(token);
    if (!user) {
      throw new NotFoundError('Invalid verification token');
    }

    return this.update(user.id, {
      isVerified: true,
      verifyToken: null,
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.update(id, {
      lastLoginAt: new Date(),
    });
  }
} 