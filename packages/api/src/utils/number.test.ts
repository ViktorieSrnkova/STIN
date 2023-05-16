import { randomInteger } from './number';

describe('randomInteger', () => {
	test('should return a random integer within the specified range', () => {
		const min = 1;
		const max = 10;
		const result = randomInteger(min, max);

		expect(result).toBeGreaterThanOrEqual(min);
		expect(result).toBeLessThanOrEqual(max);
		expect(Number.isInteger(result)).toBe(true);
	});

	test('should return the minimum value when min and max are the same', () => {
		const min = 5;
		const max = 5;
		const result = randomInteger(min, max);

		expect(result).toBe(min);
	});

	test('should handle negative numbers correctly', () => {
		const min = -10;
		const max = -1;
		const result = randomInteger(min, max);

		expect(result).toBeGreaterThanOrEqual(min);
		expect(result).toBeLessThanOrEqual(max);
		expect(Number.isInteger(result)).toBe(true);
	});
});
