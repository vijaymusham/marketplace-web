"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, X } from "lucide-react";
import ImageCropModal from "./ImageCropModal";

const DEFAULT_MAX_PHOTOS = 12;

export type PhotoUploadProps = {
    /** Called whenever the cropped photo list changes. */
    onChange: (files: File[]) => void;
    maxPhotos?: number;
    /** External error (e.g. from form submit). Cleared when photos change. */
    error?: string | null;
    label?: string;
    className?: string;
};

type PhotoItem = {
    id: string;
    url: string;
    file: File;
};

type CropQueueItem = {
    id: string;
    url: string;
    file: File;
};

/**
 * Self-contained square-crop photo picker.
 * Import and use — returns cropped `File[]` via `onChange`.
 *
 * @example
 * const [photos, setPhotos] = useState<File[]>([]);
 * <PhotoUpload onChange={setPhotos} error={photoError} />
 */
export default function PhotoUpload({
    onChange,
    maxPhotos = DEFAULT_MAX_PHOTOS,
    error: externalError = null,
    label = "Photos",
    className = "",
}: PhotoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [cropQueue, setCropQueue] = useState<CropQueueItem[]>([]);
    const [cropBatchDone, setCropBatchDone] = useState(0);
    const [cropBatchTotal, setCropBatchTotal] = useState(0);
    const [internalError, setInternalError] = useState<string | null>(null);

    const displayError = internalError ?? externalError;

    const emitChange = (next: PhotoItem[]) => {
        setPhotos(next);
        onChange(next.map((p) => p.file));
    };

    const addPhotos = (files: FileList | null) => {
        if (!files?.length) return;
        const remaining = maxPhotos - photos.length - cropQueue.length;
        if (remaining <= 0) {
            setInternalError(`You can upload up to ${maxPhotos} photos`);
            return;
        }

        const next = Array.from(files)
            .filter((file) => file.type.startsWith("image/"))
            .slice(0, remaining)
            .map((file) => ({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                url: URL.createObjectURL(file),
                file,
            }));

        if (!next.length) {
            setInternalError("Please choose image files");
            return;
        }

        const startingFresh = cropQueue.length === 0;
        if (startingFresh) {
            setCropBatchTotal(next.length);
            setCropBatchDone(0);
        } else {
            setCropBatchTotal((n) => n + next.length);
        }
        setCropQueue((prev) => [...prev, ...next]);
        setInternalError(null);
    };

    const advanceCropQueue = () => {
        setCropQueue((prev) => {
            const [current, ...rest] = prev;
            if (current) URL.revokeObjectURL(current.url);
            return rest;
        });
    };

    const handleCropComplete = (croppedFile: File) => {
        const url = URL.createObjectURL(croppedFile);
        const item: PhotoItem = {
            id: `${croppedFile.name}-${croppedFile.lastModified}-${Math.random()}`,
            url,
            file: croppedFile,
        };
        const next = [...photos, item];
        emitChange(next);

        if (cropQueue.length <= 1) {
            setCropBatchTotal(0);
            setCropBatchDone(0);
        } else {
            setCropBatchDone((n) => n + 1);
        }
        advanceCropQueue();
        setInternalError(null);
    };

    const handleCropSkip = () => {
        if (cropQueue.length <= 1) {
            setCropBatchTotal(0);
            setCropBatchDone(0);
        } else {
            setCropBatchDone((n) => n + 1);
        }
        advanceCropQueue();
    };

    const handleCropCancelAll = () => {
        setCropQueue((prev) => {
            prev.forEach((item) => URL.revokeObjectURL(item.url));
            return [];
        });
        setCropBatchTotal(0);
        setCropBatchDone(0);
    };

    const removePhoto = (id: string) => {
        const target = photos.find((p) => p.id === id);
        if (target) URL.revokeObjectURL(target.url);
        const next = photos.filter((p) => p.id !== id);
        emitChange(next);
        setInternalError(null);
    };

    useEffect(() => {
        return () => {
            photos.forEach((p) => URL.revokeObjectURL(p.url));
            cropQueue.forEach((p) => URL.revokeObjectURL(p.url));
        };
        // Only revoke on unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={className}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <span className="text-[11px] font-medium text-slate-400">
                    {photos.length}/{maxPhotos}
                </span>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                }}
            />
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {photos.length < maxPhotos && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                        <ImagePlus className="size-5" strokeWidth={1.75} />
                        <span className="text-[10px] font-bold">Add</span>
                    </button>
                )}
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={photo.url}
                            alt={`Upload ${index + 1}`}
                            className="size-full object-cover"
                        />
                        {index === 0 && (
                            <span className="absolute top-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                                Cover
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            aria-label={`Remove photo ${index + 1}`}
                            className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <X className="size-3" strokeWidth={2.5} />
                        </button>
                    </div>
                ))}
                {Array.from({
                    length: Math.max(
                        0,
                        Math.min(4, maxPhotos - photos.length - 1)
                    ),
                }).map((_, i) => (
                    <button
                        key={`slot-${i}`}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white text-slate-300 transition-colors hover:border-slate-300 hover:text-slate-400"
                    >
                        <Camera className="size-5" strokeWidth={1.75} />
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                {displayError ? (
                    <motion.p
                        key={displayError}
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-xs font-semibold text-red-500"
                    >
                        {displayError}
                    </motion.p>
                ) : null}
            </AnimatePresence>

            {cropQueue[0] ? (
                <ImageCropModal
                    key={cropQueue[0].id}
                    imageSrc={cropQueue[0].url}
                    fileName={cropQueue[0].file.name}
                    queueIndex={cropBatchDone}
                    queueTotal={cropBatchTotal}
                    onComplete={handleCropComplete}
                    onSkip={handleCropSkip}
                    onCancelAll={handleCropCancelAll}
                />
            ) : null}
        </div>
    );
}
