import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver(() => Boolean)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Mutation(() => Boolean)
	createUser(@Args('email') email: string, @Args('password') password: string): Promise<boolean> {
		return this.userService.createUser(email, password);
	}

	@Mutation(() => Boolean)
	loginUserAuthGenCode(@Args('email') email: string, @Args('password') password: string): Promise<boolean> {
		return this.userService.loginUserAuthGenCode(email, password);
	}

	@Mutation(() => String)
	loginUserAuthCode(
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('code') code: string,
	): Promise<string> {
		return this.userService.loginUserAuthCode(email, password, code);
	}
}
