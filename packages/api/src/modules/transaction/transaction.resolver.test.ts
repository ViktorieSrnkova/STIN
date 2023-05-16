import { Test, TestingModule } from '@nestjs/testing';
import { JWTUser } from 'modules/auth/jwt.types';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Currency, TransactionType, Transaction } from '@prisma/client';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';

// Mock the necessary dependencies
jest.mock('./transaction.service');

describe('TransactionResolver', () => {
	let transactionResolver: TransactionResolver;
	let transactionService: TransactionService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TransactionResolver, TransactionService, PrismaService],
		}).compile();

		transactionResolver = module.get<TransactionResolver>(TransactionResolver);
		transactionService = module.get<TransactionService>(TransactionService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	describe('myTransactions', () => {
		it('should return an array of TransactionDto', async () => {
			// Mock the dependencies
			const user = { id: 'user_id' } as JWTUser;
			const expectedResult = [new TransactionDto(), new TransactionDto()];
			jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(
				expectedResult.map(transactionDtoToTransaction),
			);

			// Call the resolver method
			const result = await transactionResolver.myTransactions(user);

			// Assertions
			expect(result).toEqual(expectedResult);
			expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
				where: { userId: user.id },
				orderBy: { createdAt: 'desc' },
			});
		});
	});

	describe('createTransaction', () => {
		it('should return a boolean value', async () => {
			// Mock the dependencies
			const user = { id: 'user_id' } as JWTUser;
			const amount = 10.5;
			const type = TransactionType.DEPOSIT;
			const currency = Currency.USD;
			const fromAccountNumber = 'from_account_number';
			const toAccountNumber = 'to_account_number';
			const expectedResult = true;
			jest.spyOn(transactionService, 'createTransaction').mockResolvedValue(expectedResult);

			// Call the resolver method
			const result = await transactionResolver.createTransaction(
				user,
				amount,
				type,
				fromAccountNumber,
				currency,
				toAccountNumber,
			);

			// Assertions
			expect(result).toBe(expectedResult);
			expect(transactionService.createTransaction).toHaveBeenCalledWith(
				user.id,
				amount,
				type,
				currency,
				fromAccountNumber,
				toAccountNumber,
			);
		});
	});

	describe('accounTransactions', () => {
		it('should return an array of TransactionDto', async () => {
			// Mock the dependencies
			const user = { id: 'user_id' } as JWTUser;
			const accountId = 'account_id';
			const expectedResult = [new TransactionDto(), new TransactionDto()];
			jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(
				expectedResult.map(transactionDtoToTransaction),
			);
			// Call the resolver method
			const result = await transactionResolver.accounTransactions(user, accountId);

			// Assertions
			expect(result).toEqual(expectedResult);
			expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
				where: {
					OR: [
						{ userId: user.id, fromAccountId: accountId },
						{ userId: user.id, toAccountId: accountId },
					],
				},
				orderBy: { createdAt: 'desc' },
			});
		});
	});
	function transactionDtoToTransaction(transactionDto: TransactionDto): Transaction {
		const transaction: Partial<Transaction> = {
			createdAt: transactionDto.createdAt,
			id: transactionDto.id,
			amount: transactionDto.amount,
			amount2: transactionDto.amount2,
			beforeAmount: transactionDto.beforeAmount,
			transactionType: transactionDto.transactionType,
			beforeCurrency: transactionDto.beforeCurrency,
			fromAccountId: transactionDto.fromAccountId,
			toAccountId: transactionDto.toAccountId,
		};
		return transaction as Transaction;
	}
});
