import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDebouncedAsyncSearch } from "@/hooks/useDebouncedAsyncSearch";

interface AsyncSearchSelectProps<T> {
    debounceMs?: number;
    disabled?: boolean;
    emptyMessage?: string;
    getOptionKey: (option: T) => string | number;
    getOptionLabel: (option: T) => string;
    id?: string;
    label?: string;
    minCharacters?: number;
    onChange: (option: T | null) => void;
    placeholder?: string;
    search: (query: string, signal: AbortSignal) => Promise<T[]>;
    selectedOption: T | null;
}

export default function AsyncSearchSelect<T>({
    debounceMs = 300,
    disabled = false,
    emptyMessage = "No results found.",
    getOptionKey,
    getOptionLabel,
    id,
    label,
    minCharacters = 2,
    onChange,
    placeholder = "Search...",
    search,
    selectedOption,
}: AsyncSearchSelectProps<T>) {
    const generatedInputId = useId();
    const inputId = id ?? generatedInputId;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { error, isSearching, results } = useDebouncedAsyncSearch<T>({
        debounceMs,
        minCharacters,
        query,
        search,
    });

    const selectedLabel = selectedOption
        ? getOptionLabel(selectedOption)
        : "";
    const visibleValue = open ? query : selectedLabel;
    const canSearch = query.trim().length >= minCharacters;
    const listId = `${inputId}-list`;

    const statusMessage = useMemo(() => {
        if (!open) return "";
        if (!canSearch) {
            return `Type at least ${minCharacters} characters.`;
        }
        if (isSearching) return "Searching...";
        if (error) return error;
        if (!results.length) return emptyMessage;

        return "";
    }, [canSearch, emptyMessage, error, isSearching, minCharacters, open, results.length]);

    useEffect(() => {
        let timer: number | undefined;

        if (!open) {
            timer = window.setTimeout(() => setActiveIndex(null), 0);
            return () => window.clearTimeout(timer);
        }

        if (results.length > 0) {
            timer = window.setTimeout(() => {
                setActiveIndex((prev) =>
                    prev === null ? 0 : Math.min(prev, results.length - 1)
                );
            }, 0);
        } else {
            timer = window.setTimeout(() => setActiveIndex(null), 0);
        }

        return () => window.clearTimeout(timer);
    }, [results, open]);

    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setQuery("");
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    useEffect(() => {
        if (disabled) {
            setOpen(false);
            setQuery("");
            setActiveIndex(null);
        }
    }, [disabled]);

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.5}
                />

                <Input
                    id={inputId}
                    disabled={disabled}
                    value={visibleValue}
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                        if (selectedOption) onChange(null);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setOpen(false);
                            setQuery("");
                            setActiveIndex(null);
                            return;
                        }

                        if (event.key === "ArrowDown") {
                            event.preventDefault();
                            if (!open) {
                                setOpen(true);
                                setActiveIndex(0);
                                return;
                            }

                            if (results.length > 0) {
                                setActiveIndex((prev) => {
                                    if (prev === null) return 0;
                                    return Math.min(prev + 1, results.length - 1);
                                });
                            }
                        }

                        if (event.key === "ArrowUp") {
                            event.preventDefault();
                            if (results.length > 0) {
                                setActiveIndex((prev) => {
                                    if (prev === null) return results.length - 1;
                                    return Math.max(prev - 1, 0);
                                });
                            }
                        }

                        if (event.key === "Enter") {
                            if (open && activeIndex !== null && results[activeIndex]) {
                                event.preventDefault();
                                const option = results[activeIndex];
                                onChange(option);
                                setQuery("");
                                setOpen(false);
                                setActiveIndex(null);
                            }
                        }
                    }}
                    placeholder={placeholder}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-activedescendant={
                        activeIndex !== null ? `${listId}-option-${activeIndex}` : undefined
                    }
                    aria-autocomplete="list"
                    className="h-10 pl-10 pr-10"
                />

                {isSearching ? (
                    <Loader2
                        className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                        strokeWidth={1.5}
                    />
                ) : selectedOption ? (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onChange(null);
                            setQuery("");
                            setOpen(true);
                        }}
                        aria-label="Clear selection"
                    >
                        <X className="size-4" strokeWidth={1.5} />
                    </button>
                ) : null}
            </div>

            {open && (
                <div
                    id={listId}
                    role="listbox"
                    className="absolute z-50 mt-2 max-h-64 w-full overflow-auto border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                    {statusMessage ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            {statusMessage}
                        </div>
                    ) : (
                        results.map((option, index) => {
                            const key = getOptionKey(option);
                            const optionLabel = getOptionLabel(option);
                            const selected = Boolean(
                                selectedOption &&
                                getOptionKey(selectedOption) === key
                            );

                            const isActive = activeIndex === index;

                            return (
                                <button
                                    id={`${listId}-option-${index}`}
                                    key={key}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    className={cn(
                                        "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                                        selected && "bg-muted",
                                        isActive && "bg-slate-100"
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => {
                                        onChange(option);
                                        setQuery("");
                                        setOpen(false);
                                        setActiveIndex(null);
                                    }}
                                >
                                    <span>{optionLabel}</span>
                                    {selected && (
                                        <Check
                                            className="size-4"
                                            strokeWidth={1.5}
                                        />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
