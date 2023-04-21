export const isAlphaNumeric = (str: string): boolean => {
	const reg = /^[a-zA-Z0-9]+$/;
	return reg.test(str);
};
