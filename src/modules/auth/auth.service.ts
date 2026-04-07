import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { User, UserDocument } from '../../../common/entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { UnauthorizedException, ConflictException } from '../../../common/exceptions/app.exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ 
      email: registerDto.email 
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await hash(registerDto.password, 10);
    
    const newUser = new this.userModel({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: hashedPassword,
      role: 'USER',
    });

    return newUser.save();
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role,
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    // Remove password from returned user object
    const { password, ...userWithoutPassword } = user.toObject();
    
    return {
      user: userWithoutPassword as User,
      accessToken,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    Object.assign(user, updateData);
    user.updatedAt = new Date();
    
    return user.save();
  }
}
