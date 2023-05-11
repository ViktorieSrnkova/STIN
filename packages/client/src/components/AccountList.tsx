import { gql, useQuery } from '@apollo/client';
import { Button, Collapse, Divider, Table } from 'antd';
import { AccountDto, QueryAccounTransactionsArgs, TransactionDto } from 'types/gql';
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
			amount
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
		return (
			<Box>
				<Button onClick={() => setActiveAccounts(undefined)}>Back</Button>
				<Divider />
				<Table
					dataSource={transactionsData?.accounTransactions ?? []}
					loading={transactionsLoading}
					columns={[
						{ title: 'createdAt', dataIndex: 'createdAt' },
						{ title: 'id', dataIndex: 'id' },
						{ title: 'amount', dataIndex: 'amount' },
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
					{ title: 'accountNumber', dataIndex: 'accountNumber' },
					{ title: 'balance', dataIndex: 'balance' },
					{ title: 'currency', dataIndex: 'currency' },
					{ title: 'action', render: _ => <Button onClick={() => setActiveAccounts(_.id)}>Open</Button> },
				]}
			/>
		</>
	);
};

export default AccountList;
