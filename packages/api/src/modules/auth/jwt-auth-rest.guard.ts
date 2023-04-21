import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRestAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext): any {
		const request = context.switchToHttp().getRequest();

		return request;
	}
}
