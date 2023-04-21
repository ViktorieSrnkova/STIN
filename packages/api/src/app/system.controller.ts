import { Controller, Get } from '@nestjs/common';

@Controller('system')
export class SystemController {
	@Get('health')
	health(): { state: true } {
		return { state: true };
	}
}
