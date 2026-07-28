"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { X, Camera, MapPin, Navigation, ImagePlus, Send } from "lucide-react";
import { normalizeApiCategories } from "@/lib/apiCategories";
import { locationTree } from "@/lib/locations";
import SelectDropdown from "./SelectDropdown";
import type { ApiCity, CreateAdPayload, SellFormValues } from "../types/AllTypes";
import { emptySellFormValues, SELL_FORM_COMMON_KEYS } from "../types/AllTypes";
import { inputClassName } from "@/constant/helper/classesHelper";
import { Field, formContainer, formItem, numberToWords } from "../../constant/helper/TextField";
import { type RootState } from "@/components/redux/store";
import { createSellForm, getCategories, getCities, getStates, type ApiError } from "@/components/api/apis";
import {
    AccessoriesForm,
    ACsForm,
    BedsWardrobesForm,
    BicyclesForm,
    BooksForm,
    CamerasLensesForm,
    CarsForm,
    CleaningPestControlForm,
    CommercialOtherVehiclesForm,
    ComputerAccessoriesForm,
    ComputersLaptopsForm,
    CyclingForm,
    DogsForm,
    EducationClassesForm,
    ElectronicsRepairServicesForm,
    FishesAquariumForm,
    ForRentHousesApartmentsForm,
    ForRentShopsOfficesForm,
    ForSaleHousesApartmentsForm,
    ForSaleNewProjectsPropertiesForm,
    ForSaleShopsOfficesForm,
    FridgesForm,
    GamesEntertainmentForm,
    GymFitnessForm,
    HardDisksPrintersMonitorsForm,
    HealthBeautyForm,
    HomeDecorGardenForm,
    HomeRenovationRepairForm,
    KidsClothingForm,
    KidsForm,
    KidsFurnitureForm,
    KitchenOtherAppliancesForm,
    KitchenwareForm,
    LandsPlotsForm,
    LegalDocumentationServicesForm,
    LightingForm,
    MenForm,
    MobilePhonesForm,
    MotorcyclesForm,
    MusicalInstrumentsForm,
    OtherHobbiesForm,
    OtherHouseholdItemsForm,
    OtherPetsForm,
    OtherServicesForm,
    OtherSportsForm,
    PackersMoversForm,
    PetFoodAccessoriesForm,
    PGGuestHousesForm,
    PramsWalkersForm,
    ScootersForm,
    SmartWatchesForm,
    SofaDiningForm,
    SparePartsForm,
    SportsEquipmentForm,
    TabletsForm,
    ToursTravelForm,
    ToysForm,
    TVsVideoAudioForm,
    WashingMachinesForm,
    WomenForm,
    // JobsForm,
} from "./FormBySubCategory";
import { yesNoOptions } from "@/components/data/FormOptions";
import { uploadToS3 } from "@/constant/helper/s3Upload";
import { useSelector } from "react-redux";

const MAX_PHOTOS = 12;

type PhotoItem = {
    id: string;
    url: string;
    file: File;
};

const emptySubscribe = () => () => { };

function useIsClient() {
    return useSyncExternalStore(emptySubscribe, () => true, () => false);
}



export default function SellForm({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const mounted = useIsClient();

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && <SellFormSession onClose={onClose} />}
        </AnimatePresence>,
        document.body
    );
}

