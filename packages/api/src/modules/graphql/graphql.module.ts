import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';

@Module({
	imports: [
		GraphQLModule.forRoot<MercuriusDriverConfig>({
			driver: MercuriusDriver,
			autoSchemaFile: true,
			graphiql: true,
		}),
	],
})
export class GraphqlModule {}
