import { createElement } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeadingProps<T extends ElementType = "h1"> {
    as?: T;
    title: ReactNode;
    subtitle?: ReactNode;
    className?: string;
}

export function PageHeading<T extends ElementType = "h1">({
    as,
    title,
    subtitle,
    className,
    ...props
}: PageHeadingProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof PageHeadingProps>) {
    const Component = (as ?? "h1") as ElementType;
    const componentProps = props as ComponentPropsWithoutRef<T>;

    return (
        <div className={cn(className)}>
            {createElement(
                Component,
                {
                    ...componentProps,
                    className: cn(
                        "font-display text-3xl font-bold tracking-tight text-black",
                        componentProps.className
                    ),
                },
                title
            )}

            {subtitle ? (
                <p className="mt-2 text-sm text-black/55">
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}
