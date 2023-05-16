import { TransactionType } from '@prisma/client';
import { TransactionDto } from './transaction.dto';

describe('TransactionDto', () => {
	let transactionDto: TransactionDto;

	beforeEach(() => {
		transactionDto = new TransactionDto();
		transactionDto.createdAt = new Date();
		transactionDto.id = 'test-id';
		transactionDto.amount = 10;
		transactionDto.amount2 = 20;
		transactionDto.beforeAmount = 5;
		transactionDto.beforeCurrency = 'USD';
		transactionDto.transactionType = TransactionType.DEPOSIT;
		transactionDto.fromAccountId = 'from-account-id';
		transactionDto.toAccountId = 'to-account-id';
	});

	it('should have the correct fields', () => {
		expect(transactionDto).toHaveProperty('createdAt');
		expect(transactionDto).toHaveProperty('id');
		expect(transactionDto).toHaveProperty('amount');
		expect(transactionDto).toHaveProperty('amount2');
		expect(transactionDto).toHaveProperty('beforeAmount');
		expect(transactionDto).toHaveProperty('beforeCurrency');
		expect(transactionDto).toHaveProperty('transactionType');
		expect(transactionDto).toHaveProperty('fromAccountId');
		expect(transactionDto).toHaveProperty('toAccountId');
	});

	it('should have the correct field types', () => {
		expect(transactionDto.createdAt).toBeInstanceOf(Date);
		expect(typeof transactionDto.id).toBe('string');
		expect(typeof transactionDto.amount).toBe('number');
		expect(typeof transactionDto.amount2).toBe('number');
		expect(typeof transactionDto.beforeAmount).toBe('number');
		expect(typeof transactionDto.beforeCurrency).toBe('string');
		expect(transactionDto.transactionType).toBe(TransactionType.DEPOSIT);
		expect(typeof transactionDto.fromAccountId).toBe('string');
		expect(typeof transactionDto.toAccountId).toBe('string');
	});

	it('should have the correct field options', () => {
		expect(transactionDto.fromAccountId).toBe('from-account-id');
		expect(transactionDto.toAccountId).toBe('to-account-id');
	});

	it('should have nullable fields', () => {
		expect(transactionDto.fromAccountId).toBe('from-account-id');
		expect(transactionDto.toAccountId).toBe('to-account-id');

		transactionDto.fromAccountId = undefined;
		transactionDto.toAccountId = undefined;

		expect(transactionDto.fromAccountId).toBeUndefined();
		expect(transactionDto.toAccountId).toBeUndefined();
	});
});
