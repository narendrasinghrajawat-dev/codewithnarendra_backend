import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../schemas/user.schema';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  ResetPasswordDto,
} from '../dto/auth.dto';
import { ApiResponse } from '../../../common/dto/response.dto';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { APP_CONSTANT } from '../../../common/constant/app_constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('RefreshToken') private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = this.generateToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      displayName: registerDto.displayName,
      role: APP_CONSTANT.ROLE.USER,
      isVerified: false,
      isActive: true,
      verificationToken,
      verificationTokenExpires, 
    });

    await user.save();

    // Send verification email (commented out for testing)
    // await this.emailService.sendVerificationEmail(user.email, verificationToken);

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return ApiResponse.success('User registered successfully. Please verify your email.', {
      user: this.sanitizeUser(user),
      tokens,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return ApiResponse.success('Login successful', {
      ...this.sanitizeUser(user),
      tokens,
    });
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for this user
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );

    return ApiResponse.success('Logout successful');
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      // Check if refresh token exists and is not revoked
      const storedToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
        userId: payload.sub, 
        isRevoked: false,
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await this.refreshTokenModel.findByIdAndUpdate(storedToken._id, { isRevoked: true });
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Revoke old refresh token
      await this.refreshTokenModel.findByIdAndUpdate(storedToken._id, { isRevoked: true });

      // Generate new tokens
      const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

      return ApiResponse.success('Tokens refreshed successfully', { tokens });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.generateToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return ApiResponse.success('Password reset email sent');
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetPasswordToken: resetPasswordDto.token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return ApiResponse.success('Password reset successful');
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

    await this.emailService.sendWelcomeEmail(user.email, user.firstName);

    return ApiResponse.success('Email verified successfully');
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return ApiResponse.success('Password changed successfully');
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ApiResponse.success('Profile retrieved successfully', this.sanitizeUser(user));
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { ...updateProfileDto, updatedAt: new Date() },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ApiResponse.success('Profile updated successfully', this.sanitizeUser(user));
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    } as any);

    // Store refresh token in database
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.refreshTokenModel.create({
      token: refreshToken,
      userId,
      isRevoked: false,
      expiresAt: refreshTokenExpires,
    });

    return { accessToken, refreshToken };
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    delete userObj.verificationTokenExpires;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordExpires;
    return userObj;
  }
}
