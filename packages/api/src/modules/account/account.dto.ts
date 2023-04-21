import { Field, ObjectType, registerEnumType, Float } from '@nestjs/graphql';
import { Currency } from '@prisma/client';
import { TransactionDto } from 'modules/transaction/transaction.dto';

registerEnumType(Currency, {
	name: 'Currency',
});

@ObjectType()
export class AccountDto {
	@Field() createdAt!: Date;
	@Field() id!: string;
	@Field() accountNumber!: string;
	@Field(() => Currency) currency!: Currency;
	@Field(() => [TransactionDto]) transactions!: TransactionDto[];
	@Field(() => Float) balance!: number;
}

// todo
@ObjectType()
export class PublicAccountDto {
	@Field() createdAt!: Date;
	@Field() id!: string;
	@Field() accountNumber!: string;
	@Field() ownerName!: string;
}
