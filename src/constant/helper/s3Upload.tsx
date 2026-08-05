interface UploadResponse {
    success: boolean;
    key?: string;
    url?: string;
    error?: unknown;
}

export const uploadToS3 = async (
    file: File,
    folder: string = "uploads"
): Promise<UploadResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = (await response.json()) as UploadResponse & {
            error?: string;
        };

        if (!response.ok || !data.success || !data.url) {
            return {
                success: false,
                error: data.error || `Upload failed (${response.status})`,
            };
        }

        return {
            success: true,
            key: data.key,
            url: data.url,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error,
        };
    }
};
