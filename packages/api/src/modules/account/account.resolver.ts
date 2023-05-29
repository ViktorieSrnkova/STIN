import { Args, Mutation, Parent, Query, Resolver, ResolveField, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { JWTUser } from '../auth/jwt.types';
import { TransactionDto } from '../transaction/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from './account.service';
import { AccountDto } from './account.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => AccountDto)
export class AccountResolver {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly accountService: AccountService,
		private readonly transactionService: TransactionService,
	) {}

	@Mutation(() => Boolean)
	createAccount(
		@CurrentUser() user: JWTUser,
		@Args('currency', { type: () => Currency }) currency: Currency,
	): Promise<boolean> {
		return this.accountService.createAccount(user.id, currency);
	}

	@Query(() => [AccountDto])
	myAcounts(@CurrentUser() user: JWTUser): Promise<Omit<AccountDto, 'transactions' | 'balance'>[]> {
		return this.prismaService.account.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
	}
	@Query(() => [AccountDto])
	acounts(@CurrentUser() user: JWTUser): Promise<Omit<AccountDto, 'transactions' | 'balance'>[]> {
		return this.prismaService.account.findMany({ orderBy: { createdAt: 'desc' } });
	}

	@ResolveField(() => [TransactionDto])
	transactions(@Parent() parent: Omit<AccountDto, 'transactions' | 'balance'>): Promise<TransactionDto[]> {
		return this.prismaService.transaction.findMany({
			where: { toAccountId: parent.id },
			orderBy: { createdAt: 'desc' },
		}) as any;
	}

	@ResolveField(() => Float)
	balance(@Parent() parent: Omit<AccountDto, 'transactions' | 'balance'>): Promise<number> {
		return this.transactionService.getBalance(parent.id);
	}
}
