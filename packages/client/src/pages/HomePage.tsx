import { Card } from 'antd';
import AccountList from 'components/AccountList';
import Page from 'components/Page';

const HomePage: React.FC = () => (
	<Page breadcrumb={[{ title: 'Domů' }]}>
		<Card>
			<AccountList />
		</Card>
	</Page>
);

export default HomePage;
