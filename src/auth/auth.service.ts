import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(config: ConfigService) {
    this.publicKey = config.get<string[]>('jwt.publicKey').join('\n');
    this.privateKey = config.get<string[]>('jwt.privateKey').join('\n'); // cambiar las keys de jwt
    this.issuer = config.get<string>('jwt.issuer');
    this.audience = config.get<string>('jwt.audience');
    this.expiresIn = config.get<string>('jwt.expiresIn');
    this.verifyToken = {
      issuer: this.issuer,
      audience: this.audience,
      algorithm: 'RS512',
    };
  }

  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly expiresIn: string;
  private readonly verifyToken: {
    issuer: string;
    audience: string;
    algorithm: string;
  };

  async validateRole(request): Promise<boolean> {
    try {
      const token: string = request.headers.authorization.substr(7);
      const decodedToken: any = this.decodeToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  generateToken({ payload, subject }, expiresIn = this.expiresIn): string {
    const signOptions: object = {
      issuer: this.issuer,
      subject,
      audience: this.audience,
      expiresIn,
      algorithm: 'RS512',
    };

    return jwt.sign(payload, this.privateKey, signOptions);
  }

  decodeToken(token) {
    return jwt.verify(token, this.publicKey, this.verifyToken);
  }
}
