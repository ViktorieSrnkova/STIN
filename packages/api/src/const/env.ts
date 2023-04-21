const loadString = (path: string, allowValues?: string[]): string => {
	const tmp = process.env[path];

	if (!tmp) {
		throw new Error(`Env ${path} was not found!`);
	}

	if (allowValues && !allowValues.includes(tmp)) {
		throw new Error(`Env ${path} is not allowed! Allowed values are: ${JSON.stringify(allowValues, null, 2)}`);
	}

	return tmp;
};
const loadNullableString = (path: string, allowValues?: string[]): undefined | string => {
	const tmp = process.env[path];

	if (allowValues && !allowValues.includes(tmp ?? '')) {
		throw new Error(`Env ${path} is not allowed! Allowed values are: ${JSON.stringify(allowValues, null, 2)}`);
	}

	return tmp;
};

const loadNumber = (path: string): number => {
	const tmp = process.env[path];

	if (!tmp) {
		throw new Error(`Env ${path} was not found!`);
	}

	return parseInt(tmp, 10);
};
const loadNulableNumber = (path: string): undefined | number => {
	const tmp = process.env[path];

	if (tmp) {
		return parseInt(tmp, 10);
	}
	return undefined;
};

export const ENV_PORT = loadNumber('PORT');
export const ENV_ENV = loadString('ENV', ['DEV', 'BETA', 'PROD']) as 'DEV' | 'BETA' | 'PROD';

export const ENV_JWT_SECRET = loadString('JWT_SECRET');
export const ENV_JWT_EXPIRES_IN = loadString('JWT_EXPIRES_IN');
export const ENV_EMAIL_PASSWORD = loadString('EMAIL_PASSWORD');
