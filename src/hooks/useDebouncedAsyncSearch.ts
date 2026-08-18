import { useEffect, useRef, useState } from "react";

interface UseDebouncedAsyncSearchOptions<T> {
    query: string;
    search: (query: string, signal: AbortSignal) => Promise<T[]>;
    debounceMs?: number;
    minCharacters?: number;
}

export function useDebouncedAsyncSearch<T>({
    debounceMs = 300,
    minCharacters = 2,
    query,
    search,
}: UseDebouncedAsyncSearchOptions<T>) {
    const [results, setResults] = useState<T[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestIdRef = useRef(0);
    const isBelowMinimum = query.trim().length < minCharacters;

    useEffect(() => {
        const normalizedQuery = query.trim();
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        if (normalizedQuery.length < minCharacters) {
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setIsSearching(true);
            setError(null);

            try {
                const nextResults = await search(
                    normalizedQuery,
                    controller.signal
                );

                if (
                    !controller.signal.aborted &&
                    requestIdRef.current === requestId
                ) {
                    setResults(nextResults);
                }
            } catch (err) {
                if (controller.signal.aborted) return;

                if (requestIdRef.current === requestId) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Search failed";

                    setError(message);
                    setResults([]);
                }
            } finally {
                if (
                    !controller.signal.aborted &&
                    requestIdRef.current === requestId
                ) {
                    setIsSearching(false);
                }
            }
        }, debounceMs);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [debounceMs, minCharacters, query, search]);

    return {
        error: isBelowMinimum ? null : error,
        isSearching: isBelowMinimum ? false : isSearching,
        minCharacters,
        results: isBelowMinimum ? [] : results,
    };
}
