import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface PrimaryImagePickerProps {
    image: File | null;
    onChange: (image: File | null) => void;
    disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function PrimaryImagePicker({
    image,
    onChange,
    disabled = false,
}: PrimaryImagePickerProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setError("");

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Use JPG, PNG, or WEBP.");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Image must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        onChange(file);

        e.target.value = "";
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">
                Primary Image{" "}
                <span className="text-red-500">*</span>
            </label>

            {!image ? (
                <label
                    className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed ${disabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-muted"
                        }`}
                >
                    <ImagePlus className="mb-2 size-6" />

                    <span className="text-sm font-medium">
                        Add Primary Image
                    </span>

                    <span className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG or WEBP · Max 5 MB
                    </span>

                    <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={disabled}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="relative w-48">
                    <div className="aspect-[3/4] overflow-hidden rounded-md border bg-muted">
                        {preview && (
                            <img
                                src={preview}
                                alt="Primary product"
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        disabled={disabled}
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black disabled:opacity-50"
                        aria-label="Remove primary image"
                    >
                        <X className="size-3.5" />
                    </button>

                    <div className="mt-2 text-xs text-muted-foreground">
                        Primary image
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}