import { ListUserDto } from './user.dto';

describe('ListUserDto', () => {
	it('should have a nullable cursor field', () => {
		const listUserDto = new ListUserDto();
		expect(listUserDto.cursor).toBeUndefined();

		const cursorValue = 'abc123';
		listUserDto.cursor = cursorValue;
		expect(listUserDto.cursor).toBe(cursorValue);
	});
});
