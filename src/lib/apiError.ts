import type { AxiosError } from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong"
) {
    const axiosError = error as AxiosError<{
        error?: string;
        message?: string;
    }>;

    return (
        axiosError.response?.data?.error ??
        axiosError.response?.data?.message ??
        axiosError.message ??
        fallback
    );
}
