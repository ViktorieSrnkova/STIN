/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import { Currency, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
	constructor(private readonly prismaService: PrismaService) {}

	async getBalance(
		accountId?: string,
		transaction?: Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>,
	): Promise<number> {
		const connection = transaction ?? this.prismaService;
		const dbtransaction = await connection?.transaction.findMany({
			where: { OR: [{ toAccountId: accountId }, { fromAccountId: accountId }] },
		});
		let status = 0;
		dbtransaction.forEach(element => {
			if (element.transactionType === 'DEPOSIT') {
				status += element.amount;
			} else if (element.transactionType === 'WITHDRAWAL') {
				status -= element.amount;
			} else if (element.transactionType === 'TRANSFER') {
				if (element.toAccountId === accountId) {
					status += element.amount;
				} else {
					status -= element.amount2;
				}
			}
		});
		return status;
	}
	async getAcountCurrency(accountId: string): Promise<string> {
		const acc = await this.prismaService.account.findFirst({ where: { id: accountId } });
		return acc?.currency ?? 'eror';
	}

	async getExRate(currency1?: Currency, currency2?: Currency): Promise<number> {
		if (currency1 !== 'CZK' && currency2 !== 'CZK' && currency1 !== currency2) {
			const rate1 = await this.prismaService.exRate.findFirstOrThrow({
				where: { currency: currency1 },
				orderBy: { createdAt: 'desc' },
			});
			const rate2 = await this.prismaService.exRate.findFirstOrThrow({
				where: { currency: currency2 },
				orderBy: { createdAt: 'desc' },
			});

			return rate1.exRate / rate2.exRate;
		}
		if (currency1 === 'CZK' && currency1 !== currency2) {
			const rateFromCZK = await this.prismaService.exRate.findFirstOrThrow({
				where: { currency: currency2 },
				orderBy: { createdAt: 'desc' },
			});

			return 1 / rateFromCZK.exRate; // 150kč na dolary --> 150* (1/rate)
		}
		if (currency2 === 'CZK' && currency1 !== currency2) {
			const rateToCZK = await this.prismaService.exRate.findFirstOrThrow({
				where: { currency: currency1 },
				orderBy: { createdAt: 'desc' }, // 1$ == 21Kč --> 15$ na ceskej ucet 15* rate
			});
			return rateToCZK.exRate;
		}
		return 1;
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
			const toAcc = await this.prismaService.account.findFirst({
				where: { accountNumber: toAccountNumber },
			});
			const fromAcc = await this.prismaService.account.findFirst({
				where: { accountNumber: fromAccountNumber },
			});

			if (fromAccountNumber === toAccountNumber) {
				throw new Error('Účty se nemohou shodovat');
			}
			if (amount <= 0) {
				throw new Error('Hodnota musí být vyšší než 0');
			}

			if (type === TransactionType.WITHDRAWAL) {
				await this.prismaService.$transaction(async tx => {
					const account = await tx.account.findFirst({
						where: { accountNumber: fromAccountNumber, userId },
					});

					const newAmount =
						Math.round(amount * (await this.getExRate(currency, fromAcc?.currency)) * 100) / 100;

					if (!account) {
						throw new Error('Tento účet nebyl nalezen');
					}

					const balance = await this.getBalance(account.id, tx);
					const contocorentBalance = balance + balance * 0.1;

					if (contocorentBalance < newAmount && account.currency === 'CZK') {
						throw new Error('Nedostatek financí');
					} else if (balance < newAmount && newAmount < contocorentBalance) {
						const negative = (newAmount - balance) * 0.1;
						await tx.transaction.create({
							data: {
								amount: newAmount + negative,
								beforeAmount: amount,
								beforeCurrency: currency,
								transactionType: TransactionType.WITHDRAWAL,
								fromAccountId: account.id,
								userId,
							},
						});
					} else if (contocorentBalance < newAmount && account.currency !== 'CZK') {
						const czechAcc = await tx.account.findFirst({
							where: { currency: 'CZK' },
						});
						if (!czechAcc) {
							throw new Error('Neexistuje český účet');
						}
						const balanceCZ = await this.getBalance(czechAcc?.id, tx);
						const contocorentBalanceCZ = balanceCZ + balanceCZ * 0.1;
						const czechAmount =
							Math.round(amount * (await this.getExRate(currency, czechAcc?.currency)) * 100) / 100;
						if (contocorentBalanceCZ < czechAmount) {
							throw new Error('Není dostatečný zůstatek pro provedení platby');
						}
						if (balanceCZ < czechAmount) {
							const negativeCZ = (czechAmount - balanceCZ) * 0.1;
							await tx.transaction.create({
								data: {
									amount: czechAmount + negativeCZ,
									beforeAmount: amount,
									beforeCurrency: currency,
									transactionType: TransactionType.WITHDRAWAL,
									fromAccountId: czechAcc?.id,
									userId,
								},
							});
						} else {
							await tx.transaction.create({
								data: {
									amount: czechAmount,
									beforeAmount: amount,
									beforeCurrency: currency,
									transactionType: TransactionType.WITHDRAWAL,
									fromAccountId: czechAcc?.id,
									userId,
								},
							});
						}
					} else {
						await tx.transaction.create({
							data: {
								amount: newAmount,
								beforeAmount: amount,
								beforeCurrency: currency,
								transactionType: TransactionType.WITHDRAWAL,
								fromAccountId: account.id,
								userId,
							},
						});
					}

					return true;
				});

				return true;
			}

			if (type === TransactionType.DEPOSIT) {
				await this.prismaService.$transaction(async tx => {
					const account = await tx.account.findFirst({
						where: { accountNumber: toAccountNumber, userId },
					});
					if (!account) {
						throw new Error('Účet nenalezen');
					}

					await tx.transaction.create({
						data: {
							amount: Math.round(amount * (await this.getExRate(currency, toAcc?.currency)) * 100) / 100,
							beforeAmount: amount,
							beforeCurrency: currency,
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
					const account1 = await tx.account.findFirst({
						where: { accountNumber: fromAccountNumber, userId },
					});

					const newAmount =
						Math.round(amount * (await this.getExRate(currency, fromAcc?.currency)) * 100) / 100;
					if (!account1) {
						throw new Error('Účet odesílatele nenalezen');
					}
					const balance = await this.getBalance(account1.id, tx);
					const account2 = await tx.account.findFirst({ where: { accountNumber: toAccountNumber } });

					if (!account2) {
						throw new Error('Cílový účet nenalezen');
					}
					const contocorentBalance = balance + balance * 0.1;

					if (contocorentBalance < newAmount && account1.currency === 'CZK') {
						throw new Error('Nedostatek financí');
					} else if (balance < newAmount && newAmount < contocorentBalance) {
						const negative = (newAmount - balance) * 0.1;
						await tx.transaction.create({
							data: {
								amount:
									Math.round(amount * (await this.getExRate(currency, toAcc?.currency)) * 100) / 100,
								amount2: newAmount + negative,
								beforeAmount: amount,
								beforeCurrency: currency,
								transactionType: TransactionType.TRANSFER,
								fromAccountId: account1.id,
								toAccountId: account2.id,
								userId,
							},
						});
					} else if (balance < newAmount && account1.currency !== 'CZK') {
						const czechAcc = await tx.account.findFirst({
							where: { currency: 'CZK' },
						});
						if (!czechAcc) {
							throw new Error('Nedostatek financí a český účet neexistuje');
						}
						const balanceCZ = await this.getBalance(czechAcc?.id, tx);
						const czechAmount = amount * (await this.getExRate(currency, 'CZK'));
						const czechAmountF = Math.round(czechAmount * 100) / 100;
						const contocorentBalanceCZ = balanceCZ + balanceCZ * 0.1;

						const czechAmountT =
							Math.round(amount * (await this.getExRate(currency, account2?.currency)) * 100) / 100;
						if (contocorentBalanceCZ < czechAmount) {
							throw new Error('Není dostatečný zůstatek pro provedení platby');
						}
						if (balanceCZ < czechAmount) {
							const negativeCZ = (czechAmount - balanceCZ) * 0.1;
							await tx.transaction.create({
								data: {
									amount: czechAmountT,
									amount2: czechAmountF + negativeCZ,
									beforeAmount: amount,
									beforeCurrency: currency,
									transactionType: TransactionType.TRANSFER,
									fromAccountId: czechAcc?.id,
									toAccountId: account2.id,
									userId,
								},
							});
						} else {
							await tx.transaction.create({
								data: {
									amount: czechAmountT,
									amount2: czechAmountF,
									transactionType: TransactionType.TRANSFER,
									fromAccountId: czechAcc?.id,
									toAccountId: account2.id,
									userId,
									beforeCurrency: currency,
									beforeAmount: amount,
								},
							});
						}
					} else {
						await tx.transaction.create({
							data: {
								amount:
									Math.round(amount * (await this.getExRate(currency, toAcc?.currency)) * 100) / 100,
								amount2:
									Math.round(amount * (await this.getExRate(currency, fromAcc?.currency)) * 100) /
									100,
								transactionType: TransactionType.TRANSFER,
								fromAccountId: account1.id,
								toAccountId: account2.id,
								userId,
								beforeCurrency: currency,
								beforeAmount: amount,
							},
						});
					}
				});

				return true;
			}
		}

		return Promise.resolve(true);
	}
}
