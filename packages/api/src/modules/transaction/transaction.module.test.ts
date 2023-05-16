import { Test } from '@nestjs/testing';
import { TransactionModule } from './transaction.module';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';

describe('TransactionModule', () => {
	let transactionService: TransactionService;
	let transactionResolver: TransactionResolver;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [TransactionModule],
		}).compile();

		transactionService = moduleRef.get<TransactionService>(TransactionService);
		transactionResolver = moduleRef.get<TransactionResolver>(TransactionResolver);
	});

	it('should be defined', () => {
		expect(transactionService).toBeDefined();
		expect(transactionResolver).toBeDefined();
	});

	// Add more test cases as needed
});
