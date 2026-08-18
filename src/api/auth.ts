import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { getRoleFromToken, normalizeRole } from "@/lib/auth";
import { setAuthSession, setAuthUser } from "@/lib/authStore";
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "@/types";

type AuthApiResponse = {
    token: string;
    role?: string;
    user?: User | null;
};

const normalizeAuthResponse = (response: AuthApiResponse): AuthResponse => ({
    token: response.token,
    role:
        normalizeRole(response.role ?? response.user?.role) ??
        getRoleFromToken(response.token) ??
        "",
    user: response.user ?? null,
});

export const authKeys = {
    all: ["auth"] as const,
    profile: () => [...authKeys.all, "profile"] as const,
};

export async function login(payload: LoginPayload) {
    const { data } = await axiosInstance.post<AuthApiResponse>(
        "/auth/login",
        payload
    );

    return normalizeAuthResponse(data);
}

export async function register(payload: RegisterPayload) {
    const { data } = await axiosInstance.post<AuthApiResponse>(
        "/auth/register",
        payload
    );

    return normalizeAuthResponse(data);
}

export async function getProfile() {
    const { data } = await axiosInstance.get<User>("/user/profile");
    return data;
}

export async function updateProfile(payload: {
    name?: string;
    email?: string;
}) {
    const { data } = await axiosInstance.put<User>("/user/profile", payload);
    return data;
}

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (auth) => {
            setAuthSession(auth);
            if (auth.user) {
                queryClient.setQueryData(authKeys.profile(), auth.user);
            }
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

export function useRegisterMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: (auth) => {
            setAuthSession(auth);
            if (auth.user) {
                queryClient.setQueryData(authKeys.profile(), auth.user);
            }
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

export function useGetProfileQuery(enabled = true) {
    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: getProfile,
        enabled,
    });
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (user) => {
            setAuthUser(user);
            queryClient.setQueryData(authKeys.profile(), user);
        },
    });
}
