import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
});

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
        const extension = file.name.split(".").pop();

        const key = `${folder}/${Date.now()}.${extension}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET || "",
                Key: key,
                Body: file,
                ContentType: file.type,
            })
        );

        return {
            success: true,
            key,
            url: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET || ""}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || ""}.amazonaws.com/${key}`,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error,
        };
    }
};
