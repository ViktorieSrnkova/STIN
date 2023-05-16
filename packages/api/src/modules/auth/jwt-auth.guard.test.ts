import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
	let jwtAuthGuard: JwtAuthGuard;

	beforeEach(() => {
		jwtAuthGuard = new JwtAuthGuard();
	});

	describe('getRequest', () => {
		it('should return the request object from the execution context', () => {
			// Arrange
			const mockRequest = {};
			const mockContext = {
				getContext: jest.fn().mockReturnValue({
					req: mockRequest,
				}),
			};
			const executionContext: Partial<ExecutionContext> = {
				switchToHttp: jest.fn(),
				switchToRpc: jest.fn(),
				switchToWs: jest.fn(),
				getClass: jest.fn(),
				getHandler: jest.fn(),
				getArgs: jest.fn(),
				getArgByIndex: jest.fn(),
				getType: jest.fn(),
			};
			const createFn = jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockContext as any);

			// Act
			const request = jwtAuthGuard.getRequest(executionContext as ExecutionContext);

			// Assert
			expect(createFn).toHaveBeenCalledWith(executionContext);
			expect(mockContext.getContext).toHaveBeenCalled();
			expect(request).toBe(mockRequest);
		});
	});
});
