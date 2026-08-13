import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function firstEnv(...keys: string[]) {
    for (const key of keys) {
        const value = process.env[key]?.trim();
        if (value) return value;
    }
    return "";
}

function s3Settings() {
    // Prefer S3-specific region vars. Generic AWS_REGION is often the host
    // platform region (e.g. us-east-1 on Vercel) and will 301 this bucket.
    return {
        region: firstEnv(
            "AWS_S3_REGION",
            "S3_REGION",
            "NEXT_PUBLIC_AWS_REGION",
            "AWS_REGION",
        ),
        bucket: firstEnv(
            "AWS_S3_BUCKET",
            "S3_BUCKET",
            "AWS_BUCKET",
            "NEXT_PUBLIC_AWS_BUCKET",
        ),
        accessKeyId: firstEnv(
            "AWS_ACCESS_KEY_ID",
            "NEXT_PUBLIC_AWS_ACCESS_KEY_ID",
        ),
        secretAccessKey: firstEnv(
            "AWS_SECRET_ACCESS_KEY",
            "NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY",
        ),
    };
}

function createS3Client(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
) {
    return new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
        followRegionRedirects: true,
    });
}

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
    try {
        const { region, bucket, accessKeyId, secretAccessKey } = s3Settings();
        if (!region || !bucket || !accessKeyId || !secretAccessKey) {
            return NextResponse.json(
                { success: false, error: "S3 is not configured on the server" },
                { status: 500 },
            );
        }

        const s3 = createS3Client(region, accessKeyId, secretAccessKey);

        const formData = await request.formData();
        const file = formData.get("file");
        const folderRaw = formData.get("folder");
        const folder =
            typeof folderRaw === "string" && folderRaw.trim()
                ? folderRaw.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "")
                : "uploads";

        if (!(file instanceof File)) {
            return NextResponse.json(
                { success: false, error: "Missing file" },
                { status: 400 },
            );
        }

        if (file.size <= 0 || file.size > MAX_BYTES) {
            return NextResponse.json(
                { success: false, error: "File must be between 1 byte and 10 MB" },
                { status: 400 },
            );
        }

        if (file.type && !ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { success: false, error: "Unsupported file type" },
                { status: 400 },
            );
        }

        const extension =
            file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
            "bin";
        const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
        const body = Buffer.from(await file.arrayBuffer());

        await s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: file.type || "application/octet-stream",
            }),
        );

        const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

        return NextResponse.json({ success: true, key, url });
    } catch (error) {
        console.error("S3 upload failed:", error);
        const message =
            error instanceof Error ? error.message : "Upload failed";
        const endpointHint =
            error &&
            typeof error === "object" &&
            "Endpoint" in error &&
            typeof error.Endpoint === "string"
                ? ` Use endpoint ${error.Endpoint}.`
                : "";
        return NextResponse.json(
            { success: false, error: `${message}${endpointHint}` },
            { status: 500 },
        );
    }
}
