import { Currency } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';
import { TransactionDto } from 'modules/transaction/transaction.dto';
import { AccountDto, PublicAccountDto } from './account.dto';

describe('AccountDto', () => {
	beforeAll(() => {
		registerEnumType(Currency, {
			name: 'Currency',
		});
	});

	it('should create an instance of AccountDto', () => {
		const accountDto = new AccountDto();

		expect(accountDto).toBeDefined();
		expect(accountDto).toBeInstanceOf(AccountDto);
	});

	it('should have correct fields in AccountDto', () => {
		const accountDto = new AccountDto();
		accountDto.createdAt = new Date();
		accountDto.id = '1';
		accountDto.accountNumber = '123456789';
		accountDto.currency = Currency.USD;
		accountDto.transactions = [new TransactionDto()];
		accountDto.balance = 100.0;

		expect(accountDto.createdAt).toBeInstanceOf(Date);
		expect(accountDto.id).toBe('1');
		expect(accountDto.accountNumber).toBe('123456789');
		expect(accountDto.currency).toBe(Currency.USD);
		expect(accountDto.transactions).toEqual([new TransactionDto()]);
		expect(accountDto.balance).toBe(100.0);
	});
});

describe('PublicAccountDto', () => {
	it('should create an instance of PublicAccountDto', () => {
		const publicAccountDto = new PublicAccountDto();

		expect(publicAccountDto).toBeDefined();
		expect(publicAccountDto).toBeInstanceOf(PublicAccountDto);
	});

	it('should have correct fields in PublicAccountDto', () => {
		const publicAccountDto = new PublicAccountDto();
		publicAccountDto.createdAt = new Date();
		publicAccountDto.id = '1';
		publicAccountDto.accountNumber = '123456789';
		publicAccountDto.ownerName = 'John Doe';

		expect(publicAccountDto.createdAt).toBeInstanceOf(Date);
		expect(publicAccountDto.id).toBe('1');
		expect(publicAccountDto.accountNumber).toBe('123456789');
		expect(publicAccountDto.ownerName).toBe('John Doe');
	});
});
