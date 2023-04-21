import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTUser } from './jwt.types';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	login(user: { id: string }): string {
		const payload = { id: user.id };

		return `Bearer ${this.jwtService.sign(payload)}`;
	}

	getUserFromToken(token: string): JWTUser {
		const pureToken = token.split('Bearer ').join('');
		this.jwtService.verify(pureToken);

		return this.jwtService.decode(pureToken) as JWTUser;
	}
}
