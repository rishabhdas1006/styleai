import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import type {
    Category,
    CreateProductPayload,
    CreateVariantPayload,
    UpdateVariantPayload,
    PaginatedResponse,
    Product,
    ProductDetail,
    ProductsQueryParams,
    ProductVariant,
} from "@/types";

type RawCategory = {
    ID: number;
    Name: string;
};

type RawProduct = {
    ID: number;
    Name: string;
    Description: string;
    Brand: string;
    CategoryID: number;
    Gender: string;
    MinPrice: number;

    PrimaryImageURL: string;
    PrimaryImagePublicID: string;

    Category?: RawCategory;
};

type RawVariant = {
    ID: string;
    Size: string;
    Color: string;
    SKU: string;
    Price: number;
    Stock: number;
    Images:
    | Array<{
        ImageURL: string;
        Position: number;
    }>
    | null;
};

const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params?: ProductsQueryParams) =>
        [...productKeys.lists(), params ?? {}] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
    variants: (id: number) => [...productKeys.detail(id), "variants"] as const,
};

const categoryKeys = {
    all: ["categories"] as const,
    lists: () => [...categoryKeys.all, "list"] as const,
    mine: () => [...categoryKeys.all, "mine"] as const,
};

function normalizeProduct(product: RawProduct): Product {
    return {
        id: product.ID,
        name: product.Name,
        description: product.Description,
        brand: product.Brand,
        category: product.Category?.Name ?? "",
        price: product.MinPrice,
        image: product.PrimaryImageURL ?? "",
    };
}

function normalizeVariant(variant: RawVariant): ProductVariant {
    return {
        id: variant.ID,
        size: variant.Size,
        color: variant.Color,
        colorName: variant.Color,
        sku: variant.SKU,
        stock: variant.Stock,
        price: variant.Price,
        images: (variant.Images ?? [])
            .sort((a, b) => a.Position - b.Position)
            .map((img) => img.ImageURL),
    };
}

function normalizeCategory(category: RawCategory): Category {
    return {
        id: category.ID,
        name: category.Name,
    };
}

function toProductQueryParams(params?: ProductsQueryParams) {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.limit !== undefined) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.category) queryParams.category = params.category;
    if (params?.brand) queryParams.brand = params.brand;
    if (params?.gender) queryParams.gender = params.gender;
    if (params?.color) queryParams.color = params.color;
    if (params?.size) queryParams.size = params.size;
    if (params?.minPrice) queryParams.minPrice = params.minPrice;
    if (params?.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.mine !== undefined) queryParams.mine = params.mine;

    return queryParams;
}

export async function getProducts(params?: ProductsQueryParams) {
    const { data } = await axiosInstance.get<{
        data?: Product[];
        products?: RawProduct[];
    }>("/products", {
        params: {
            limit: 50,
            ...(params?.mine !== undefined ? { mine: params.mine } : {}),
        },
    });

    if (data.products) return data.products.map(normalizeProduct);
    return data.data ?? [];
}

export async function getPaginatedProducts(params: ProductsQueryParams) {
    const { data } = await axiosInstance.get<{
        products: RawProduct[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>("/products", {
        params: toProductQueryParams(params),
    });

    return {
        data: data.products.map(normalizeProduct),
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
    } satisfies PaginatedResponse<Product>;
}

export async function getProductById(id: number) {
    const { data } = await axiosInstance.get<{
        product: RawProduct & {
            Variants: RawVariant[] | null;
        };
    }>(`/products/${id}`);

    const product = data.product;
    const variants = (product.Variants ?? []).map(normalizeVariant);
    const allImages = variants.flatMap((variant) => variant.images).filter(Boolean);

    return {
        id: product.ID,
        name: product.Name,
        categoryId: product.CategoryID,
        categoryName: product.Category?.Name ?? "",
        brand: product.Brand,
        price: product.MinPrice,
        description: product.Description,
        image: allImages[0] ?? "",
        images: allImages.length ? [...new Set(allImages)] : [],
        availableColors: [
            ...new Map(
                variants.map((variant) => [
                    variant.color,
                    {
                        name: variant.colorName,
                        hex: variant.color,
                    },
                ])
            ).values(),
        ],
        variants,
    } satisfies ProductDetail;
}

export async function getProductVariants(id: number) {
    const { data } = await axiosInstance.get<{
        variants: RawVariant[] | null;
    }>(`/products/${id}/variants`);

    return (data.variants ?? []).map(normalizeVariant);
}

export async function getCategories() {
    const { data } = await axiosInstance.get<{
        categories?: RawCategory[];
        data?: RawCategory[];
    }>("/categories");

    return (data.categories ?? data.data ?? []).map(normalizeCategory);
}

export async function getMyCategories() {
    const { data } = await axiosInstance.get<{
        categories: RawCategory[];
    }>("/admin/categories/my");

    return (data.categories ?? []).map(normalizeCategory);
}

export async function createCategory(payload: { name: string }) {
    const { data } = await axiosInstance.post<{
        category: RawCategory;
    }>("/admin/categories", payload);

    return normalizeCategory(data.category);
}

export async function createProduct(payload: CreateProductPayload) {
    const { data } = await axiosInstance.post<{
        product: {
            ID: number;
        };
    }>("/admin/products", payload);

    return {
        id: data.product.ID,
    };
}

export async function createVariant({
    productId,
    variant,
}: {
    productId: number;
    variant: CreateVariantPayload;
}) {
    await axiosInstance.post(`/admin/products/${productId}/variants`, variant);
}

export async function updateVariant({
    variantId,
    price,
    stock,
}: UpdateVariantPayload) {
    const payload: {
        price?: number;
        stock?: number;
    } = {};

    if (price !== undefined) {
        payload.price = price;
    }

    if (stock !== undefined) {
        payload.stock = stock;
    }

    const { data } = await axiosInstance.put(
        `/admin/variants/${variantId}`,
        payload
    );

    return data.variant;
}

export async function deleteVariant(variantId: string) {
    const { data } = await axiosInstance.delete(
        `/admin/variants/${variantId}`
    );

    return data;
}

export function useGetProductsQuery(params?: ProductsQueryParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
    });
}

export function useGetPaginatedProductsQuery(params: ProductsQueryParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getPaginatedProducts(params),
    });
}

export function useGetProductByIdQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
        enabled,
    });
}

export function useGetProductVariantsQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: productKeys.variants(id),
        queryFn: () => getProductVariants(id),
        enabled,
    });
}

export function useGetCategoriesQuery(enabled = true) {
    return useQuery({
        queryKey: categoryKeys.lists(),
        queryFn: getCategories,
        enabled,
    });
}

export function useGetMyCategoriesQuery(enabled = true) {
    return useQuery({
        queryKey: categoryKeys.mine(),
        queryFn: getMyCategories,
        enabled,
    });
}

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}

export function useCreateProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

export function useCreateVariantMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVariant,

        onSuccess: (_data, { productId }) => {
            queryClient.invalidateQueries({
                queryKey: productKeys.detail(productId),
            });

            queryClient.invalidateQueries({
                queryKey: productKeys.variants(productId),
            });

            queryClient.invalidateQueries({
                queryKey: productKeys.lists(),
            });
        },
    });
}

export function useUpdateVariantMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVariant,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.all,
            });
        },
    });
}

export function useDeleteVariantMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVariant,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.all,
            });
        },
    });
}