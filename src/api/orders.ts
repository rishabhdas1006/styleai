import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cartKeys } from "@/api/cart";
import axiosInstance from "@/lib/axios";
import type { Order } from "@/types";

export const orderKeys = {
    all: ["orders"] as const,
    lists: () => [...orderKeys.all, "list"] as const,
    detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};

export async function checkout() {
    const { data } = await axiosInstance.post<Order>("/orders/checkout");
    return data;
}

export async function getOrders() {
    const { data } = await axiosInstance.get<Order[]>("/orders");
    return data;
}

export async function getOrderById(id: number) {
    const { data } = await axiosInstance.get<Order>(`/orders/${id}`);
    return data;
}

export function useCheckoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: checkout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useGetOrdersQuery(enabled = true) {
    return useQuery({
        queryKey: orderKeys.lists(),
        queryFn: getOrders,
        enabled,
    });
}

export function useGetOrderByIdQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => getOrderById(id),
        enabled,
    });
}
