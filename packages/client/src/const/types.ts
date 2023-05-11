export interface UseQueryResponse<T> {
	isLoading: boolean;
	data?: T;
	error: unknown;
	refetch: () => Promise<T>;
}
