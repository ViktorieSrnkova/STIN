import { Test, TestingModule } from '@nestjs/testing';
import { ExRateModule } from './ex-rate.module';
import { ExRateService } from './ex-rate.service';
import { ExRateResolver } from './ex-rate.resolver';

describe('ExRateModule', () => {
	let exRateModule: TestingModule;

	beforeAll(async () => {
		exRateModule = await Test.createTestingModule({
			imports: [ExRateModule],
		}).compile();
	});

	it('should be defined', () => {
		const module: ExRateModule = exRateModule.get<ExRateModule>(ExRateModule);
		expect(module).toBeDefined();
	});

	it('should provide the ExRateService', () => {
		const exRateService: ExRateService = exRateModule.get<ExRateService>(ExRateService);
		expect(exRateService).toBeDefined();
	});

	it('should provide the ExRateResolver', () => {
		const exRateResolver: ExRateResolver = exRateModule.get<ExRateResolver>(ExRateResolver);
		expect(exRateResolver).toBeDefined();
	});
});
