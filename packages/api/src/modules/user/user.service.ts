import { Injectable } from '@nestjs/common';
import { PrismaService } from 'modules/prisma/prisma.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { EmailService } from 'modules/email.service';
import { AuthService } from 'modules/auth/auth.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService) {}

	async createUser(email: string, password: string): Promise<boolean> {
		const pswHash = await bcrypt.hash(password, SALT_ROUNDS);
		try {
			await this.prismaService.user.create({
				data: {
					email,
					password: pswHash,
					firstName: `First name${new Date()}`,
					secondName: `Second name${new Date()}`,
				},
			});

			return true;
		} catch {
			return false;
		}
	}

	async loginUserAuthGenCode(email: string, password: string): Promise<boolean> {
		const dbUser = await this.prismaService.user.findUniqueOrThrow({
			where: { email },
			select: { password: true, id: true },
		});

		const compareResponse = await bcrypt.compare(password, dbUser.password);

		if (!compareResponse) {
			return false;
		}

		const authCode = `${crypto.randomInt(1000, 9999)}`;
		await this.prismaService.userAuthCode.updateMany({ where: { userId: dbUser.id }, data: { isUsed: true } });
		await this.prismaService.userAuthCode.create({ data: { code: authCode, userId: dbUser.id } });
		await EmailService.send(email, 'BANK LOGIN CODE', `Login code: ${authCode}`);

		return true;
	}

	async loginUserAuthCode(email: string, password: string, code: string): Promise<string> {
		const dbUser = await this.prismaService.user.findUniqueOrThrow({
			where: { email },
			select: { password: true, id: true },
		});

		const compareResponse = await bcrypt.compare(password, dbUser.password);

		if (!compareResponse) {
			return '';
		}

		const dbAuthCode = await this.prismaService.userAuthCode.findFirst({
			where: { userId: dbUser.id, isUsed: false },
		});

		if (code === dbAuthCode?.code) {
			await this.prismaService.userAuthCode.updateMany({ where: { userId: dbUser.id }, data: { isUsed: true } });
			return this.authService.login({ id: dbUser.id });
		}

		return 'nok';
	}
}
