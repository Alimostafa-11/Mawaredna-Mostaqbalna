import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-auth.guard';

const BCRYPT_ROUNDS = 12;

// A syntactically valid hash that no password matches, used to keep the login
// timing similar whether or not the account exists.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.Ps4H0Yu1QZ7Vv5Kx3nWl2mQqTgS8Hpu';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminModel
      .findOne({ email: dto.email.toLowerCase(), isActive: true })
      .select('+passwordHash')
      .exec();

    const matches = await compare(dto.password, admin?.passwordHash ?? DUMMY_HASH);

    if (!admin || !matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const payload: JwtPayload = {
      sub: String(admin._id),
      email: admin.email,
      role: admin.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '7d'),
      user: {
        id: String(admin._id),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  hashPassword(plain: string): Promise<string> {
    return hash(plain, BCRYPT_ROUNDS);
  }

  async ensureAdminExists(email: string, password: string, name = 'Administrator') {
    const existing = await this.adminModel.findOne({ email: email.toLowerCase() }).exec();

    if (existing) {
      this.logger.log(`Admin ${email} already exists - skipping`);
      return existing;
    }

    const created = await this.adminModel.create({
      email: email.toLowerCase(),
      passwordHash: await this.hashPassword(password),
      name,
      role: 'admin',
    });

    this.logger.log(`Created admin account ${email}`);
    return created;
  }
}
