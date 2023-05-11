import { Breadcrumb, Spin } from 'antd';
import { Link } from 'react-router-dom';

interface Props {
	breadcrumb?: { title: string; path?: string }[];
	isLoading?: boolean;
	children: React.ReactNode | React.ReactNode[];
}

const Page: React.FC<Props> = ({ breadcrumb, children, isLoading }) => {
	const component = (
		<div>
			{breadcrumb && (
				<div style={{ padding: 10 }}>
					<Breadcrumb>
						{breadcrumb.map(br => (
							<Breadcrumb.Item key={br.title}>
								<Link to={br.path ?? '#'}>
									{/* <Title level={5} key={br.title}> */}
									{br.title}
									{/* </Title> */}
								</Link>
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
				</div>
			)}
			<div style={{ padding: 10 }}>{children}</div>
		</div>
	);
	if (isLoading) {
		return <Spin tip="Loading...">{component}</Spin>;
	}

	return component;
};

export default Page;
