export function normalizeRole(role?: string | null) {
    return role?.trim().toLowerCase() || null;
}

export function getRoleFromToken(token?: string | null) {
    if (!token) return null;

    try {
        const [, payload] = token.split(".");
        if (!payload) return null;

        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(payload.length / 4) * 4, "=");

        const decoded = JSON.parse(atob(base64)) as {
            role?: string;
            Role?: string;
        };

        return normalizeRole(decoded.role ?? decoded.Role);
    } catch {
        return null;
    }
}
