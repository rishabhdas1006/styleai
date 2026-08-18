import axiosInstance from "@/lib/axios";
import type { Category } from "@/types";

type RawCategory = {
    ID?: number;
    CategoryID?: number;
    id?: number;
    Name?: string;
    Category?: {
        ID?: number;
        Name?: string;
        id?: number;
        name?: string;
    };
    name?: string;
};

type CategoriesResponse =
    | {
        categories?: RawCategory[];
        data?: RawCategory[];
    }
    | RawCategory[];

export async function searchCategories(
    query: string,
    signal: AbortSignal
): Promise<Category[]> {
    const response = await axiosInstance.get<CategoriesResponse>(
        "/categories",
        { signal }
    );

    const rawCategories = Array.isArray(response.data)
        ? response.data
        : response.data.categories ?? response.data.data ?? [];

    const normalizedQuery = query.toLowerCase();
    const uniqueCategories = new Map<number, Category>();

    rawCategories
        .map((category) => ({
            id:
                category.ID ??
                category.CategoryID ??
                category.id ??
                category.Category?.ID ??
                category.Category?.id ??
                0,
            name:
                category.Name ??
                category.name ??
                category.Category?.Name ??
                category.Category?.name ??
                "",
        }))
        .filter((category): category is Category =>
            Boolean(category.id && category.name)
        )
        .filter((category) =>
            category.name.toLowerCase().includes(normalizedQuery)
        )
        .forEach((category) => {
            uniqueCategories.set(category.id, category);
        });

    return [...uniqueCategories.values()];
}
