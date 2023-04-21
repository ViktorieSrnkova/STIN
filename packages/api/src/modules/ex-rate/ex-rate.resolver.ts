import { Resolver } from '@nestjs/graphql';
import { ExRateService } from './ex-rate.service';

@Resolver()
export class ExRateResolver {
	constructor(private readonly exRateService: ExRateService) {}
}
