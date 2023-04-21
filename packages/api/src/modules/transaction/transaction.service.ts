import { Injectable } from '@nestjs/common';
import { Currency, TransactionType } from '@prisma/client';
import { PrismaService } from 'modules/prisma/prisma.service';

@Injectable()
export class TransactionService {
	constructor(private readonly prismaService: PrismaService) {}

	async getBalance(
		accountId: string,
		transaction?: Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>,
	): Promise<number> {
		const connection = transaction ?? this.prismaService;
		const [withdrawal, depoit] = await Promise.all([
			connection.transaction.aggregate({
				_sum: {
					amount: true,
				},
				where: {
					OR: [
						{ transactionType: TransactionType.WITHDRAWAL },
						{ transactionType: TransactionType.TRANSFER },
					],
					fromAccountId: accountId,
				},
			}),
			connection.transaction.aggregate({
				_sum: {
					amount: true,
				},
				where: {
					OR: [{ transactionType: TransactionType.DEPOSIT }, { transactionType: TransactionType.TRANSFER }],
					toAccountId: accountId,
				},
			}),
			0,
		]);

		return (withdrawal._sum.amount ?? 0) * -1 + (depoit._sum.amount ?? 0);
	}

	async createTransaction(
		userId: string,
		amount: number,
		type: TransactionType,
		currency?: Currency,
		fromAccountNumber?: string,
		toAccountNumber?: string,
	): Promise<boolean> {
		if (currency) {
			const lastRate = await this.prismaService.exRate.findFirstOrThrow({
				where: { currency },
				orderBy: { createdAt: 'desc' },
			});
			// eslint-disable-next-line no-console
			console.log(lastRate.exRate);
		}

		if (fromAccountNumber === toAccountNumber) {
			throw new Error('Source and target account must be different');
		}
		if (amount <= 0) {
			throw new Error('Amount must be greater than 0');
		}

		if (type === TransactionType.WITHDRAWAL) {
			await this.prismaService.$transaction(async tx => {
				const account = await tx.account.findFirst({ where: { accountNumber: fromAccountNumber, userId } });
				if (!account) {
					throw new Error('Account not found');
				}
				const balance = await this.getBalance(account.id, tx);

				if (balance < amount) {
					throw new Error('Insufficient funds');
				}
				await tx.transaction.create({
					data: {
						amount,
						transactionType: TransactionType.WITHDRAWAL,
						fromAccountId: account.id,
						userId,
					},
				});

				return true;
			});

			return true;
		}

		if (type === TransactionType.DEPOSIT) {
			await this.prismaService.$transaction(async tx => {
				const account = await tx.account.findFirst({ where: { accountNumber: fromAccountNumber, userId } });
				if (!account) {
					throw new Error('Account not found');
				}
				await tx.transaction.create({
					data: {
						amount,
						transactionType: TransactionType.DEPOSIT,
						toAccountId: account.id,
						userId,
					},
				});
			});

			return true;
		}

		if (type === TransactionType.TRANSFER) {
			await this.prismaService.$transaction(async tx => {
				const account1 = await tx.account.findFirst({ where: { accountNumber: fromAccountNumber, userId } });
				if (!account1) {
					throw new Error('Source account not found');
				}
				const balance = await this.getBalance(account1.id, tx);

				if (balance < amount) {
					throw new Error('Insufficient funds');
				}

				const account2 = await tx.account.findFirst({ where: { accountNumber: toAccountNumber } });
				if (!account2) {
					throw new Error('Target account not found');
				}
				await tx.transaction.create({
					data: {
						amount,
						transactionType: TransactionType.TRANSFER,
						fromAccountId: account1.id,
						toAccountId: account2.id,
						userId,
					},
				});
			});

			return true;
		}

		return Promise.resolve(true);
	}
}
