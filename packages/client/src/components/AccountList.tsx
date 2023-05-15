/* eslint-disable no-else-return */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { gql, useQuery } from '@apollo/client';
import { Button, Collapse, Divider, Table } from 'antd';
import { AccountDto, QueryAccounTransactionsArgs, TransactionDto, TransactionType } from 'types/gql';
import { useState } from 'react';
import CreateAccount from './CreateAccount';
import Box from './Box';

const { Panel } = Collapse;

const QUERY_ACCOUNT_LIST = gql`
	query myAcounts {
		myAcounts {
			id
			createdAt
			currency
			balance
			accountNumber
		}
	}
`;

const QUERY_ACCOUNT_TRANSACTIONS_LIST = gql`
	query accounTransactions($accountId: String!) {
		accounTransactions(accountId: $accountId) {
			id
			createdAt
			amount
			transactionType
			fromAccountId
			toAccountId
		}
	}
`;

const AccountList: React.FC = () => {
	const [activeAccounts, setActiveAccounts] = useState<string | undefined>();
	const { data, loading, refetch } = useQuery<{ myAcounts: AccountDto[] }>(QUERY_ACCOUNT_LIST);
	const { data: transactionsData, loading: transactionsLoading } = useQuery<
		{ accounTransactions: TransactionDto[] },
		QueryAccounTransactionsArgs
	>(QUERY_ACCOUNT_TRANSACTIONS_LIST, { variables: { accountId: activeAccounts ?? '' }, skip: !activeAccounts });

	if (activeAccounts) {
		const activeAccount = data?.myAcounts.find(_ => _.id === activeAccounts);

		return (
			<Box>
				<Button onClick={() => setActiveAccounts(undefined)}>Zpět</Button>
				<Divider />
				<Table
					dataSource={transactionsData?.accounTransactions ?? []}
					loading={transactionsLoading}
					columns={[
						{
							title: 'Typ transakce',
							dataIndex: 'transactionType',
							render: (text, record) => {
								const paidAcc = data?.myAcounts.find(_ => _.id === record.toAccountId);
								const payingAcc = data?.myAcounts.find(_ => _.id === record.fromAccountId);
								if (text === TransactionType.Transfer) {
									if (record.fromAccountId === activeAccounts) {
										return `Platba na účet ${paidAcc?.accountNumber}`;
									} else {
										return `Příchozí platba z účtu ${payingAcc?.accountNumber}`;
									}
								} else if (text === TransactionType.Deposit) {
									return 'Vklad na účet';
								} else if (text === TransactionType.Withdrawal) {
									return 'Výběr z účtu';
								} else {
									return '';
								}
							},
						},

						{
							title: 'Datum',
							dataIndex: 'createdAt',
							render: text => {
								const date = text.split('T')[0];
								const dateD = date.split('-')[2];
								const dateM = date.split('-')[1];
								const dateY = date.split('-')[0];
								const dateF = `${dateD}.${dateM}.${dateY}`;

								return <>{dateF}</>;
							},
						},
						{
							title: 'Čas',
							dataIndex: 'createdAt',
							render: text => {
								const time = text.split('T')[1];
								const timeF = time.split('.')[0];

								return <>{timeF}</>;
							},
						},
						{
							title: 'Hodnota',
							dataIndex: 'amount',
							render: text => {
								const sign = text > 0 ? '+' : '';
								const currencySymbol =
									activeAccount?.currency === 'CZK'
										? 'Kč'
										: activeAccount?.currency === 'GBP'
										? '£'
										: activeAccount?.currency === 'EUR'
										? '€'
										: activeAccount?.currency === 'USD'
										? '$'
										: '';
								return (
									<div style={{ textAlign: 'end' }}>
										<>
											<span style={{ color: text > 0 ? '#86b41d' : '#cd463c', fontSize: '16px' }}>
												{sign}
												{text}
												{currencySymbol}
											</span>
											<span style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
												{text !== undefined && text > 0 && ` (${text}${currencySymbol})`}
												{text !== undefined && text < 0 && ` (${-1 * text}${currencySymbol})`}
											</span>
										</>
									</div>
								);
							},
							align: 'right',
						},
						{
							title: 'Měna',
							dataIndex: 'currency',
							render: () => activeAccount?.currency,
						},
					]}
				/>
			</Box>
		);
	}

	return (
		<>
			<Collapse>
				<Panel header="Create account" key="1">
					<CreateAccount onCreate={() => refetch()} />
				</Panel>
			</Collapse>
			<br />
			<Table
				dataSource={data?.myAcounts ?? []}
				loading={loading}
				columns={[
					{ title: 'Číslo účtu', dataIndex: 'accountNumber' },
					{ title: 'Zůstatek', dataIndex: 'balance' },
					{ title: 'Měna', dataIndex: 'currency' },
					{
						title: 'Historie',
						render: _ => <Button onClick={() => setActiveAccounts(_.id)}>Otevřít</Button>,
					},
				]}
			/>
		</>
	);
};

export default AccountList;
