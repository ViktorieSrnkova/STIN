import { Module } from '@nestjs/common';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
	exports: [TransactionService],
	imports: [PrismaModule],
	providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
