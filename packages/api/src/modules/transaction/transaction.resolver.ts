import { UseGuards } from '@nestjs/common';
import { Args, Float, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { JWTUser } from 'modules/auth/jwt.types';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Currency, TransactionType } from '@prisma/client';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => TransactionDto)
export class TransactionResolver {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly transactionService: TransactionService,
	) {}

	@Query(() => [TransactionDto])
	myTransactions(@CurrentUser() user: JWTUser): Promise<TransactionDto[]> {
		return this.prismaService.transaction.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' },
		}) as unknown as Promise<TransactionDto[]>;
	}

	@Mutation(() => Boolean)
	createTransaction(
		@CurrentUser() user: JWTUser,
		@Args('amount', { type: () => Float }) amount: number,
		@Args('type', { type: () => TransactionType }) type: TransactionType,
		@Args('fromAccountNumber', { nullable: true }) fromAccountNumber?: string,
		@Args('currency', { type: () => Currency, nullable: true }) currency?: Currency,
		@Args('toAccountNumber', { nullable: true }) toAccountNumber?: string,
	): Promise<boolean> {
		return this.transactionService.createTransaction(
			user.id,
			amount,
			type,
			currency,
			fromAccountNumber,
			toAccountNumber,
		);
	}

	@Query(() => [TransactionDto])
	accounTransactions(@CurrentUser() user: JWTUser, @Args('accountId') accountId: string): Promise<TransactionDto[]> {
		return this.prismaService.transaction.findMany({
			where: {
				OR: [
					{
						userId: user.id,
						fromAccountId: accountId,
					},
					{ userId: user.id, toAccountId: accountId },
				],
			},
			orderBy: { createdAt: 'desc' },
		}) as unknown as Promise<TransactionDto[]>;
	}
}
