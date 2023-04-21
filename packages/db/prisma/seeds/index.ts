import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
	await prisma.user.deleteMany();
};

// eslint-disable-next-line no-console
main().catch(console.error);
