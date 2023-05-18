import axios from 'axios';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ExRateService } from './ex-rate.service';

jest.mock('axios');
jest.useFakeTimers();
describe('ExRateService', () => {
	let exRateService: ExRateService;
	let prismaService: PrismaService;
	const INTERVAL_FETCH = 1000;

	beforeEach(() => {
		prismaService = new PrismaService();
		exRateService = new ExRateService(prismaService);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('onModuleInit', () => {
		it('should fetch rates initially', async () => {
			const fetchSpy = jest.spyOn(exRateService, 'fetch').mockResolvedValue();

			await exRateService.onModuleInit();

			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});
		it('should call fetch method at regular intervals', async () => {
			const fetchSpy = jest.spyOn(exRateService, 'fetch').mockResolvedValue();

			await exRateService.onModuleInit();

			jest.advanceTimersByTime(INTERVAL_FETCH);

			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('fetch', () => {
		const mockData = `Header Line 1
			Header Line 2
			Country1|CurrencyName1|Amount1|CurrencyCode1|Rate1
			Country2|CurrencyName2|Amount2|CurrencyCode2|Rate2
			Country3|CurrencyName3|Amount3|CurrencyCode3|Rate3
			Country4|CurrencyName4|Amount4|CurrencyCode4|Rate4`;

		beforeEach(() => {
			jest.spyOn(prismaService.exRate, 'count').mockResolvedValue(0);
			jest.spyOn(prismaService.exRate, 'createMany').mockImplementation();

			(axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: mockData }));
		});

		it('should skip fetching if rates were already fetched today', async () => {
			jest.spyOn(prismaService.exRate, 'count').mockResolvedValue(1);

			await exRateService.fetch();

			expect(axios.get).not.toHaveBeenCalled();
			expect(prismaService.exRate.createMany).not.toHaveBeenCalled();
		});

		// Assuming you have imported the necessary dependencies and set up the test environment

		/* it('should save currency when it is included in TARGET_CURRENCY', async () => {
			const TARGET_CURRENCY = ['USD', 'EUR', 'GBP'];
			const rate = '1.23';

			const currencyCode = 'USD';

			jest.spyOn(exRateService, 'saveCurrency').mockImplementation();

			await exRateService.fetch();

			expect(exRateService.saveCurrency).toHaveBeenCalledWith(
				currencyCode,
				TARGET_CURRENCY,
				expect.any(Array),
				rate,
			);
		});

		it('should not save currency when it is not included in TARGET_CURRENCY', async () => {
			const TARGET_CURRENCY = ['USD', 'EUR', 'GBP'];
			const rate = '1.23';

			const currencyCode = 'JPY';

			jest.spyOn(exRateService, 'saveCurrency').mockImplementation();

			await exRateService.fetch();

			expect(exRateService.saveCurrency).not.toHaveBeenCalledWith(
				currencyCode,
				TARGET_CURRENCY,
				expect.any(Array),
				rate,
			);
		}); */

		it('should handle error when axios.get fails', async () => {
			jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch rates'));

			await expect(exRateService.fetch()).rejects.toThrow('Failed to fetch rates');

			expect(axios.get).toHaveBeenCalled();
		});
		it('should not save rates when fetched data is empty', async () => {
			(axios.get as jest.Mock).mockResolvedValue({ data: '' });

			await exRateService.fetch();

			expect(axios.get).toHaveBeenCalled();
		});
	});
});
