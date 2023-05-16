import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlModule } from './graphql.module';

describe('GraphqlModule', () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GraphqlModule],
		}).compile();
	});

	it('should be defined', () => {
		expect(module).toBeDefined();
	});
});
