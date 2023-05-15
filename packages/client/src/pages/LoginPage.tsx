import { gql, useMutation } from '@apollo/client';
import { Button, Divider, Form, Input, notification, Card } from 'antd';
import useApp from 'hooks/useApp';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MutationLoginUserAuthCodeArgs, MutationLoginUserAuthGenCodeArgs } from 'types/gql';

const MUTATION_LOGIN_USER_AUTH_GEN_CODE = gql`
	mutation loginUserAuthGenCode($email: String!, $password: String!) {
		loginUserAuthGenCode(email: $email, password: $password)
	}
`;

const MUTATION_LOGIN_USER_AUTH_CODE = gql`
	mutation loginUserAuthCode($email: String!, $password: String!, $code: String!) {
		loginUserAuthCode(email: $email, password: $password, code: $code)
	}
`;

const LoginPage: React.FC = () => {
	const btnRef = useRef<'code' | 'login' | undefined>(undefined);
	const { setUserJWT } = useApp();
	const [loading, setLoading] = useState(false);
	const [loginUserAuthGenCode] = useMutation<{ loginUserAuthGenCode: boolean }, MutationLoginUserAuthGenCodeArgs>(
		MUTATION_LOGIN_USER_AUTH_GEN_CODE,
	);
	const [loginUser] = useMutation<{ loginUserAuthCode: string }, MutationLoginUserAuthCodeArgs>(
		MUTATION_LOGIN_USER_AUTH_CODE,
	);

	const [api, contextHolder] = notification.useNotification();
	const onFinish = async (values: any): Promise<void> => {
		try {
			setLoading(true);
			if (btnRef.current === 'code') {
				const r = await loginUserAuthGenCode({ variables: { email: values.email, password: values.password } });
				if (!r.data?.loginUserAuthGenCode) {
					notification.error({
						message: 'Invalid password!',
					});
				}
			} else {
				const r = await loginUser({
					variables: { email: values.email, password: values.password, code: values.code },
				});
				if (r.data?.loginUserAuthCode === '') {
					notification.error({
						message: 'Invalid 2pa code or password!',
					});
				} else {
					setUserJWT(r.data?.loginUserAuthCode);
				}
			}
		} catch (e) {
			api.error({
				message: `Login failed: ${e.toString()}`,
				placement: 'topRight',
			});
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
					<Form
						name="basic"
						style={{ width: '300px' }}
						initialValues={{ remember: true }}
						onFinish={onFinish}
						autoComplete="off"
					>
						<Form.Item
							name="email"
							rules={[{ required: true, type: 'email', message: 'Please input your valid e-mail!' }]}
						>
							<Input placeholder="E-mail" />
						</Form.Item>

						<Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
							<Input.Password placeholder="Heslo" />
						</Form.Item>

						<Form.Item>
							<Button
								loading={loading}
								style={{ width: '100%' }}
								type="primary"
								htmlType="submit"
								name="code"
								onClick={() => {
									btnRef.current = 'code';
								}}
							>
								pošli bezpečnostní kód
							</Button>

							<Form.Item name="code">
								<Input.Password placeholder="Kód" />
							</Form.Item>

							<Divider />
							<Button
								loading={loading}
								style={{ width: '100%' }}
								type="primary"
								htmlType="submit"
								name="login"
								onClick={() => {
									btnRef.current = 'login';
								}}
							>
								Login
							</Button>
						</Form.Item>
					</Form>
					<Divider />
					<Button type="link">
						<Link to="/register">Registrace</Link>
					</Button>
				</Card>
			</div>
		</>
	);
};

export default LoginPage;
