import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
	imports: [AuthModule, PrismaModule],
	providers: [UserService, UserResolver],
	exports: [UserService],
})
export class UserModule {}
