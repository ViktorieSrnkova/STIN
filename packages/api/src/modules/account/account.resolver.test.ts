import { Test } from '@nestjs/testing';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Currency } from '@prisma/client';
import { TransactionDto } from 'modules/transaction/transaction.dto';
import { CurrentUser } from 'modules/auth/decorators/user.decorator';
import { JWTUser } from 'modules/auth/jwt.types';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { AccountDto } from './account.dto';

describe('AccountResolver', () => {
	let accountResolver: AccountResolver;
	let accountService: AccountService;
	let transactionService: TransactionService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [AccountResolver, AccountService, TransactionService, PrismaService],
		}).compile();

		accountResolver = moduleRef.get<AccountResolver>(AccountResolver);
		accountService = moduleRef.get<AccountService>(AccountService);
		transactionService = moduleRef.get<TransactionService>(TransactionService);
		prismaService = moduleRef.get<PrismaService>(PrismaService);
	});

	describe('createAccount', () => {
		it('should call accountService.createAccount with correct parameters', async () => {
			const userId = 'user123';
			const currency: Currency = Currency.USD;

			const createAccountSpy = jest.spyOn(accountService, 'createAccount');
			createAccountSpy.mockResolvedValue(true);

			const result = await accountResolver.createAccount({ id: userId } as JWTUser, currency);

			expect(createAccountSpy).toHaveBeenCalledWith(userId, currency);
			expect(result).toBe(true);
		});
	});

	describe('myAcounts', () => {
		it('should call prismaService.account.findMany with correct parameters', async () => {
			const userId = 'user123';
			const findManySpy = jest.spyOn(prismaService.account, 'findMany');
			findManySpy.mockResolvedValue([]);

			const result = await accountResolver.myAcounts({ id: userId } as JWTUser);

			expect(findManySpy).toHaveBeenCalledWith({
				where: { userId },
				orderBy: { createdAt: 'desc' },
			});
			expect(result).toEqual([]);
		});
	});

	describe('transactions', () => {
		it('should call prismaService.transaction.findMany with correct parameters', async () => {
			const parentId = 'parent123';
			const findManySpy = jest.spyOn(prismaService.transaction, 'findMany');
			findManySpy.mockResolvedValue([]);

			const result = await accountResolver.transactions({
				id: parentId,
			} as AccountDto);

			expect(findManySpy).toHaveBeenCalledWith({
				where: { toAccountId: parentId },
				orderBy: { createdAt: 'desc' },
			});
			expect(result).toEqual([]);
		});
	});

	describe('balance', () => {
		it('should call transactionService.getBalance with correct parameters', async () => {
			const parentId = 'parent123';
			const getBalanceSpy = jest.spyOn(transactionService, 'getBalance');
			getBalanceSpy.mockResolvedValue(100);

			const result = await accountResolver.balance({ id: parentId } as AccountDto);

			expect(getBalanceSpy).toHaveBeenCalledWith(parentId);
			expect(result).toBe(100);
		});
	});
});
