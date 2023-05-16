import { PrismaModule } from 'modules/prisma/prisma.module';
import { Test } from '@nestjs/testing';
import { TransactionModule } from 'modules/transaction/transaction.module';
import { AccountModule } from './account.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

describe('AccountModule', () => {
	let accountResolver: AccountResolver;
	let accountService: AccountService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [PrismaModule, TransactionModule, AccountModule],
		}).compile();

		accountResolver = moduleRef.get<AccountResolver>(AccountResolver);
		accountService = moduleRef.get<AccountService>(AccountService);
	});

	it('should be defined', () => {
		expect(accountResolver).toBeDefined();
		expect(accountService).toBeDefined();
	});
});
