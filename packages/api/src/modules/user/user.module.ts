import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
	imports: [AuthModule, PrismaModule],
	providers: [UserService, UserResolver],
	exports: [UserService],
})
export class UserModule {}
