import { Button, Dropdown, Layout, Menu } from 'antd';
import useApp from 'hooks/useApp';
import { Link } from 'react-router-dom';
import Box from './Box';

const { Header: HeaderAntd } = Layout;

const Header: React.FC = () => {
	const { user, setUserJWT } = useApp();

	const handleMenuClick = (): void => {
		setUserJWT(undefined);
	};

	const menu = (
		<Menu>
			<Menu.Item key="1">
				<Button type="link" onClick={handleMenuClick}>
					Odhlásit se
				</Button>
			</Menu.Item>
		</Menu>
	);

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
					<Box style={{ color: 'white', paddingLeft: '10px' }}>{user?.email}</Box>
				</Link>
			</Box>
			<Box display="flex" alignItems="center" style={{ cursor: 'pointer', color: 'white', paddingRight: '25px' }}>
				<Dropdown overlay={menu} trigger={['click']}>
					<div>Možnosti</div>
				</Dropdown>
			</Box>
		</HeaderAntd>
	);
};

export default Header;
