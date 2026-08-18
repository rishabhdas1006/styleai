import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import type { ServerCart, ServerCartItem } from "@/types";

interface RawCartItem {
    ID: number;
    CartID: number;
    VariantID: string;
    Quantity: number;
    Variant?: {
        ID: string;
        ProductID: number;
        Size: string;
        Color: string;
        SKU: string;
        Price: number;
        Stock: number;
        Product?: {
            ID: number;
            Name: string;
            Brand: string;
            CategoryID: number;
            Category?: {
                Name: string;
            };
        };
        Images?: Array<{
            ImageURL: string;
            Position: number;
        }>;
    };
}

function transformCartResponse(response: {
    cart: {
        ID: number;
        Items: RawCartItem[] | null;
    };
    total: number;
}): ServerCart {
    const items: ServerCartItem[] = (response.cart.Items ?? []).map((item) => ({
        id: item.ID,
        variantId: item.VariantID,
        quantity: item.Quantity,
        variant: {
            id: item.Variant?.ID ?? item.VariantID,
            size: item.Variant?.Size ?? "",
            color: item.Variant?.Color ?? "",
            colorName: item.Variant?.Color ?? "",
            price: item.Variant?.Price ?? 0,
            stock: item.Variant?.Stock ?? 0,
            images: (item.Variant?.Images ?? [])
                .sort((a, b) => a.Position - b.Position)
                .map((img) => img.ImageURL),
            product: {
                id: item.Variant?.Product?.ID ?? item.Variant?.ProductID ?? 0,
                name: item.Variant?.Product?.Name ?? "",
                category: item.Variant?.Product?.Category?.Name ?? "",
                brand: item.Variant?.Product?.Brand ?? "",
            },
        },
    }));

    return {
        items,
        total: response.total,
    };
}

export const cartKeys = {
    all: ["cart"] as const,
    detail: () => [...cartKeys.all, "detail"] as const,
};

export async function getCart() {
    const { data } = await axiosInstance.get<{
        cart: {
            ID: number;
            Items: RawCartItem[] | null;
        };
        total: number;
    }>("/cart");

    return transformCartResponse(data);
}

export async function addCartItem(payload: {
    variantId: string;
    quantity: number;
}) {
    await axiosInstance.post("/cart/items", {
        variant_id: payload.variantId,
        quantity: payload.quantity,
    });
}

export async function updateCartItem(payload: {
    id: number;
    quantity: number;
}) {
    await axiosInstance.put(`/cart/items/${payload.id}`, {
        quantity: payload.quantity,
    });
}

export async function removeCartItem(id: number) {
    const { data } = await axiosInstance.delete<ServerCart>(
        `/cart/items/${id}`
    );

    return data;
}

export function useGetCartQuery(enabled = true) {
    return useQuery({
        queryKey: cartKeys.detail(),
        queryFn: getCart,
        enabled,
    });
}

export function useAddCartItemMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
    });
}

export function useUpdateCartItemMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
    });
}

export function useRemoveCartItemMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
    });
}
