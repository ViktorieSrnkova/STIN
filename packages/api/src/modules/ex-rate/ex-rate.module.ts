import { Module } from '@nestjs/common';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { ExRateService } from './ex-rate.service';
import { ExRateResolver } from './ex-rate.resolver';

@Module({
	exports: [ExRateService],
	imports: [PrismaModule],
	providers: [ExRateResolver, ExRateService],
})
export class ExRateModule {}
