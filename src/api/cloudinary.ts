import axiosInstance from "@/lib/axios";

interface SignatureResponse {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
}

export interface UploadedImage {
    url: string;
    public_id: string;
}

export async function getProductImageSignature() {
    const { data } = await axiosInstance.post<SignatureResponse>(
        "/admin/cloudinary/product-image/signature"
    );

    return data;
}

export async function uploadProductPrimaryImage({
    file,
    onProgress,
}: {
    file: File;
    onProgress?: (progress: number) => void;
}) {
    const signature = await getProductImageSignature();

    const uploaded = await uploadImageToCloudinary({
        file,
        signature,
        onProgress,
    });

    return {
        uploaded,
        folder: signature.folder,
    };
}

export async function cleanupProductImage(folder: string) {
    await axiosInstance.post(
        "/admin/cloudinary/product-image/cleanup",
        {
            folder,
        }
    );
}

export async function getCloudinarySignature({
    productId,
    variantId,
}: {
    productId: number;
    variantId: string;
}) {
    const { data } = await axiosInstance.post<SignatureResponse>(
        "/admin/cloudinary/signature",
        {
            productId: String(productId),
            variantId,
        }
    );

    return data;
}

interface UploadImageOptions {
    file: File;
    signature: SignatureResponse;
    onProgress?: (progress: number) => void;
}

export async function uploadImageToCloudinary({
    file,
    signature,
    onProgress,
}: UploadImageOptions): Promise<UploadedImage> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append(
        "timestamp",
        String(signature.timestamp)
    );
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", uploadUrl);

        xhr.upload.addEventListener(
            "progress",
            (event) => {
                if (!event.lengthComputable) {
                    return;
                }

                const progress = Math.round(
                    (event.loaded / event.total) * 100
                );

                onProgress?.(progress);
            }
        );

        xhr.addEventListener("load", () => {
            let data: {
                secure_url?: string;
                public_id?: string;
                error?: {
                    message?: string;
                };
            };

            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                reject(
                    new Error(
                        "Invalid response from Cloudinary."
                    )
                );
                return;
            }

            if (
                xhr.status < 200 ||
                xhr.status >= 300
            ) {
                reject(
                    new Error(
                        data.error?.message ||
                        "Failed to upload image to Cloudinary."
                    )
                );
                return;
            }

            if (
                !data.secure_url ||
                !data.public_id
            ) {
                reject(
                    new Error(
                        "Cloudinary did not return image information."
                    )
                );
                return;
            }

            resolve({
                url: data.secure_url,
                public_id: data.public_id,
            });
        });

        xhr.addEventListener("error", () => {
            reject(
                new Error(
                    "Network error while uploading image."
                )
            );
        });

        xhr.addEventListener("abort", () => {
            reject(
                new Error("Image upload was cancelled.")
            );
        });

        xhr.send(formData);
    });
}

export async function uploadVariantImages({
    productId,
    variantId,
    files,
    onImageProgress,
    onImageComplete,
}: {
    productId: number;
    variantId: string;
    files: File[];
    onImageProgress?: (
        imageIndex: number,
        progress: number
    ) => void;
    onImageComplete?: (
        imageIndex: number,
        completed: number,
        total: number
    ) => void;
}) {
    if (files.length === 0) {
        throw new Error(
            "Please select at least one image."
        );
    }

    const signature =
        await getCloudinarySignature({
            productId,
            variantId,
        });

    const uploadedImages: UploadedImage[] = [];

    for (
        let i = 0;
        i < files.length;
        i++
    ) {
        const uploaded =
            await uploadImageToCloudinary({
                file: files[i],
                signature,

                onProgress: (progress) => {
                    onImageProgress?.(
                        i,
                        progress
                    );
                },
            });

        uploadedImages.push(uploaded);

        onImageComplete?.(
            i,
            i + 1,
            files.length
        );
    }

    return uploadedImages;
}

export async function cleanupVariantImages({
    productId,
    variantId,
}: {
    productId: number;
    variantId: string;
}) {
    await axiosInstance.post(
        "/admin/cloudinary/cleanup",
        {
            productId: String(productId),
            variantId,
        }
    );
}