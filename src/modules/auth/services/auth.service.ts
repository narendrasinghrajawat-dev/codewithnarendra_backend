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
import { UserDocument } from '../../../common/schemas/user.schema';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
} from '../dto/auth.dto';
import { ApiResponse } from '../../../common/dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      role: 'USER',
    });

    await user.save();

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return ApiResponse.success('User registered successfully', {
      user: this.sanitizeUser(user),
      tokens,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return ApiResponse.success('Login successful', {
      user: this.sanitizeUser(user),
      tokens,
    });
  }

  async logout(_userId: string) {
    // TODO: Implement token invalidation
    return ApiResponse.success('Logout successful');
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

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

    // TODO: Implement password reset email
    return ApiResponse.success('Password reset email sent');
  }

  async resetPassword(_resetPasswordDto: any) {
    // TODO: Implement password reset with token validation
    return ApiResponse.success('Password reset successful');
  }

  async verifyEmail(_token: string) {
    // TODO: Implement email verification
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
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}
