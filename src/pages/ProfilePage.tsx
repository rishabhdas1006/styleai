import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from "@/api/auth";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuth } from "@/lib/authStore";

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();

    const { data: user, isLoading: profileLoading } =
        useGetProfileQuery(isAuthenticated);

    const updateProfileMutation = useUpdateProfileMutation();

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.name.trim() || !form.email.trim()) {
            setError("Name and email are required.");
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                name: form.name.trim(),
                email: form.email.trim(),
            });

            setSuccess("Profile updated successfully!");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to update profile"));
        }
    };

    return (
        <div className="max-w-lg mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                >
                    Home
                </Link>

                <span>/</span>

                <span className="text-foreground">
                    Profile
                </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight mb-8">
                MY PROFILE
            </h1>

            {profileLoading ? (
                <div className="space-y-4">
                    <div className="h-10 rounded bg-foreground/5 animate-pulse" />
                    <div className="h-10 rounded bg-foreground/5 animate-pulse" />
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            Name
                        </label>

                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium"
                        >
                            Email
                        </label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                            Role
                        </label>

                        <p className="text-sm capitalize px-3 py-2 rounded-md bg-muted">
                            {user?.role}
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-sm text-green-600 font-medium">
                            {success}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full"
                    >
                        {updateProfileMutation.isPending
                            ? "Saving..."
                            : "Update Profile"}
                    </Button>
                </form>
            )}
        </div>
    );
}
