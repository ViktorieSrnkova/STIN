import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from 'app/app.module';
import { ENV_PORT } from 'const/env';
import fmp from '@fastify/multipart';
import { PrismaService } from 'modules/prisma/prisma.service';
import { enableExitSignalsHandling, registerShutdownCallback } from 'utils/process';

export const bootstrap = async (): Promise<void> => {
	enableExitSignalsHandling();
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ bodyLimit: 1048576 * 10 /* 10MB */ }),
		{
			logger: false,
		},
	);
	const prismaService = app.get(PrismaService);

	registerShutdownCallback(() => {
		app.close();
	});
	prismaService.enableShutdownHooks(app);

	app.register(fmp);
	app.enableCors({
		origin: '*',
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(ENV_PORT, '0.0.0.0');

	// eslint-disable-next-line no-console
	console.log(`http://localhost:${ENV_PORT}/graphiql`);
};
