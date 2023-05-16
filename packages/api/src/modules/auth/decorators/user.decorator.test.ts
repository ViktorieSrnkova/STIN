import { createParamDecorator } from '@nestjs/common';
import get from 'lodash/get';
import { CurrentUser, CurrentUserRest } from './user.decorator';
import { JWTUser } from '../jwt.types';

describe('CurrentUser Decorator', () => {
	const mockReq = {
		args: [null, null, { req: { user: { id: 123, name: 'John Doe' } } }],
	};

	const mockReqArgs = {
		args: [null, { request: { user: { id: 456, name: 'Jane Smith' } } }],
	};

	it('should return the current user from the request arguments', () => {
		const decoratorFn = createParamDecorator((_, req): JWTUser => get(req, 'args[2].req.user'));
		const result = decoratorFn(null, mockReq);
		expect(result).toEqual(expect.any(Function));
	});

	it('should return the current user from the request arguments for CurrentUserRest decorator', () => {
		const result = CurrentUserRest(null, mockReqArgs);
		expect(result).toEqual(expect.any(Function));
	});
});
