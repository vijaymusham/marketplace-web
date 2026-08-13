"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Check, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { getUser, updateProfile } from "@/components/api/apis";
import type { ApiError } from "@/components/api/customAxios";
import { setUser } from "@/components/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/components/redux/store";
import { useIsLoggedIn } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";
import { uploadToS3 } from "@/constant/helper/s3Upload";
import GlowButton from "@/components/ui/GlowButton";

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
            <label className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-100 px-4 py-3 transition-colors duration-150 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200">
                <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
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

function InfoChip({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <div className="flex min-h-17 flex-col justify-between rounded-2xl bg-slate-100/90 px-3.5 py-3">
            <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                    {label}
                </span>
                {hint ? (
                    <span className="text-[11px] font-semibold text-slate-400">{hint}</span>
                ) : null}
            </div>
            <p className="mt-2 truncate text-sm font-bold text-slate-900">{value}</p>
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
        control,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const watchedFirst = useWatch({ control, name: "firstName" });
    const watchedLast = useWatch({ control, name: "lastName" });

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
        if (profile.profilePhoto) {
            setTimeout(() => {
                setPhotoPreview(profile.profilePhoto);
            }, 100);
        }
        setTimeout(() => {
            setPhotoFile(null);
        }, 100);
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
                <GlowButton
                    type="button"
                    onClick={() => requestSignIn()}
                    size="lg"
                    className="mt-6"
                >
                    Sign in
                </GlowButton>
            </div>
        );
    }

    const displayPhoto = photoPreview || profile.profilePhoto;
    const displayName =
        [watchedFirst, watchedLast].map((v) => v?.trim()).filter(Boolean).join(" ") ||
        profile.username ||
        "Your profile";
    const phoneDigits = profile.phone?.replace(/^\+?91/, "") || "—";
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
        })
        : "—";
    const hasChanges = isDirty || !!photoFile;

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10">
            <header className="mb-2 flex flex-col-reverse  gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-heading text-xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                        Edit profile
                    </h1>
                    <p className="mt-0.5 sm:mt-1.5 text-xs font-medium text-slate-500 md:text-sm">
                        Update your photo and personal details
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-bold text-primary transition-colors bg-primary/10 hover:bg-primary hover:text-white duration-300"
                >
                    Go back
                </Link>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="overflow-hidden rounded-[1.75rem]  bg-white p-4  sm:p-5 md:rounded-4xl md:p-6">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
                        {/* Left: identity + form */}
                        <div className="flex min-w-0 flex-col">
                            <div className="flex items-center gap-3">
                                <div className="min-w-0">
                                    <p className="truncate  capitalize text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                        {displayName}
                                    </p>
                                    <p className="truncate text-sm font-medium text-slate-500">
                                        Member since {memberSince ? `on ${memberSince}` : "—"}
                                    </p>
                                </div>
                            </div>


                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <AuthField label="First name" error={errors.firstName?.message}>
                                    <input
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="First name"
                                        className={authInputClass}
                                        aria-invalid={!!errors.firstName}
                                        {...register("firstName", {
                                            required: "First name is required",
                                            minLength: {
                                                value: 2,
                                                message: "At least 2 characters",
                                            },
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

                                <div className="sm:col-span-2">
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
                                </div>
                                <div className="sm:col-span-2">
                                    <AuthField label="Phone (Verified)">
                                        <input
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder={`+91 ${phoneDigits}`}
                                            className={authInputClass}
                                            aria-invalid={!!errors.email}
                                            disabled
                                        />
                                    </AuthField>
                                </div>
                            </div>
                            <div className="mt-5  flex flex-wrap gap-2.5 justify-end">
                                <GlowButton
                                    type="submit"
                                    disabled={saving || !hasChanges}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" strokeWidth={2.5} />
                                            Save changes
                                        </>
                                    )}
                                </GlowButton>
                            </div>
                        </div>

                        {/* Right: large photo preview */}
                        <div className="order-first lg:order-0">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-3xl bg-slate-100 outline-none ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-primary md:rounded-[1.75rem] border border-slate-200/80"
                                aria-label="Change profile photo"
                            >
                                {displayPhoto ? (
                                    <Image
                                        src={displayPhoto}
                                        alt="Profile preview"
                                        fill
                                        unoptimized
                                        sizes="(max-width: 1024px) 100vw, 416px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-slate-100 via-slate-50 to-primary/10 text-slate-400">
                                        <User className="h-16 w-16" strokeWidth={1.25} />
                                        <span className="text-sm font-semibold">
                                            Add a profile photo
                                        </span>
                                    </span>
                                )}
                                <span className="absolute inset-0 bg-slate-900/0 transition-colors duration-200 group-hover:bg-slate-900/25 hidden sm:flex justify-center items-center text-sm font-bold text-transparent hover:text-white flex-col" >
                                    <Camera className="h-10 w-10 mr-2" strokeWidth={2.2} />
                                </span>
                                <div className="absolute h-6 w-20 bg-green-500 rounded-full flex items-center justify-center top-3 right-3">
                                    <p className="text-sm font-bold text-white">Verified</p>
                                </div>
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
                    </div>
                </div>


            </form>
        </div>
    );
}
