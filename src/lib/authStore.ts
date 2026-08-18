import { useSyncExternalStore } from "react";

import type { AuthResponse, User } from "@/types";
import { getRoleFromToken, normalizeRole } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

type AuthSnapshot = {
    token: string | null;
    role: string | null;
    user: User | null;
    isAuthenticated: boolean;
};

const listeners = new Set<() => void>();
let currentUser: User | null = null;

function computeSnapshot(): AuthSnapshot {
    const token = localStorage.getItem("token");
    const role =
        normalizeRole(localStorage.getItem("role")) ?? getRoleFromToken(token);

    return {
        token,
        role,
        user: currentUser,
        isAuthenticated: Boolean(token),
    };
}

// useSyncExternalStore requires a stable snapshot reference between updates.
let snapshot = computeSnapshot();

function readSnapshot(): AuthSnapshot {
    return snapshot;
}

function notify() {
    snapshot = computeSnapshot();
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function setAuthSession(auth: AuthResponse) {
    const role =
        normalizeRole(auth.role ?? auth.user?.role) ??
        getRoleFromToken(auth.token) ??
        "";

    currentUser = auth.user;
    localStorage.setItem("token", auth.token);
    localStorage.setItem("role", role);
    notify();
}

export function setAuthUser(user: User | null) {
    currentUser = user;
    notify();
}

export function clearAuthSession() {
    currentUser = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    queryClient.clear();
    notify();
}

export function getAuthSnapshot() {
    return readSnapshot();
}

export function useAuth() {
    return useSyncExternalStore(subscribe, readSnapshot, readSnapshot);
}
