import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const region =
    process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "";
const bucket =
    process.env.AWS_BUCKET || process.env.NEXT_PUBLIC_AWS_BUCKET || "";
const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    "";
const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    "";

const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
});

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
        if (!region || !bucket || !accessKeyId || !secretAccessKey) {
            return NextResponse.json(
                { success: false, error: "S3 is not configured on the server" },
                { status: 500 },
            );
        }

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
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
