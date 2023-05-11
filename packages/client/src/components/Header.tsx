import { Button, Dropdown, Layout, Space } from 'antd';
import useApp from 'hooks/useApp';
import { Link } from 'react-router-dom';
import Box from './Box';

const { Header: HeaderAntd } = Layout;

const Header: React.FC = () => {
	const { user, setUserJWT } = useApp();
	return (
		<HeaderAntd
			style={{
				justifyContent: 'space-between',
				height: 46,
				padding: 0,
				display: 'flex',
				backgroundColor: '#001529',
			}}
		>
			<Box display="flex" alignItems="center">
				<Link to="/">
					<Box style={{ color: 'white', paddingLeft: '10px' }}>logo</Box>
				</Link>
				<Box style={{ color: 'white', paddingLeft: '25px' }}>logo2</Box>
			</Box>
			<Box display="flex" alignItems="center" style={{ cursor: 'pointer', color: 'white', paddingRight: '25px' }}>
				<Dropdown
					menu={{
						items: [
							{
								key: '1',
								label: (
									<Link to="/settings">
										<Button type="link">Settings</Button>
									</Link>
								),
							},
							{
								key: '2',
								label: (
									<Button type="link" onClick={() => setUserJWT(undefined)}>
										Logout
									</Button>
								),
							},
						],
					}}
					placement="bottom"
					arrow
				>
					<Space>{user?.email ?? 'error'}</Space>
				</Dropdown>
			</Box>
		</HeaderAntd>
	);
};

export default Header;
