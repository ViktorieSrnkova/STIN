export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	DateTime: any;
};

export type AccountDto = {
	__typename?: 'AccountDto';
	accountNumber: Scalars['String'];
	balance: Scalars['Float'];
	createdAt: Scalars['DateTime'];
	currency: Currency;
	id: Scalars['String'];
	transactions: Array<TransactionDto>;
};

export enum Currency {
	Czk = 'CZK',
	Eur = 'EUR',
	Usd = 'USD',
}

export type Mutation = {
	__typename?: 'Mutation';
	createAccount: Scalars['Boolean'];
	createTransaction: Scalars['Boolean'];
	createUser: Scalars['Boolean'];
	loginUserAuthCode: Scalars['String'];
	loginUserAuthGenCode: Scalars['Boolean'];
};

export type MutationCreateAccountArgs = {
	currency: Currency;
};

export type MutationCreateTransactionArgs = {
	amount: Scalars['Float'];
	currency?: InputMaybe<Currency>;
	fromAccountNumber?: InputMaybe<Scalars['String']>;
	toAccountNumber?: InputMaybe<Scalars['String']>;
	type: TransactionType;
};

export type MutationCreateUserArgs = {
	email: Scalars['String'];
	password: Scalars['String'];
};

export type MutationLoginUserAuthCodeArgs = {
	code: Scalars['String'];
	email: Scalars['String'];
	password: Scalars['String'];
};

export type MutationLoginUserAuthGenCodeArgs = {
	email: Scalars['String'];
	password: Scalars['String'];
};

export type Query = {
	__typename?: 'Query';
	accounTransactions: Array<TransactionDto>;
	myAcounts: Array<AccountDto>;
	myTransactions: Array<TransactionDto>;
};

export type QueryAccounTransactionsArgs = {
	accountId: Scalars['String'];
};

export type TransactionDto = {
	__typename?: 'TransactionDto';
	amount: Scalars['Float'];
	createdAt: Scalars['DateTime'];
	fromAccountId?: Maybe<Scalars['String']>;
	id: Scalars['String'];
	toAccountId?: Maybe<Scalars['String']>;
	transactionType: TransactionType;
};

export enum TransactionType {
	Deposit = 'DEPOSIT',
	Transfer = 'TRANSFER',
	Withdrawal = 'WITHDRAWAL',
}
