import { Test, TestingModule } from '@nestjs/testing';
import { INestApplicationContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
	let prismaService: PrismaService;
	let app: INestApplicationContext;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService],
		}).compile();

		prismaService = module.get<PrismaService>(PrismaService);
		app = module.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('should initialize PrismaClient on module initialization', async () => {
		jest.spyOn(prismaService, '$connect');
		await prismaService.onModuleInit();
		expect(prismaService.$connect).toHaveBeenCalledTimes(1);
	});

	it('should enable shutdown hooks', () => {
		const mockProcessOn = jest.spyOn(process, 'on');
		prismaService.enableShutdownHooks(app);
		expect(mockProcessOn).toHaveBeenCalledWith('beforeExit', expect.any(Function));
	});

	it('should be defined', () => {
		expect(prismaService).toBeDefined();
	});
});
