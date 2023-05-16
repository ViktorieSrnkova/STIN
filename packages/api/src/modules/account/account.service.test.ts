import { PrismaService } from 'modules/prisma/prisma.service';
import { Currency, Account } from '@prisma/client';
import crypto from 'crypto';
import { AccountService } from './account.service';

describe('AccountService', () => {
	let accountService: AccountService;
	let prismaService: PrismaService;

	beforeEach(() => {
		prismaService = new PrismaService();
		accountService = new AccountService(prismaService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createAccount', () => {
		it('should create an account and return true', async () => {
			// Arrange
			const userId = '123456';
			const currency: Currency = 'USD';
			const mockAccount: Account = {
				id: 'account-id',
				currency,
				userId,
				accountNumber: '12345',
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const prismaServiceCreateSpy = jest.spyOn(prismaService.account, 'create').mockResolvedValue(mockAccount);
			const cryptoRandomIntSpy = jest.spyOn(crypto, 'randomInt').mockReturnValue(12345 as any); // Set return value as 'any' type

			// Act
			const result = await accountService.createAccount(userId, currency);

			// Assert
			expect(result).toBe(true);
			expect(cryptoRandomIntSpy).toHaveBeenCalledWith(10000, 99999);
			expect(prismaServiceCreateSpy).toHaveBeenCalledWith({
				data: {
					currency,
					userId,
					accountNumber: '12345',
				},
			});
		});
	});
});
