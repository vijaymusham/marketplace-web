"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ZoomIn } from "lucide-react";
import { getCroppedImageFile } from "./cropImage";

type ImageCropModalProps = {
    imageSrc: string;
    fileName: string;
    queueIndex: number;
    queueTotal: number;
    onComplete: (file: File) => void;
    onSkip: () => void;
    onCancelAll: () => void;
};

export default function ImageCropModal({
    imageSrc,
    fileName,
    queueIndex,
    queueTotal,
    onComplete,
    onSkip,
    onCancelAll,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [saving, setSaving] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels || saving) return;
        setSaving(true);
        try {
            const file = await getCroppedImageFile(
                imageSrc,
                croppedAreaPixels,
                fileName
            );
            onComplete(file);
        } catch {
            onSkip();
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crop-modal-title"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
                    onClick={onCancelAll}
                />

                <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
                >
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <div className="min-w-0">
                            <h3
                                id="crop-modal-title"
                                className="text-base font-extrabold text-slate-900"
                            >
                                Crop photo
                            </h3>
                            <p className="text-xs font-semibold text-slate-400">
                                Square crop · {queueIndex + 1} of {queueTotal}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancelAll}
                            aria-label="Cancel cropping"
                            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                        >
                            <X className="size-4" strokeWidth={2.5} />
                        </button>
                    </header>

                    <div className="relative aspect-square w-full bg-slate-900">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="rect"
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div className="space-y-4 px-5 py-4">
                        <label className="flex items-center gap-3">
                            <ZoomIn className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.05}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary"
                                aria-label="Zoom"
                            />
                        </label>

                        <div className="flex gap-2.5">
                            <button
                                type="button"
                                onClick={onSkip}
                                disabled={saving}
                                className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                            >
                                Skip
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={saving || !croppedAreaPixels}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                            >
                                <Check className="size-4" strokeWidth={2.5} />
                                {saving ? "Saving…" : "Use photo"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
