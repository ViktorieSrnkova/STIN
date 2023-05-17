import { INestApplicationContext, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}

	enableShutdownHooks(app: INestApplicationContext): void {
		process.on('beforeExit', async () => {
			await app.close();
			await this.$disconnect();
		});
		/* this.$on('beforeExit', async () => {
			await app.close();
			await this.$disconnect();
		}); */
	}
}
