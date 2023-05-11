import { DownOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import { Button, Card, Dropdown, Form, Select, Space, notification } from 'antd';
import { useState } from 'react';
import { Currency, MutationCreateAccountArgs } from 'types/gql';
import { firstUC } from 'utils/string';

const CURRENCY_LIST = Object.values(Currency);

const MUTATION_CREATE_ACCOUNT = gql`
	mutation createAccount($currency: Currency!) {
		createAccount(currency: $currency)
	}
`;

interface Props {
	onCreate?: () => void;
}

const CreateAccount: React.FC<Props> = ({ onCreate }) => {
	const [api, contextHolder] = notification.useNotification();
	const [loading, setLoading] = useState(false);
	const [createAccount] = useMutation<{}, MutationCreateAccountArgs>(MUTATION_CREATE_ACCOUNT);

	const onFinish = async (values: { currency: Currency }): Promise<void> => {
		try {
			setLoading(true);
			await createAccount({
				variables: { currency: values.currency },
			});
			notification.success({
				message: 'Account has been created!',
			});
			onCreate?.();
		} catch (e) {
			api.error({
				message: `${e.toString()}`,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{contextHolder}
			<Form
				name="basic"
				style={{ width: '100%' }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.Item name="currency">
					<Select
						style={{ width: '100%' }}
						options={Object.values(Currency).map(c => ({ value: c, label: c }))}
					/>
				</Form.Item>
				<Form.Item>
					<Button loading={loading} style={{ width: '100%' }} type="primary" htmlType="submit">
						Create
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default CreateAccount;
