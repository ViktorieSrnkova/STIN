/* eslint-disable no-else-return */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'modules/prisma/prisma.service';
import { TransactionService } from './transaction.service';

class PrismaServiceMock extends PrismaService {
	mockTransaction = {
		aggregate: jest.fn(),
		findUnique: jest.fn(),
		findUniqueOrThrow: jest.fn(),
		findFirst: jest.fn(),
		findFirstOrThrow: jest.fn(),
		findMany: jest.fn(),
		create: jest.fn(),
		createMany: jest.fn(),
		delete: jest.fn(),
		update: jest.fn(),
		deleteMany: jest.fn(),
		updateMany: jest.fn(),
		upsert: jest.fn(),
		count: jest.fn(),
		groupBy: jest.fn(),
		// Add other missing properties and methods based on the 'TransactionDelegate' type
	};
	async disconnect(): Promise<void> {
		await this.$disconnect();
	}
}

describe('TransactionService', () => {
	let transactionService: TransactionService;
	// let prismaService: PrismaService;
	let prismaMock: PrismaServiceMock;

	beforeEach(() => {
		prismaMock = new PrismaServiceMock();
		transactionService = new TransactionService(prismaMock);
	});

	afterEach(async () => {
		await prismaMock.$disconnect();
		jest.resetAllMocks();
	});

	describe('getBalance', () => {
		it('should calculate the balance correctly', async () => {
			const accountId = 'exampleAccountId';
			const withdrawalAmount = 200;
			const depositAmount = 200;

			prismaMock.mockTransaction.aggregate.mockResolvedValueOnce({ _sum: { amount: withdrawalAmount } });
			prismaMock.mockTransaction.aggregate.mockResolvedValueOnce({ _sum: { amount: depositAmount } });

			const balance = await transactionService.getBalance(accountId, prismaMock);

			const expectedBalance = (depositAmount ?? 0) - (withdrawalAmount ?? 0);
			expect(balance).toBe(expectedBalance);
		});

		it('should return 0 if there are no transactions', async () => {
			const accountId = 'exampleAccountId';

			prismaMock.mockTransaction.aggregate.mockResolvedValueOnce(null);

			const balance = await transactionService.getBalance(accountId, prismaMock);

			expect(balance).toBe(0);
			expect(prismaMock.mockTransaction.aggregate).toHaveBeenCalledTimes(0);
		});
		it('should calculate the overall balance when accountId is not provided', async () => {
			const withdrawalAmount = 200;
			const depositAmount = 300;

			prismaMock.mockTransaction.aggregate.mockResolvedValueOnce({ _sum: { amount: withdrawalAmount } });
			prismaMock.mockTransaction.aggregate.mockResolvedValueOnce({ _sum: { amount: depositAmount } });

			const balance = await transactionService.getBalance(undefined, prismaMock);

			expect(balance).toBe(473.5);
		});
	});
	describe('getAccountCurrency', () => {
		it('should return the account currency when it exists', async () => {
			const mockAccount = { currency: 'USD' };

			// Mock the PrismaService account.findFirst() method to return a valid account
			prismaMock.account.findFirst = jest.fn().mockResolvedValueOnce(mockAccount);

			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method and assert the result
			const result = await yourObject.getAcountCurrency('account123');
			expect(result).toBe('USD');

			// Verify that account.findFirst was called with the correct parameters
			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(1);
			expect(prismaMock.account.findFirst).toHaveBeenCalledWith({ where: { id: 'account123' } });
		});

		it('should return "error" when the account does not exist', async () => {
			// Mock the PrismaService account.findFirst() method to return null
			prismaMock.account.findFirst = jest.fn().mockResolvedValueOnce(null);

			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method and assert the result
			const result = await yourObject.getAcountCurrency('account123');
			expect(result).toBe('eror');

			// Verify that account.findFirst was called with the correct parameters
			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(1);
			expect(prismaMock.account.findFirst).toHaveBeenCalledWith({ where: { id: 'account123' } });
		});
		it('should return the account currency when the account exists', () => {
			const mockAccount = {
				id: 'account123',
				currency: 'USD',
				accountNumber: '1234567890',
				userId: 'user123',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = 'USD';

			expect(result).toBe(mockAccount.currency);
		});
	});
	describe('getExRate', () => {
		it('should return 1 when currency1 is the same as currency2', async () => {
			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method with the same currency and assert the result
			const result = await yourObject.getExRate('USD', 'USD');
			expect(result).toBe(1);
		});
		it('should return 1 when both currencies are CZK', async () => {
			const yourObject = new TransactionService(prismaMock);

			const result = await yourObject.getExRate('CZK', 'CZK');

			expect(result).toBe(1);
		});

		it('should return the correct exchange rate when both currencies are not CZK', async () => {
			const mockRate1 = { exRate: 1.2 }; // Replace with a suitable mock rate
			const mockRate2 = { exRate: 0.8 }; // Replace with a suitable mock rate

			// Mock the PrismaService exRate.findFirstOrThrow() method to return the mock rates
			prismaMock.exRate.findFirstOrThrow = jest
				.fn()
				.mockResolvedValueOnce(mockRate1)
				.mockResolvedValueOnce(mockRate2);

			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method and assert the result
			const result = await yourObject.getExRate('USD', 'EUR'); // Replace with suitable currencies
			expect(result).toBe(mockRate1.exRate / mockRate2.exRate);

			// Verify that exRate.findFirstOrThrow was called with the correct parameters
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledTimes(2);
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledWith({
				where: { currency: 'USD' },
				orderBy: { createdAt: 'desc' },
			});
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledWith({
				where: { currency: 'EUR' },
				orderBy: { createdAt: 'desc' },
			});
		});

		it('should return the correct exchange rate when currency1 is CZK', async () => {
			const mockRateFromCZK = { exRate: 0.007 }; // Replace with a suitable mock rate

			// Mock the PrismaService exRate.findFirstOrThrow() method to return the mock rate from CZK
			prismaMock.exRate.findFirstOrThrow = jest.fn().mockResolvedValueOnce(mockRateFromCZK);

			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method with currency1 as CZK and assert the result
			const result = await yourObject.getExRate('CZK', 'USD'); // Replace with a suitable currency
			expect(result).toBe(1 / mockRateFromCZK.exRate);

			// Verify that exRate.findFirstOrThrow was called with the correct parameters
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledTimes(1);
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledWith({
				where: { currency: 'USD' },
				orderBy: { createdAt: 'desc' },
			});
		});
		it('should return the correct exchange rate when currency2 is CZK', async () => {
			const mockRateToCZK = { exRate: 21 }; // Replace with a suitable mock rate
			// Mock the PrismaService exRate.findFirstOrThrow() method to return the mock rate to CZK
			prismaMock.exRate.findFirstOrThrow = jest.fn().mockResolvedValueOnce(mockRateToCZK);

			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name

			// Invoke the method with currency2 as CZK and assert the result
			const result = await yourObject.getExRate('USD', 'CZK'); // Replace with a suitable currency
			expect(result).toBe(mockRateToCZK.exRate);

			// Verify that exRate.findFirstOrThrow was called with the correct parameters
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledTimes(1);
			expect(prismaMock.exRate.findFirstOrThrow).toHaveBeenCalledWith({
				where: { currency: 'USD' },
				orderBy: { createdAt: 'desc' },
			});
		});

		it('should return 1 by default', async () => {
			// Instantiate the object under test
			const yourObject = new TransactionService(prismaMock); // Replace YourClass with the actual class name
			// Invoke the method without specifying currencies and assert the result
			const result = await yourObject.getExRate();
			expect(result).toBe(1);
		});
	});
	describe('createTransaction', () => {
		it('should throw an error if the fromAccount is not found', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'nonexistentAccountNumber';

			const mockFindFirst = jest.fn().mockResolvedValue(null);
			prismaMock.account.findFirst = mockFindFirst as any;

			await expect(
				transactionService.createTransaction(userId, amount, type, currency, fromAccountNumber),
			).rejects.toThrowError('Tento účet nebyl nalezen');

			expect(mockFindFirst).toHaveBeenCalledTimes(3);
			expect(mockFindFirst).toHaveBeenCalledWith({
				where: { accountNumber: fromAccountNumber },
			});
		});
		it('should throw an error if the toAccount is not found (for transfer)', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'TRANSFER';
			const currency = 'USD';
			const fromAccountNumber = 'exampleFromAccountNumber';
			const toAccountNumber = 'nonexistentAccountNumber';

			const fromAccount = { id: 'exampleFromAccountId', currency: 'USD', balance: 50 };

			const mockFindFirst = jest.fn();
			mockFindFirst.mockResolvedValueOnce(fromAccount).mockResolvedValueOnce(null);
			prismaMock.account.findFirst = mockFindFirst as any;

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					toAccountNumber,
					fromAccountNumber,
				),
			).rejects.toThrowError('Účet odesílatele nenalezen');

			expect(mockFindFirst).toHaveBeenCalledTimes(4);
			expect(mockFindFirst).toHaveBeenCalledWith({
				where: { accountNumber: toAccountNumber },
			});
		});
		it('should throw an error if the withdrawal amount exceeds the account balance', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'exampleFromAccountNumber';

			const fromAccount = { id: 'exampleFromAccountId', currency: 'CZK', balance: 50 };

			const mockFindFirst = jest.fn().mockResolvedValue(fromAccount);
			prismaMock.account.findFirst = mockFindFirst as any;

			await expect(
				transactionService.createTransaction(userId, amount, type, currency, fromAccountNumber),
			).rejects.toThrowError('Nedostatek financí');

			expect(mockFindFirst).toHaveBeenCalledTimes(3);
			expect(mockFindFirst).toHaveBeenCalledWith({
				where: { accountNumber: fromAccountNumber },
			});
		});

		it('should create a withdrawal transaction', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'exampleFromAccountNumber';

			const fromAccount = { id: 'exampleFromAccountId', currency: 'USD', balance: 50 };

			const mockFindFirst = jest.fn().mockResolvedValue(fromAccount);
			prismaMock.account.findFirst = mockFindFirst as any;

			prismaMock.$transaction = jest.fn().mockImplementation(async callback => {
				await callback(prismaMock);
			});

			await expect(
				transactionService.createTransaction(userId, amount, type, currency, fromAccountNumber),
			).rejects.toThrow('Nedostatek financí na českém účtu');

			expect(mockFindFirst).toHaveBeenCalledTimes(4);
			expect(mockFindFirst).toHaveBeenCalledWith({
				where: { accountNumber: fromAccountNumber },
			});
		});
		it('should create a deposit transaction', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'DEPOSIT';
			const currency = 'USD';
			const toAccountNumber = 'exampleToAccountNumber';

			const toAccount = { id: 'exampleToAccountId', currency: 'USD', balance: 0 };

			const mockFindFirst = jest.fn().mockResolvedValue(toAccount);
			prismaMock.account.findFirst = mockFindFirst as any;

			prismaMock.transaction.create = jest.fn().mockResolvedValue(true);

			await expect(
				transactionService.createTransaction(userId, amount, type, currency, undefined, toAccountNumber),
			).resolves.toBe(true);

			expect(mockFindFirst).toHaveBeenCalledTimes(3);
			expect(mockFindFirst).toHaveBeenCalledWith({
				where: { accountNumber: toAccountNumber },
			});

			expect(prismaMock.transaction.create).toHaveBeenCalledTimes(1);
			expect(prismaMock.transaction.create).toHaveBeenCalledWith({
				data: {
					amount,
					beforeAmount: amount,
					beforeCurrency: currency,
					transactionType: type,
					toAccountId: 'exampleToAccountId',
					userId,
				},
			});
		});
		it('should create a transfer transaction', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'TRANSFER';
			const currency = 'USD';
			const fromAccountNumber = 'exampleFromAccountNumber';
			const toAccountNumber = 'exampleToAccountNumber';

			const fromAccount = { id: 'exampleFromAccountId', currency: 'USD', balance: 50 };
			const czechAccount = { id: 'exampleCzechAccountId', currency: 'CZK', balance: 200 };

			const mockFindFirst = jest.fn();
			mockFindFirst
				.mockResolvedValueOnce(fromAccount)
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(czechAccount);
			prismaMock.account.findFirst = mockFindFirst as any;

			const mockTransactionCreate = jest.fn().mockResolvedValue(true);
			prismaMock.transaction.create = mockTransactionCreate;

			const mockGetExRate = jest.fn().mockResolvedValue(1.5);
			transactionService.getExRate = mockGetExRate;

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrow('Cílový účet nenalezen');

			expect(mockFindFirst).toHaveBeenCalledTimes(5);

			expect(mockFindFirst).toHaveBeenNthCalledWith(2, {
				where: { accountNumber: fromAccountNumber },
			});
			expect(mockFindFirst).toHaveBeenNthCalledWith(3, {
				where: { accountNumber: fromAccountNumber, userId },
			});

			expect(mockFindFirst).toHaveBeenNthCalledWith(4, {
				where: { currency: 'CZK' },
			});

			expect(mockGetExRate).toHaveBeenCalledTimes(1);

			expect(mockTransactionCreate).toHaveBeenCalledTimes(0);
		});

		it('should throw an error if the "fromAccountNumber" and "toAccountNumber" are the same', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = '123';
			const toAccountNumber = '123';

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrowError('Účty se nemohou shodovat');
		});
		it('should throw an error if the amount is less than or equal to 0', async () => {
			const userId = 'exampleUserId';
			const amount = 0;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = '123';
			const toAccountNumber = '456';

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrowError('Hodnota musí být vyšší než 0');
		});
		it('should throw an error if the "fromAccountNumber" does not exist', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'nonexistent';
			const toAccountNumber = '456';

			// Mock the PrismaService account.findFirst() method to return null for the "fromAccountNumber"
			prismaMock.account.findFirst = jest.fn().mockResolvedValueOnce(null);

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrowError('Tento účet nebyl nalezen');

			// Verify that account.findFirst was called with the correct parameters
			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(3);
			expect(prismaMock.account.findFirst).toHaveBeenCalledWith({
				where: { accountNumber: 'nonexistent', userId: 'exampleUserId' },
			});
		});
		it('should throw an error if the czech acc does not exist and the balance is low', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'nonexistent';
			const toAccountNumber = '456';

			// Mock the PrismaService account.findFirst() method to return null for the "fromAccountNumber"
			prismaMock.account.findFirst = jest.fn().mockResolvedValueOnce(null);

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrowError('Tento účet nebyl nalezen');

			// Verify that account.findFirst was called with the correct parameters
			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(3);
			expect(prismaMock.account.findFirst).toHaveBeenCalledWith({
				where: { accountNumber: 'nonexistent', userId: 'exampleUserId' },
			});
		});
		it('should throw an error if the czech acc does not exist and the balance is low', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'WITHDRAWAL';
			const currency = 'USD';
			const fromAccountNumber = 'exampleFromAccountNumber';

			const fromAccount = { id: 'exampleFromAccountId', currency: 'USD', balance: 50 };

			const mockFindFirst = jest.fn();
			mockFindFirst.mockImplementation(params => {
				if (params.where.currency === 'CZK') {
					return Promise.resolve(null); // Return null when currency is 'CZK'
					// eslint-disable-next-line no-else-return
				} else {
					return Promise.resolve(fromAccount); // Return the fromAccount when currency is not 'CZK'
				}
			});
			prismaMock.account.findFirst = mockFindFirst as any;

			const mockTransactionCreate = jest.fn().mockResolvedValue(true);
			prismaMock.transaction.create = mockTransactionCreate;

			const mockGetExRate = jest.fn().mockResolvedValue(1.5);
			transactionService.getExRate = mockGetExRate;

			await expect(
				transactionService.createTransaction(userId, amount, type, currency, fromAccountNumber),
			).rejects.toThrow('Neexistuje český účet');

			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(4);
		});
		it('should throw an error if the czech acc does not exist and the balance is low', async () => {
			const userId = 'exampleUserId';
			const amount = 100;
			const type = 'DEPOSIT';
			const currency = 'USD';
			const toAccountNumber = 'nonexistent';
			const fromAccountNumber = '456';

			// Mock the PrismaService account.findFirst() method to return null for the "fromAccountNumber"
			prismaMock.account.findFirst = jest.fn().mockResolvedValueOnce(null);

			await expect(
				transactionService.createTransaction(
					userId,
					amount,
					type,
					currency,
					fromAccountNumber,
					toAccountNumber,
				),
			).rejects.toThrowError('Účet nenalezen');

			// Verify that account.findFirst was called with the correct parameters
			expect(prismaMock.account.findFirst).toHaveBeenCalledTimes(3);
			expect(prismaMock.account.findFirst).toHaveBeenCalledWith({
				where: { accountNumber: 'nonexistent', userId: 'exampleUserId' },
			});
		});
	});
});
