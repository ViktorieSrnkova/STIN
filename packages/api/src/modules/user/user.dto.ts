import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListUserDto {
	@Field({ nullable: true }) cursor?: string;
}
