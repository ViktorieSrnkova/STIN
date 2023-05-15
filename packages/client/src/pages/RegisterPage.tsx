import { Button, Divider, Form, Input, notification, Card } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { MutationCreateUserArgs } from 'types/gql';

const MUTATION_CREATE_USER = gql`
	mutation createUser($email: String!, $password: String!) {
		createUser(email: $email, password: $password)
	}
`;

const RegisterPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const [createUser] = useMutation<{ createUser: boolean }, MutationCreateUserArgs>(MUTATION_CREATE_USER);

	const onFinish = async (values: { email: string; password: string }): Promise<void> => {
		try {
			setLoading(true);
			const response = await createUser({ variables: { email: values.email, password: values.password } });
			if (response.data?.createUser) {
				notification.success({
					message: 'Success',
				});
			} else {
				notification.error({
					message: 'Error',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{contextHolder}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					textAlign: 'center',
					minHeight: '100vh',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<Card>
					<Form name="basic" style={{ width: '300px' }} onFinish={onFinish} autoComplete="off">
						<Form.Item
							name="email"
							rules={[{ required: true, type: 'email', message: 'Please input your valid e-mail!' }]}
						>
							<Input placeholder="E-mail" />
						</Form.Item>

						<Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
							<Input.Password placeholder="Password" />
						</Form.Item>

						<Form.Item
							name="confirmPassword"
							rules={[
								{ required: true, message: 'Please input your confirm password!' },
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										// eslint-disable-next-line prefer-promise-reject-errors
										return Promise.reject('The two passwords that you entered do not match!');
									},
								}),
							]}
						>
							<Input.Password placeholder="Confirm Password" />
						</Form.Item>

						<Form.Item>
							<Button loading={loading} style={{ width: '100%' }} type="primary" htmlType="submit">
								Register
							</Button>
						</Form.Item>
					</Form>
					<Divider />
					<Button type="link">
						<Link to="/login">Login</Link>
					</Button>
				</Card>
			</div>
		</>
	);
};

export default RegisterPage;
