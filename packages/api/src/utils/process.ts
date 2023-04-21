export const enableErrorHandling = (): void => {
	process.on('uncaughtException', handleErrorAndExit);
	process.on('unhandledRejection', handleErrorAndExit);
};

export const enableExitSignalsHandling = (): void => {
	process.on('SIGINT', handleExitSignal);
	process.on('SIGTERM', handleExitSignal);
};

export const handleErrorAndExit = async (): Promise<void> => {
	await processShutdownCallbacks();

	await shutdown(1);
};

export const handleExitSignal = async (): Promise<void> => {
	await processShutdownCallbacks();
	await shutdown(0);
};

// shutdown callbacks
const onShutdownCallbacks: Array<() => void | Promise<void>> = [];

export const registerShutdownCallback = (callback: () => void | Promise<void>): void => {
	onShutdownCallbacks.push(callback);
};

const processShutdownCallbacks = async (): Promise<void> => {
	await Promise.all(onShutdownCallbacks.map(callback => callback()));
};

export const shutdown = (code: number): void => {
	process.exit(code);
};
