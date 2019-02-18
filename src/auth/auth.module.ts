import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from '../database/entities/teams.entity';
import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { Roles } from '../database/entities/roles.entity';

@Module({
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Teams, Roles]), ConfigModule],
  exports: [AuthService],
})
export class AuthModule {}
