import { Module } from '@nestjs/common';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { TransactionModule } from 'modules/transaction/transaction.module';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';

@Module({
	imports: [PrismaModule, TransactionModule],
	providers: [AccountResolver, AccountService],
})
export class AccountModule {}