function SellFormSession({ onClose }: { onClose: () => void }) {
    const user = useSelector((state: RootState) => state.user.user);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [locationTab, setLocationTab] = useState<"list" | "current">("list");
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [detecting, setDetecting] = useState(false);



    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<SellFormValues>({
        defaultValues: emptySellFormValues,
    });

    useEffect(() => {
        if (!user) return;
        reset((prev) => ({
            ...prev,
            sellerName: user.user.firstName + " " + user.user.lastName,
            mobile: user.user.phone ?? prev.mobile,
        }));
    }, [user, reset]);

    const selectedCategory = useWatch({ control, name: "category" });
    const selectedSubcategory = useWatch({ control, name: "subcategory" });
    const selectedState = useWatch({ control, name: "state" });
    const titleValue = useWatch({ control, name: "title" });
    const descriptionValue = useWatch({ control, name: "description" });
    const sellerNameValue = useWatch({ control, name: "sellerName" });
    const priceValue = useWatch({ control, name: "price" });


    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });


    const { data: apiStates = [] } = useQuery({
        queryKey: ["states"],
        queryFn: getStates,
    });

    const { data: apiCities = [] } = useQuery({
        queryKey: ["cities", selectedState],
        queryFn: () => getCities(selectedState || undefined),
        enabled: Boolean(selectedState),
    });

    const categories = useMemo(
        () => normalizeApiCategories(apiCategories),
        [apiCategories],
    );

    const categoryOptions = useMemo(
        () =>
            categories.map((cat) => {
                const Icon = cat.icon;
                return {
                    value: cat.name,
                    label: cat.name,
                    icon: <Icon className="h-5 w-5" />,
                };
            }),
        [categories],
    );

    const subcategoryOptions = useMemo(() => {
        const cat = categories.find((c) => c.name === selectedCategory);
        if (!cat) return [];
        return cat.subcategories.map((name) => ({
            value: name,
            label: name,
        }));
    }, [selectedCategory, categories]);

    const stateOptions = useMemo(
        () =>
            apiStates.map((s) => ({
                value: s.id,
                label: s.name,
            })),
        [apiStates],
    );
    const cityOptions = useMemo(
        () =>
            apiCities
                .map((c: ApiCity) => ({
                    value: String(c.id),
                    label: c.name,
                })),
        [apiCities],
    );
    // const neighbourhoodOptions = useMemo(
    //     () =>
    //         getNeighbourhoods(selectedState, selectedCity).map((name) => ({
    //             value: name,
    //             label: name,
    //         })),
    //     [selectedState, selectedCity]
    // );

    const addPhotos = (files: FileList | null) => {
        if (!files?.length) return;
        const remaining = MAX_PHOTOS - photos.length;
        if (remaining <= 0) {
            setPhotoError(`You can upload up to ${MAX_PHOTOS} photos`);
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
            setPhotoError("Please choose image files");
            return;
        }

        setPhotos((prev) => [...prev, ...next]);
        setPhotoError(null);
    };

    const removePhoto = (id: string) => {
        setPhotos((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((p) => p.id !== id);
        });
        setPhotoError(null);
    };

    useEffect(() => {
        return () => {
            photos.forEach((p) => URL.revokeObjectURL(p.url));
        };
        // Only revoke on unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Location is not supported on this device");
            return;
        }
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const fallback = locationTree[0];
                const city = fallback?.cities[0];
                const neighbourhood = city?.neighbourhoods[0] ?? "";
                setValue("latitude", String(position.coords.latitude), {
                    shouldValidate: true,
                });
                setValue("longitude", String(position.coords.longitude), {
                    shouldValidate: true,
                });
                if (fallback && city) {
                    setValue("state", fallback.name, { shouldValidate: true });
                    setValue("city", city.name, { shouldValidate: true });
                    setValue("neighbourhood", neighbourhood, {
                        shouldValidate: true,
                    });
                    toast.success(
                        `Location set to ${neighbourhood}, ${city.name}`
                    );
                }
                setDetecting(false);
            },
            () => {
                toast.error("Couldn’t detect your location");
                setDetecting(false);
            },
            { enableHighAccuracy: false, timeout: 8000 }
        );
    };

    const createSellFormMutation = useMutation({
        mutationFn: createSellForm,
        onSuccess: () => {
            toast.success("Post is live now! 🥳");
            void queryClient.invalidateQueries({ queryKey: ["freshRecommendations"] });
            void queryClient.invalidateQueries({ queryKey: ["adsBySection"] });
            void queryClient.invalidateQueries({ queryKey: ["myAds"] });
            onClose();
        },
        onError: (error: ApiError) => {
            toast.error(error.message || "Failed to post listing");
        },
    });

    const uploadMultipleToS3 = async (
        files: File[],
        folder: string = "uploads"
    ): Promise<{ success: boolean; key?: string; url?: string; error?: unknown }[]> => {
        return Promise.all(files.map((file) => uploadToS3(file, folder)));
    };

    const buildCreateAdPayload = (
        data: SellFormValues,
        imageUrls: string[],
    ): CreateAdPayload => {
        const category = categories.find((c) => c.name === data.category);
        const subcategory = category?.subcategoryItems.find(
            (s) => s.name === data.subcategory,
        );
        if (!category?.id || !subcategory?.id) {
            throw new Error("Please select a valid category and subcategory");
        }

        const selectedCityRow = apiCities.find((c) => String(c.id) === data.city);

        const categoryAttributes: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
            if ((SELL_FORM_COMMON_KEYS as readonly string[]).includes(key)) continue;
            if (typeof value !== "string" || value === "") continue;
            categoryAttributes[key] = value;
        }

        const latitude =
            selectedCityRow != null
                ? selectedCityRow.latitude ?? 0
                : Number(data.latitude) || 0;
        const longitude =
            selectedCityRow != null
                ? selectedCityRow.longitude ?? 0
                : Number(data.longitude) || 0;

        return {
            categoryId: category.id,
            subCategoryId: subcategory.id,
            title: data.title,
            description: data.description,
            price: Number(data.price) || 0,
            isNegotiable: data.isNegotiable === "true",
            stateId: data.state,
            cityId: data.city,
            locality: data.neighbourhood,
            latitude,
            longitude,
            sellerName: data.sellerName,
            mobileNumber: data.mobile,
            images: imageUrls
                .filter(Boolean)
                .map((url, index) => ({
                    url,
                    displayOrder: index,
                    isCover: index === 0,
                })),
            categoryAttributes,
        };
    };

    const onSubmit = async (data: SellFormValues) => {
        console.log("data", data, photos);
        if (photos.length === 0) {
            setPhotoError("Add at least one photo");
            return;
        }
        if (createSellFormMutation.isPending) return;

        let imageUrls: string[];
        try {
            const uploaded = await uploadMultipleToS3(
                photos.map((photo) => photo.file),
            );
            imageUrls = uploaded.map((response) => response.url || "");
        } catch {
            toast.error("Failed to upload one or more photos");
            return;
        }

        if (imageUrls.some((url) => !url)) {
            toast.error("Failed to upload one or more photos");
            return;
        }

        try {
            createSellFormMutation.mutate(buildCreateAdPayload(data, imageUrls));
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create listing",
            );
        }
    };

    const isPosting = createSellFormMutation.isPending;

    const subFormProps = { control, register, errors };

    const renderFormBySubCategory = () => {
        switch (selectedSubcategory) {
            // Mobiles & Tablets
            case "Mobile Phones":
                return <MobilePhonesForm {...subFormProps} />;
            case "Tablets":
                return <TabletsForm {...subFormProps} />;
            case "Accessories":
                return <AccessoriesForm {...subFormProps} />;
            case "Smart Watches":
                return <SmartWatchesForm {...subFormProps} />;

            // Electronics
            case "TVs, Video - Audio":
                return <TVsVideoAudioForm {...subFormProps} />;
            case "Kitchen & Other Appliances":
                return <KitchenOtherAppliancesForm {...subFormProps} />;
            case "Computers & Laptops":
                return <ComputersLaptopsForm {...subFormProps} />;
            case "Cameras & Lenses":
                return <CamerasLensesForm {...subFormProps} />;
            case "Games & Entertainment":
                return <GamesEntertainmentForm {...subFormProps} />;
            case "Fridges":
                return <FridgesForm {...subFormProps} />;
            case "Computer Accessories":
                return <ComputerAccessoriesForm {...subFormProps} />;
            case "Hard Disks, Printers & Monitors":
                return <HardDisksPrintersMonitorsForm {...subFormProps} />;
            case "ACs":
                return <ACsForm {...subFormProps} />;
            case "Washing Machines":
                return <WashingMachinesForm {...subFormProps} />;

            // Furniture
            case "Sofa & Dining":
                return <SofaDiningForm {...subFormProps} />;
            case "Beds & Wardrobes":
                return <BedsWardrobesForm {...subFormProps} />;
            case "Home Decor & Garden":
                return <HomeDecorGardenForm {...subFormProps} />;
            case "Kids Furniture":
                return <KidsFurnitureForm {...subFormProps} />;
            case "Other Household Items":
                return <OtherHouseholdItemsForm {...subFormProps} />;

            // Fashion
            case "Men":
                return <MenForm {...subFormProps} />;
            case "Women":
                return <WomenForm {...subFormProps} />;
            case "Kids":
                return <KidsForm {...subFormProps} />;

            // Vehicles
            case "Cars":
                return <CarsForm {...subFormProps} />;
            case "Motorcycles":
                return <MotorcyclesForm {...subFormProps} />;
            case "Scooters":
                return <ScootersForm {...subFormProps} />;
            case "Bicycles":
                return <BicyclesForm {...subFormProps} />;
            case "Spare Parts":
                return <SparePartsForm {...subFormProps} />;
            case "Commercial & Other Vehicles":
                return <CommercialOtherVehiclesForm {...subFormProps} />;

            // Books & Hobbies
            case "Books":
                return <BooksForm {...subFormProps} />;
            case "Musical Instruments":
                return <MusicalInstrumentsForm {...subFormProps} />;
            case "Other Hobbies":
                return <OtherHobbiesForm {...subFormProps} />;

            // Home & Living
            case "Kitchenware":
                return <KitchenwareForm {...subFormProps} />;
            case "Lighting":
                return <LightingForm {...subFormProps} />;

            // Sports & Fitness
            case "Gym & Fitness":
                return <GymFitnessForm {...subFormProps} />;
            case "Sports Equipment":
                return <SportsEquipmentForm {...subFormProps} />;
            case "Cycling":
                return <CyclingForm {...subFormProps} />;
            case "Other Sports":
                return <OtherSportsForm {...subFormProps} />;

            // Kids & Baby
            case "Toys":
                return <ToysForm {...subFormProps} />;
            case "Prams & Walkers":
                return <PramsWalkersForm {...subFormProps} />;
            case "Kids Clothing":
                return <KidsClothingForm {...subFormProps} />;

            // Real Estate
            case "For Sale: Houses & Apartments":
                return <ForSaleHousesApartmentsForm {...subFormProps} />;
            case "For Rent: Houses & Apartments":
                return <ForRentHousesApartmentsForm {...subFormProps} />;
            case "Lands & Plots":
                return <LandsPlotsForm {...subFormProps} />;
            case "For Sale: New Projects & Properties":
                return <ForSaleNewProjectsPropertiesForm {...subFormProps} />;
            case "For Rent: Shops & Offices":
                return <ForRentShopsOfficesForm {...subFormProps} />;
            case "For Sale: Shops & Offices":
                return <ForSaleShopsOfficesForm {...subFormProps} />;
            case "PG & Guest Houses":
                return <PGGuestHousesForm {...subFormProps} />;

            // Pet Supplies
            case "Fishes & Aquarium":
                return <FishesAquariumForm {...subFormProps} />;
            case "Pet Food & Accessories":
                return <PetFoodAccessoriesForm {...subFormProps} />;
            case "Dogs":
                return <DogsForm {...subFormProps} />;
            case "Other Pets":
                return <OtherPetsForm {...subFormProps} />;

            // Services
            case "Education & Classes":
                return <EducationClassesForm {...subFormProps} />;
            case "Tours & Travel":
                return <ToursTravelForm {...subFormProps} />;
            case "Electronics Repair & Services":
                return <ElectronicsRepairServicesForm {...subFormProps} />;
            case "Health & Beauty":
                return <HealthBeautyForm {...subFormProps} />;
            case "Home Renovation & Repair":
                return <HomeRenovationRepairForm {...subFormProps} />;
            case "Cleaning & Pest Control":
                return <CleaningPestControlForm {...subFormProps} />;
            case "Legal & Documentation Services":
                return <LegalDocumentationServicesForm {...subFormProps} />;
            case "Packers & Movers":
                return <PackersMoversForm {...subFormProps} />;
            case "Other Services":
                return <OtherServicesForm {...subFormProps} />;

            // Jobs
            // case "Full-time":
            // case "Part-time":
            // case "Internships":
            // case "Work from Home":
            //     return <JobsForm {...subFormProps} />;

            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sell-modal-title"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />

            <motion.div
                initial={{ opacity: 0, y: 48, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.85 }}
                data-lenis-prevent
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white sm:max-h-[min(90dvh,720px)]"
            >
                <motion.header
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 border-b border-slate-100 bg-white px-5 pt-5 pb-4 sm:px-7 sm:pt-6"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2
                                id="sell-modal-title"
                                className="font-heading text-xl font-extrabold text-slate-900"
                            >
                                Create New Post
                            </h2>
                            <p className="text-sm font-semibold text-slate-400">
                                Fill in the details to create your listing
                            </p>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    delay: 0.22,
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="mt-3 block h-1 w-10 origin-left rounded-full bg-primary"
                            />
                        </div>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                        >
                            <X className="size-5 text-slate-500" strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </motion.header>

                <form
                    id="sell-form"
                    className="flex min-h-0 flex-1 flex-col bg-slate-50/50"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
                        <motion.div
                            variants={formContainer}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col gap-4 pb-2"
                        >

                            {/* Post Details */}
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                                <Field
                                    label="Post Title"
                                    error={errors.title?.message}
                                    required
                                    className="sm:col-span-2"
                                >
                                    <input
                                        type="text"
                                        autoFocus
                                        maxLength={70}
                                        placeholder="What are you selling?"
                                        className={inputClassName}
                                        aria-invalid={!!errors.title}
                                        {...register("title", {
                                            required: "Title is required",
                                            minLength: {
                                                value: 5,
                                                message: "At least 5 characters",
                                            },
                                        })}
                                    />
                                    <span className="self-end text-[11px] font-semibold text-slate-400">
                                        {(titleValue ?? "").length} / 70
                                    </span>
                                </Field>

                                <Field
                                    label="Description"
                                    error={errors.description?.message}
                                    required
                                    className="sm:col-span-2"
                                >
                                    <textarea
                                        rows={4}
                                        maxLength={4096}
                                        placeholder="Describe your item…"
                                        className={`${inputClassName} min-h-22 resize-y py-2.5 text-[15px] font-semibold`}
                                        aria-invalid={!!errors.description}
                                        {...register("description", {
                                            required: "Description is required",
                                            minLength: {
                                                value: 20,
                                                message: "At least 20 characters",
                                            },
                                        })}
                                    />
                                    <span className="self-end text-[11px] font-semibold text-slate-400">
                                        {(descriptionValue ?? "").length} / 4096
                                    </span>
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                                <motion.div variants={formItem}>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: "Pick a Category" }}
                                        render={({ field }) => (
                                            <SelectDropdown
                                                label="Category"
                                                options={categoryOptions}
                                                value={field.value}
                                                placeholder="Choose Category"
                                                error={errors.category?.message}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    setValue("subcategory", "");
                                                }}
                                            />
                                        )}
                                    />
                                </motion.div>

                                <motion.div variants={formItem}>
                                    <Controller
                                        name="subcategory"
                                        control={control}
                                        rules={{ required: "Pick a Sub Category" }}
                                        render={({ field }) => (
                                            <SelectDropdown
                                                label="Sub Category"
                                                options={subcategoryOptions}
                                                value={field.value}
                                                placeholder={
                                                    selectedCategory
                                                        ? "Choose Sub Category"
                                                        : "Select Category first"
                                                }
                                                error={errors.subcategory?.message}
                                                disabled={!selectedCategory}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </motion.div>
                            </div>

                            {renderFormBySubCategory()}


                            {/* Price */}
                            {![
                                "ACS",
                                "For Sale: New Projects & Properties",
                                "Education & Classes",
                                "Tours & Travel",
                                "Electronics Repair & Services",
                                "Health & Beauty",
                                "Home Renovation & Repair",
                                "Cleaning & Pest Control",
                                "Legal & Documentation Services",
                                "Packers & Movers",
                                "Other Services",
                                "Full-time",
                                "Part-time",
                                "Internships",
                                "Work from Home",
                            ].includes(selectedSubcategory) && (
                                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                                        <Field label="Price (₹)" error={errors.price?.message} required>
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                placeholder="e.g. ₹15000"
                                                maxLength={7}
                                                className={inputClassName}
                                                aria-invalid={!!errors.price}
                                                {...register("price", {
                                                    required: "Price is Required",
                                                    pattern: {
                                                        value: /^\d+$/,
                                                        message: "Enter a Valid Amount",
                                                    },
                                                })}
                                            />
                                            <span className="text-xs font-semibold text-slate-500">{numberToWords(Number(priceValue))}</span>
                                        </Field>
                                        <motion.div variants={formItem} className="flex flex-col gap-1.5">
                                            <label className="text-[15px] font-semibold text-black">
                                                Negotiable*
                                            </label>
                                            <Controller
                                                name="isNegotiable"
                                                control={control}
                                                rules={{ required: "Select negotiable option" }}
                                                render={({ field }) => (
                                                    <div className="flex flex-wrap gap-2">
                                                        {yesNoOptions.map((option) => {
                                                            const active = field.value === option.value;
                                                            return (
                                                                <button
                                                                    key={option.value}
                                                                    type="button"
                                                                    onClick={() => field.onChange(option.value)}
                                                                    className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${active
                                                                        ? "border-primary bg-primary/10 text-primary"
                                                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                                                                        }`}
                                                                >
                                                                    {option.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            />
                                            {errors.isNegotiable?.message ? (
                                                <p className="text-xs font-semibold text-red-500">
                                                    {errors.isNegotiable.message}
                                                </p>
                                            ) : null}
                                        </motion.div>
                                    </div>
                                )}

                            {/* Photos */}
                            <div className="">
                                <label className="text-[15px] font-semibold text-black">Photos</label>
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
                                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 mt-1">
                                    {photos.length < MAX_PHOTOS && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <ImagePlus className="size-6" strokeWidth={1.75} />
                                            <span className="text-[10px] font-bold tracking-wide uppercase">
                                                Add Photo
                                            </span>
                                        </button>
                                    )}
                                    {photos.map((photo, index) => (
                                        <div
                                            key={photo.id}
                                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={photo.url}
                                                alt={`Upload ${index + 1}`}
                                                className="size-full object-cover"
                                            />
                                            {index === 0 && (
                                                <span className="absolute top-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                                                    Cover
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(photo.id)}
                                                aria-label={`Remove photo ${index + 1}`}
                                                className="absolute top-1.5 right-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-slate-900/70 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <X className="size-3.5" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    ))}
                                    {Array.from({
                                        length: Math.max(
                                            0,
                                            Math.min(5, MAX_PHOTOS - photos.length - 1)
                                        ),
                                    }).map((_, i) => (
                                        <button
                                            key={`slot-${i}`}
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300 transition-colors hover:border-slate-300 hover:text-slate-400"
                                        >
                                            <Camera className="size-6" strokeWidth={2} />
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs font-semibold text-slate-400">
                                    {photos.length} / {MAX_PHOTOS} photos
                                </p>
                                <AnimatePresence mode="wait">
                                    {photoError ? (
                                        <motion.p
                                            key={photoError}
                                            role="alert"
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="mt-1 text-xs font-semibold text-red-500"
                                        >
                                            {photoError}
                                        </motion.p>
                                    ) : null}
                                </AnimatePresence>
                            </div>


                            {/* Location */}
                            <div className="mb-3.5 flex gap-1 border-b border-slate-100">
                                {(
                                    [
                                        { id: "list", label: "Select Location", icon: MapPin },
                                        {
                                            id: "current",
                                            label: "Current Location",
                                            icon: Navigation,
                                        },
                                    ] as const
                                ).map(({ id, label, icon: Icon }) => {
                                    const active = locationTab === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => {
                                                setLocationTab(id);
                                                if (id === "current") detectLocation();
                                            }}
                                            className={`relative flex cursor-pointer items-center gap-1.5 px-3 py-2.5 text-sm font-bold transition-colors ${active
                                                ? "text-primary"
                                                : "text-slate-400 hover:text-slate-600"
                                                }`}
                                        >
                                            <Icon className="size-3.5" strokeWidth={2.25} />
                                            {label}
                                            {active && (
                                                <motion.span
                                                    layoutId="location-tab"
                                                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {locationTab === "list" ? (
                                <div className="flex flex-col gap-3.5">
                                    <motion.div variants={formItem}>
                                        <Controller
                                            name="state"
                                            control={control}
                                            rules={{ required: "Pick a State" }}
                                            render={({ field }) => (
                                                <SelectDropdown
                                                    label="State"
                                                    required
                                                    options={stateOptions}
                                                    value={field.value}
                                                    placeholder="Choose State"
                                                    error={errors.state?.message}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        setValue("city", "");
                                                        setValue("neighbourhood", "");
                                                    }}
                                                />
                                            )}
                                        />
                                    </motion.div>

                                    <AnimatePresence initial={false}>
                                        {selectedState ? (
                                            <motion.div
                                                key="city-field"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{
                                                    duration: 0.22,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="relative z-20"
                                            >
                                                <Controller
                                                    name="city"
                                                    control={control}
                                                    rules={{ required: "Pick a City" }}
                                                    render={({ field }) => (
                                                        <SelectDropdown
                                                            label="City"
                                                            required
                                                            options={cityOptions}
                                                            value={field.value}
                                                            placeholder="Choose City"
                                                            error={errors.city?.message}
                                                            onChange={(value) => {
                                                                field.onChange(value);
                                                                setValue("neighbourhood", "");
                                                                const city = apiCities.find(
                                                                    (c) => String(c.id) === value,
                                                                );
                                                                // Always replace prior coords so a city without lat/lng cannot keep stale values.
                                                                setValue(
                                                                    "latitude",
                                                                    city?.latitude != null
                                                                        ? String(city.latitude)
                                                                        : "",
                                                                    { shouldValidate: true },
                                                                );
                                                                setValue(
                                                                    "longitude",
                                                                    city?.longitude != null
                                                                        ? String(city.longitude)
                                                                        : "",
                                                                    { shouldValidate: true },
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>

                                    {/* <AnimatePresence initial={false}>
                                        {selectedState && selectedCity ? (
                                            <motion.div
                                                key="neighbourhood-field"
                                                initial={{ opacity: 0, y: 10, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -6, height: 0 }}
                                                transition={{
                                                    duration: 0.22,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <Controller
                                                    name="neighbourhood"
                                                    control={control}
                                                    rules={{
                                                        required: "Pick a Neighbourhood",
                                                    }}
                                                    render={({ field }) => (
                                                        <SelectDropdown
                                                            label="Neighbourhood"
                                                            required
                                                            options={neighbourhoodOptions}
                                                            value={field.value}
                                                            placeholder="Choose Neighbourhood"
                                                            error={
                                                                errors.neighbourhood?.message
                                                            }
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence> */}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-4">
                                    <p className="text-sm font-semibold text-slate-600">
                                        {detecting
                                            ? "Detecting your location…"
                                            : "Using your current location. You can switch to List to pick manually."}
                                    </p>
                                    {errors.neighbourhood?.message ||
                                        errors.city?.message ||
                                        errors.state?.message ? (
                                        <p className="mt-2 text-xs font-semibold text-red-500">
                                            Location is required
                                        </p>
                                    ) : null}
                                </div>
                            )}

                            {/* Seller Details */}
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                                <Field
                                    label="Name"
                                    error={errors.sellerName?.message}
                                    required
                                >
                                    <input
                                        type="text"
                                        maxLength={30}
                                        placeholder="Your name"
                                        className={inputClassName}
                                        aria-invalid={!!errors.sellerName}
                                        {...register("sellerName", {
                                            required: "Name is required",
                                            minLength: {
                                                value: 2,
                                                message: "At least 2 characters",
                                            },
                                        })}
                                    />
                                    <span className="self-end text-[11px] font-semibold text-slate-400">
                                        {(sellerNameValue ?? "").length} / 30
                                    </span>
                                </Field>

                                <Field
                                    label="Mobile Number"
                                    error={errors.mobile?.message}
                                >
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        disabled
                                        placeholder="+91 XXXXX XXXXX"
                                        className={inputClassName}
                                        aria-invalid={!!errors.mobile}
                                        {...register("mobile", {
                                            minLength: {
                                                value: 10,
                                                message: "Enter a valid number",
                                            },
                                        })}
                                    />
                                </Field>
                            </div>
                        </motion.div>
                    </div>

                    <motion.footer
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7"
                    >
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-300 sm:px-6"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPosting}
                                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-[#ff5a1f] py-1.5 pr-3 pl-1.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:text-white sm:pr-4"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
                                    <Send className="h-4 w-4" strokeWidth={3} />
                                </span>
                                <span className="font-semibold">
                                    {isPosting ? "Posting…" : "Post Now"}
                                </span>
                            </button>
                        </div>
                    </motion.footer>
                </form>
            </motion.div>
        </div >
    );
}
