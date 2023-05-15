import { config } from 'dotenv';
import { install } from 'source-map-support';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

install();
config();

(async () => {
	const { bootstrap } = await import('./boot');

	await bootstrap();
	// eslint-disable-next-line no-console
})().catch(e => console.error('Application failed to bootstrap...', e));
