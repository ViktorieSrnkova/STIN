import { CloseCircleTwoTone } from '@ant-design/icons';
import { Alert, Button, Modal, Space } from 'antd';
import useApp from 'hooks/useApp';
import Box from './Box';

const ErrorsModal: React.FC = () => {
	const { errors, clearErrors } = useApp();
	const isModalVisible = errors.length > 0;

	return (
		<Modal
			title={
				<Box display="flex" alignItems="center">
					<CloseCircleTwoTone twoToneColor="#ff0000" style={{ paddingRight: '10px', fontSize: '30px' }} />

					<b>{' An error occurred!'}</b>
				</Box>
			}
			open={isModalVisible}
			closable={false}
			footer={
				<Box>
					<Button onClick={clearErrors}>Close</Button>
				</Box>
			}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				{errors.map(e => (
					<Alert key={e.id} message={e.message} type="error" showIcon />
				))}
			</Space>
		</Modal>
	);
};

export default ErrorsModal;
