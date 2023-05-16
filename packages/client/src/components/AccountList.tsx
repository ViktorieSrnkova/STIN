/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-else-return */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { gql, useQuery } from '@apollo/client';
import { Button, Collapse, Divider, Table } from 'antd';
import { AccountDto, QueryAccounTransactionsArgs, TransactionDto, TransactionType } from 'types/gql';
import { useEffect, useState } from 'react';
import CreateAccount from './CreateAccount';
import Box from './Box';
import '../App.css';

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
			amount2
			beforeAmount
			transactionType
			fromAccountId
			toAccountId
			beforeCurrency
		}
	}
`;

const AccountList: React.FC = () => {
	const [activeAccounts, setActiveAccounts] = useState<string | undefined>();
	const { data, loading, refetch } = useQuery<{ myAcounts: AccountDto[] }>(QUERY_ACCOUNT_LIST);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const { data: transactionsData, loading: transactionsLoading } = useQuery<
		{ accounTransactions: TransactionDto[] },
		QueryAccounTransactionsArgs
	>(QUERY_ACCOUNT_TRANSACTIONS_LIST, { variables: { accountId: activeAccounts ?? '' }, skip: !activeAccounts });

	useEffect(() => {
		const handleResize = (): void => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (activeAccounts) {
		const activeAccount = data?.myAcounts.find(_ => _.id === activeAccounts);
		let to: string;

		const formattedNumber = activeAccount?.balance?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

		return (
			<Box style={{ padding: '0px' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Button onClick={() => setActiveAccounts(undefined)}>Zpět</Button>
					<h2 className="nadpis" style={{ marginTop: '5px' }}>
						{' '}
						{` ${formattedNumber} ${activeAccount?.currency}`}{' '}
					</h2>
				</div>
				<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginTop: '20px' }}>
					<h3> {`Číslo účtu: ${activeAccount?.accountNumber}`} </h3>
				</div>
				<Divider style={{ marginTop: '0px' }} />

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
										to = '-';
										return `Platba na účet ${paidAcc?.accountNumber}`;
									} else {
										to = '+';
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
							className: 'smaller-mobile',
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
							className: 'smaller-mobile',
						},
						{
							title: 'Čas',
							dataIndex: 'createdAt',
							render: text => {
								const time = text.split('T')[1];
								const timeF = time.split('.')[0];

								return <>{timeF}</>;
							},
							className: 'hide-on-mobile',
						},
						{
							title: 'Hodnota',
							dataIndex: 'amount',
							render: (text, record) => {
								const sign = text < 0 ? '' : record.fromAccountId === activeAccounts ? '-' : '+';
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
											<span
												style={{
													color: sign === '+' ? '#86b41d' : '#cd463c',
												}}
												className="smaller-mobile-price"
											>
												{record.beforeCurrency === activeAccount?.currency ? (
													<>
														{sign}
														{record.beforeAmount
															.toFixed(2)
															.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
														{currencySymbol}
													</>
												) : record.amount2 ? (
													to === '+' ? (
														<>
															{sign}
															{record.amount
																.toFixed(2)
																.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
															{currencySymbol}
														</>
													) : (
														<>
															{sign}
															{record.amount2
																.toFixed(2)
																.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
															{currencySymbol}
														</>
													)
												) : (
													<>
														{sign}
														{text.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
														{currencySymbol}
													</>
												)}
											</span>
											<span style={{ display: 'block', marginTop: '5px' }}>
												{text !== undefined &&
													text > 0 &&
													record.beforeCurrency !== activeAccount?.currency &&
													` (${record.beforeAmount}${record.beforeCurrency})`}
												{text !== undefined &&
													text < 0 &&
													record.beforeCurrency !== activeAccount?.currency &&
													` (${-1 * text}${record.beforeCurrency})`}
											</span>
										</>
									</div>
								);
							},
							align: 'right',
							className: 'smaller-mobile-price',
						},
						{
							title: 'Měna',
							dataIndex: 'currency',
							render: () => activeAccount?.currency,
							className: 'hide-on-mobile',
						},
					]}
				/>
			</Box>
		);
	}

	return (
		<>
			<div style={{ marginLeft: '-15px' }}>
				<Collapse>
					<Panel header="Vytvořit účet" key="1">
						<CreateAccount onCreate={() => refetch()} />
					</Panel>
				</Collapse>
				<br />
				<Table
					dataSource={data?.myAcounts ?? []}
					loading={loading}
					style={{ fontSize: '10px' }}
					columns={[
						{ title: 'Číslo účtu', dataIndex: 'accountNumber', align: 'center' },
						{
							title: 'Zůstatek',
							dataIndex: 'balance',
							render: text => text.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
							align: 'right',
							width: 150,
						},
						{ title: 'Měna', dataIndex: 'currency', align: 'right', className: 'hide-on-mobile' },
						{
							title: 'Historie',
							render: record => (
								<Button className="history-button" onClick={() => setActiveAccounts(record.id)}>
									{isMobile ? record.currency : 'Otevřít'}
								</Button>
							),
							align: 'center',
						},
					]}
				/>
			</div>
		</>
	);
};

export default AccountList;
