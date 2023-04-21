import axios from 'axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Currency } from '@prisma/client';

const TARGET_CURRENCY = ['EUR', 'USD', 'CZK'];
const INTERVAL_FETCH = 1000 * 60;
const RATE_URL =
	'https://cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';

@Injectable()
export class ExRateService implements OnModuleInit {
	constructor(private readonly prismaService: PrismaService) {}

	onModuleInit(): void {
		// eslint-disable-next-line no-console
		this.fetch().catch(console.error);

		setInterval(() => {
			// eslint-disable-next-line no-console
			this.fetch().catch(console.error);
		}, INTERVAL_FETCH);
	}

	async fetch(): Promise<void> {
		// eslint-disable-next-line no-console
		console.log('Fetching cnb...');
		const { data } = await axios.get(RATE_URL);

		const lines = data.split('\n');

		const toSave: { currency: Currency; exRate: number }[] = [];
		const skipFirst = 2;
		const skipLast = 1;
		for (let i = skipFirst; i < lines.length - skipLast; i++) {
			const line = lines[i];
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [country, currencyName, amount, currencyCode, rate] = line.split('|');

			if (TARGET_CURRENCY.includes(currencyCode)) {
				toSave.push({
					currency: currencyCode,
					exRate: parseFloat(rate.replace(',', '.')),
				});
			}
		}

		await this.prismaService.exRate.createMany({ data: toSave });
	}
}
