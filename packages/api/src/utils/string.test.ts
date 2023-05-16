import { isAlphaNumeric } from './string';

describe('isAlphaNumeric', () => {
	test('should return true for an alphanumeric string', () => {
		const result = isAlphaNumeric('abc123');
		expect(result).toBe(true);
	});

	test('should return false for a non-alphanumeric string', () => {
		const result = isAlphaNumeric('abc-123');
		expect(result).toBe(false);
	});

	test('should return false for an empty string', () => {
		const result = isAlphaNumeric('');
		expect(result).toBe(false);
	});

	test('should return true for a single alphanumeric character', () => {
		const result = isAlphaNumeric('1');
		expect(result).toBe(true);
	});

	test('should return true for a single alphabet character', () => {
		const result = isAlphaNumeric('a');
		expect(result).toBe(true);
	});

	test('should return true for a single digit character', () => {
		const result = isAlphaNumeric('5');
		expect(result).toBe(true);
	});

	// Add more test cases as needed
});
