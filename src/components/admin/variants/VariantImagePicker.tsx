import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface VariantImagePickerProps {
    images: File[];
    onChange: (images: File[]) => void;
    disabled?: boolean;
}

interface ImagePreview {
    file: File;
    url: string;
}

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function VariantImagePicker({
    images,
    onChange,
    disabled = false,
}: VariantImagePickerProps) {
    const [previews, setPreviews] = useState<ImagePreview[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const newPreviews = images.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [images]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        setError("");

        /*
         * Maximum number of images.
         */
        if (images.length + files.length > MAX_IMAGES) {
            setError(
                `You can upload a maximum of ${MAX_IMAGES} images per variant.`
            );

            e.target.value = "";
            return;
        }

        /*
         * Validate file type.
         */
        const invalidType = files.find(
            (file) => !ALLOWED_TYPES.includes(file.type)
        );

        if (invalidType) {
            setError(
                `${invalidType.name} is not a supported image format. Use JPG, PNG, or WEBP.`
            );

            e.target.value = "";
            return;
        }

        /*
         * Validate file size.
         */
        const oversizedFile = files.find(
            (file) => file.size > MAX_FILE_SIZE
        );

        if (oversizedFile) {
            setError(
                `${oversizedFile.name} is larger than 5 MB.`
            );

            e.target.value = "";
            return;
        }

        const existingFileKeys = new Set(
            images.map(
                (file) =>
                    `${file.name}-${file.size}-${file.lastModified}`
            )
        );

        const duplicateFiles = files.filter((file) =>
            existingFileKeys.has(
                `${file.name}-${file.size}-${file.lastModified}`
            )
        );

        if (duplicateFiles.length > 0) {
            setError(
                "One or more selected images have already been added."
            );

            e.target.value = "";
            return;
        }

        /*
         * Everything is valid.
         */
        onChange([...images, ...files]);

        /*
         * Allows selecting the same file again.
         */
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setError("");

        onChange(
            images.filter(
                (_, imageIndex) => imageIndex !== index
            )
        );
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground">
                Images{" "}
                <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-3">
                <label
                    className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium cursor-pointer transition-colors ${disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted"
                        }`}
                >
                    <ImagePlus className="size-4" />

                    Add Images

                    <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={
                            disabled ||
                            images.length >= MAX_IMAGES
                        }
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {images.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {images.length}/{MAX_IMAGES} images
                    </span>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}

            {previews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {previews.map((preview, index) => (
                        <div
                            key={`${preview.file.name}-${index}`}
                            className="relative group w-24 h-28 rounded-md overflow-hidden border bg-muted"
                        >
                            <img
                                src={preview.url}
                                alt={preview.file.name}
                                className="w-full h-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    removeImage(index)
                                }
                                disabled={disabled}
                                className="absolute top-1 right-1 rounded-full bg-black/70 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                                aria-label={`Remove ${preview.file.name}`}
                            >
                                <X className="size-3" />
                            </button>

                            {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                                    Main Image
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="border border-dashed rounded-md py-8 flex flex-col items-center justify-center text-muted-foreground">
                    <ImagePlus className="size-6 mb-2" />

                    <p className="text-xs">
                        Add at least one product image
                    </p>

                    <p className="text-[11px] mt-1">
                        JPG, PNG or WEBP · Max 5 MB each · Up to 6 images
                    </p>
                </div>
            )}
        </div>
    );
}