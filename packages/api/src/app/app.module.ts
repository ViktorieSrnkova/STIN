import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { UserModule } from 'modules/user/user.module';
import { GraphqlModule } from 'modules/graphql/graphql.module';
import { AccountModule } from 'modules/account/account.module';
import { TransactionModule } from 'modules/transaction/transaction.module';
import { ExRateModule } from 'modules/ex-rate/ex-rate.module';
import { SystemController } from './system.controller';

@Module({
	imports: [GraphqlModule, TransactionModule, ExRateModule, AuthModule, AccountModule, UserModule, PrismaModule],
	controllers: [SystemController],
})
export class AppModule {}
