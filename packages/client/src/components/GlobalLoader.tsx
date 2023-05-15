import { Spin } from 'antd';
import Box from './Box';

const GlobalLoader: React.FC = () => (
	<Box display="flex" alignItems="center" justifyContent="center">
		<Spin size="large">
			<Box display="flex" alignItems="center" justifyContent="center">
				logo456
			</Box>
		</Spin>
	</Box>
);

export default GlobalLoader;
