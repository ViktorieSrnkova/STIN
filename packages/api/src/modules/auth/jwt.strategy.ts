import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ENV_JWT_SECRET } from 'const/env';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTUser } from './jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: ENV_JWT_SECRET,
		});
	}

	validate(payload: any): JWTUser {
		return {
			id: payload.id,
			email: payload.email,
		} as JWTUser;
	}
}
