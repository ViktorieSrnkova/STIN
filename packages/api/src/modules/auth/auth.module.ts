import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENV_JWT_EXPIRES_IN, ENV_JWT_SECRET } from 'const/env';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: ENV_JWT_SECRET,
			signOptions: {
				expiresIn: ENV_JWT_EXPIRES_IN,
			},
		}),
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
