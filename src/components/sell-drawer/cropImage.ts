import type { Area } from "react-easy-crop";

const OUTPUT_SIZE = 1080;

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = src;
    });
}

export async function getCroppedImageFile(
    imageSrc: string,
    crop: Area,
    fileName: string,
    mimeType = "image/jpeg"
): Promise<File> {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) resolve(result);
                else reject(new Error("Failed to create image blob"));
            },
            mimeType,
            0.92
        );
    });

    const baseName = fileName.replace(/\.[^.]+$/, "") || "photo";
    const extension = mimeType === "image/png" ? "png" : "jpg";

    return new File([blob], `${baseName}-cropped.${extension}`, {
        type: mimeType,
        lastModified: Date.now(),
    });
}
