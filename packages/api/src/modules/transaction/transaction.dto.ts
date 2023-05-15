import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionType } from '@prisma/client';

registerEnumType(TransactionType, {
	name: 'TransactionType',
});

@ObjectType()
export class TransactionDto {
	@Field() createdAt!: Date;
	@Field() id!: string;
	@Field(() => Float) amount!: number;
	@Field(() => Float) amount2!: number;
	@Field(() => Float) beforeAmount!: number;
	@Field(() => String) beforeCurrency!: string;
	@Field(() => TransactionType) transactionType!: TransactionType;

	@Field({ nullable: true }) fromAccountId?: string;
	@Field({ nullable: true }) toAccountId?: string;
}
