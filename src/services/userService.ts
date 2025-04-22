import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRepository, User, CreateUserData } from '../repositories/userRepository';
import { ValidationError } from '../utils/errors';

export interface RegisterUserData {
  email: string;
  password: string;
  name?: string;
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  private async validatePassword(password: string): Promise<void> {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    // Add more password validation rules as needed
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(data: RegisterUserData): Promise<User> {
    await this.validatePassword(data.password);

    const hashedPassword = await this.hashPassword(data.password);
    const verifyToken = this.generateVerificationToken();

    const userData: CreateUserData = {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      verifyToken,
    };

    const user = await this.userRepository.create(userData);

    // TODO: Send verification email using email service
    // await emailService.sendVerificationEmail(user.email, verifyToken);

    return user;
  }

  async verifyEmail(token: string): Promise<User> {
    return this.userRepository.verifyEmail(token);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
  }
} 