import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import crypto from 'crypto';
import { PrismaService } from 'modules/prisma/prisma.service';

@Injectable()
export class AccountService {
	constructor(private readonly prismaService: PrismaService) {}
	async createAccount(userId: string, currency: Currency): Promise<boolean> {
		const accountNumber = `${crypto.randomInt(10000, 99999)}`;
		await this.prismaService.account.create({
			data: {
				currency,
				userId,
				accountNumber,
			},
		});

		return true;
	}
}
