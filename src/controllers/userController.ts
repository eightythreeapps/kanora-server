import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { ValidationError } from '../utils/errors';

export class UserController {
  constructor(private userService: UserService) {}

  static validationRules = {
    register: [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    ],
    verifyEmail: [
      body('token')
        .notEmpty()
        .withMessage('Verification token is required'),
    ],
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      throw new ValidationError(errorMessages.join(', '));
    }

    const { email, password, name } = req.body;
    const user = await this.userService.register({ email, password, name });

    // Remove sensitive data before sending response
    const { password: _, ...userResponse } = user;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: userResponse,
    });
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      throw new ValidationError(errorMessages.join(', '));
    }

    const { token } = req.body;
    const user = await this.userService.verifyEmail(token);

    // Remove sensitive data before sending response
    const { password: _, ...userResponse } = user;

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
      data: userResponse,
    });
  };
} 