import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';

@Module({
	imports: [PrismaModule, TransactionModule],
	providers: [AccountResolver, AccountService],
})
export class AccountModule {}
