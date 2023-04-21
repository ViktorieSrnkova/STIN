import { INestApplicationContext, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	// constructor() {
	// 	super({
	// 		log: [
	// 			{
	// 				emit: 'event',
	// 				level: 'query',
	// 			},
	// 		],
	// 	});
	// }

	async onModuleInit(): Promise<void> {
		await this.$connect();

		// this.$on('query', async (e: any) => {
		// 	// eslint-disable-next-line no-console
		// 	console.log(`${e.query} ${e.params}`);
		// });
	}

	enableShutdownHooks(app: INestApplicationContext): void {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}
}
