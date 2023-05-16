import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
	let module: TestingModule;
	let prismaService: PrismaService;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [PrismaModule],
		}).compile();

		prismaService = module.get<PrismaService>(PrismaService);
	});

	it('should be defined', () => {
		expect(module).toBeDefined();
	});

	it('should provide the PrismaService', () => {
		expect(prismaService).toBeDefined();
	});
});
