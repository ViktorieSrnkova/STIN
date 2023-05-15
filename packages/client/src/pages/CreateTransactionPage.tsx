import { Card } from 'antd';
import CreateTransaction from 'components/CreateTransaction';
import Page from 'components/Page';

const CreteTransactionPage: React.FC = () => (
	<Page breadcrumb={[{ title: 'Transakce' }]}>
		<Card>
			<CreateTransaction />
		</Card>
	</Page>
);

export default CreteTransactionPage;
