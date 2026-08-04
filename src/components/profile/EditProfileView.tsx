"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { getUser, updateProfile } from "@/components/api/apis";
import type { ApiError } from "@/components/api/customAxios";
import { setUser } from "@/components/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/components/redux/store";
import { useIsLoggedIn } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";
import { uploadToS3 } from "@/constant/helper/s3Upload";

type ProfileFormValues = {
    firstName: string;
    lastName: string;
    email: string;
};

const authInputClass =
    "w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none";

function AuthField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-100 px-4 py-3 transition-colors duration-150 focus-within:border-slate-400">
                <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                        {label}
                    </span>
                    {children}
                </span>
            </label>
            {error ? (
                <p role="alert" className="px-1 text-xs font-semibold text-red-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export default function EditProfileView() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isLoggedIn = useIsLoggedIn();
    const authData = useSelector((state: RootState) => state.user.user);
    const profile = authData?.user;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    useEffect(() => {
        if (!isLoggedIn) requestSignIn();
    }, [isLoggedIn]);

    useEffect(() => {
        if (!profile) return;
        reset({
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            email: profile.email ?? "",
        });
        setPhotoPreview(profile.profilePhoto);
        setPhotoFile(null);
    }, [profile, reset]);

    useEffect(() => {
        return () => {
            if (photoPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const onPickPhoto = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5 MB");
            return;
        }
        if (photoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values: ProfileFormValues) => {
        if (!authData || !profile || saving) return;

        const firstName = values.firstName.trim();
        const lastName = values.lastName.trim();
        const email = values.email.trim();
        const name = [firstName, lastName].filter(Boolean).join(" ");

        if (!isDirty && !photoFile) {
            toast("No changes to save");
            return;
        }

        setSaving(true);
        try {
            let profilePhoto = profile.profilePhoto ?? undefined;

            if (photoFile) {
                const uploaded = await uploadToS3(photoFile, "profiles");
                if (!uploaded.success || !uploaded.url) {
                    throw { message: "Failed to upload photo" } satisfies ApiError;
                }
                profilePhoto = uploaded.url;
            }

            await updateProfile({
                firstName,
                lastName,
                name,
                email,
                profilePhoto: profilePhoto ?? null,
            });

            const me = await getUser();
            if (me) {
                if (me.user && me.accessToken) {
                    dispatch(setUser(me));
                } else if (me.id) {
                    dispatch(
                        setUser({
                            ...authData,
                            user: {
                                ...profile,
                                ...me,
                                firstName: me.firstName ?? firstName,
                                lastName: me.lastName ?? lastName,
                                email: me.email ?? email,
                                profilePhoto: me.profilePhoto ?? profilePhoto ?? null,
                            },
                        }),
                    );
                } else {
                    dispatch(
                        setUser({
                            ...authData,
                            user: {
                                ...profile,
                                firstName,
                                lastName,
                                email,
                                profilePhoto: profilePhoto ?? null,
                            },
                        }),
                    );
                }
            } else {
                dispatch(
                    setUser({
                        ...authData,
                        user: {
                            ...profile,
                            firstName,
                            lastName,
                            email,
                            profilePhoto: profilePhoto ?? null,
                        },
                    }),
                );
            }

            setPhotoFile(null);
            toast.success("Profile updated");
            router.refresh();
        } catch (error) {
            const message =
                error && typeof error === "object" && "message" in error
                    ? String((error as ApiError).message)
                    : "Failed to update profile";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (!isLoggedIn || !profile) {
        return (
            <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <User className="h-8 w-8" strokeWidth={1.75} />
                </div>
                <h1 className="mt-5 font-heading text-2xl font-extrabold text-slate-900">
                    Sign in to edit your profile
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                    Your name, email, and photo stay with your DealPokket account.
                </p>
                <button
                    type="button"
                    onClick={() => requestSignIn()}
                    className="mt-6 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                >
                    Sign in
                </button>
            </div>
        );
    }

    const displayPhoto = photoPreview || profile.profilePhoto;

    return (
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 md:py-10">
            <header className="mb-8">
                <p className="text-sm font-semibold text-primary">Account</p>
                <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
                    Edit profile
                </h1>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                    Update your photo and personal details
                </p>
                <span className="mt-4 block h-1 w-10 rounded-full bg-primary" />
            </header>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-2 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer"
                        aria-label="Change profile photo"
                    >
                        <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-100 transition-all duration-200 group-hover:ring-primary/25">
                            {displayPhoto ? (
                                <Image
                                    src={displayPhoto}
                                    alt=""
                                    width={112}
                                    height={112}
                                    unoptimized
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/15 to-indigo-500/10 text-primary">
                                    <User className="h-12 w-12" strokeWidth={1.5} />
                                </span>
                            )}
                        </span>
                        <span className="absolute right-0.5 bottom-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform duration-200 group-hover:scale-105">
                            <Camera className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                        {displayPhoto ? "Change photo" : "Add photo"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            onPickPhoto(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                    />
                </div>

                <AuthField label="Phone number">
                    <span className="flex items-center gap-2">
                        <span className="text-base font-semibold text-slate-500">+91</span>
                        <span className="text-base font-semibold text-slate-900">
                            {profile.phone?.replace(/^\+?91/, "") || "—"}
                        </span>
                    </span>
                </AuthField>

                <AuthField label="First name" error={errors.firstName?.message}>
                    <input
                        type="text"
                        autoComplete="given-name"
                        placeholder="First name"
                        className={authInputClass}
                        aria-invalid={!!errors.firstName}
                        {...register("firstName", {
                            required: "First name is required",
                            minLength: { value: 2, message: "At least 2 characters" },
                            maxLength: { value: 50, message: "Too long" },
                        })}
                    />
                </AuthField>

                <AuthField label="Last name" error={errors.lastName?.message}>
                    <input
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last name"
                        className={authInputClass}
                        aria-invalid={!!errors.lastName}
                        {...register("lastName", {
                            maxLength: { value: 50, message: "Too long" },
                        })}
                    />
                </AuthField>

                <AuthField label="Email" error={errors.email?.message}>
                    <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={authInputClass}
                        aria-invalid={!!errors.email}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email",
                            },
                        })}
                    />
                </AuthField>

                <button
                    type="submit"
                    disabled={saving || (!isDirty && !photoFile)}
                    className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save changes"
                    )}
                </button>

                <Link
                    href="/"
                    className="text-center text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
