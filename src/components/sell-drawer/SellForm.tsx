"use client";

import {
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { X, MapPin, Navigation, ArrowRight, Loader2 } from "lucide-react";
import { normalizeApiCategories } from "@/lib/apiCategories";
import { locationTree } from "@/lib/locations";
import SelectDropdown from "./SelectDropdown";
import PhotoUpload from "./PhotoUpload";
import GlowButton from "@/components/ui/GlowButton";
import type { ApiCity, CreateAdPayload, SellFormValues } from "../types/AllTypes";
import { emptySellFormValues, SELL_FORM_COMMON_KEYS } from "../types/AllTypes";
import { inputClassName } from "@/constant/helper/classesHelper";
import { Field, FormSection, formContainer, formItem, numberToWords } from "../../constant/helper/TextField";
import { type RootState } from "@/components/redux/store";
import { createSellForm, getCategories, getCities, getStates, type ApiError } from "@/components/api/apis";
import {
    AccessoriesForm,
    ACsForm,
    BedsWardrobesForm,
    FashionAccessoriesForm,
    FootwearForm,
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
    ToursTravelForm,
    ToysForm,
    TVsVideoAudioForm,
    TwoWheelerSparePartsForm,
    WashingMachinesForm,
    // JobsForm,
    WomenForm,
} from "./FormBySubCategory";
import { yesNoOptions } from "@/components/data/FormOptions";
import { uploadToS3 } from "@/constant/helper/s3Upload";
import { useSelector } from "react-redux";

const emptySubscribe = () => () => { };

function useIsClient() {
    return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function scrollToFirstInvalidField(root: HTMLElement | null) {
    if (!root) return;

    const field = root.querySelector<HTMLElement>("[data-invalid='true']");
    if (!field) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    field.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
    });

    const focusable = field.matches("input, textarea, select, button")
        ? field
        : field.querySelector<HTMLElement>(
            "input:not([disabled]):not([type='hidden']), textarea:not([disabled]), select:not([disabled]), button:not([disabled])",
        );
    focusable?.focus({ preventScroll: true });
}

function scheduleScrollToFirstInvalidField() {
    window.setTimeout(() => {
        scrollToFirstInvalidField(document.getElementById("sell-form-scroll"));
    }, 50);
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
    const [photos, setPhotos] = useState<File[]>([]);
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
        shouldFocusError: false,
    });

    useEffect(() => {
        if (!user) return;
        reset((prev) => ({
            ...prev,
            sellerName: user.user.firstName + " " + user.user.lastName,
            mobile: user.user.phone ?? prev.mobile,
        }));
    }, [user, reset]);

    useEffect(() => {
        if (!photoError) return;
        scrollToFirstInvalidField(document.getElementById("sell-form-scroll"));
    }, [photoError]);

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
            mobileNumber: data.mobile || "",
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
        if (photos.length === 0) {
            setPhotoError("Add at least one photo");
            return;
        }
        if (createSellFormMutation.isPending) return;

        let imageUrls: string[];
        try {
            const uploaded = await uploadMultipleToS3(photos);
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
            case "Mobiles":
                return <MobilePhonesForm {...subFormProps} />;
            case "Tablets":
                return <MobilePhonesForm {...subFormProps} />;
            case "Accessories":
            case "Mobile Accessories":
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
            case "Footwear":
                return <FootwearForm {...subFormProps} />;
            case "Fashion Accessories":
                return <FashionAccessoriesForm {...subFormProps} />;

            // Vehicles / Bikes
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
            case "2-Wheeler Spare Parts":
                return <TwoWheelerSparePartsForm {...subFormProps} />;
            case "Trucks":
                return <CarsForm {...subFormProps} />;
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
            case "Fish & Aquarium":
            case "Fishes & Aquarium":
                return <FishesAquariumForm {...subFormProps} />;
            case "Pet Food & Accessories":
                return <PetFoodAccessoriesForm {...subFormProps} />;
            case "Dogs":
            case "Cats":
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

    const hidePrice = [
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
    ].includes(selectedSubcategory);

    const subCategoryFields = renderFormBySubCategory();

    return (
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sell-modal-title"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/35 backdrop-blur-[3px]"
            />

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.85 }}
                data-lenis-prevent
                onClick={(e) => e.stopPropagation()}
                className="relative flex h-full max-h-dvh w-full max-w-xl flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[min(90dvh,760px)] sm:rounded-4xl"
            >
                <motion.header
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.3 }}
                    className="relative z-10 shrink-0 bg-linear-to-b from-primary/15 via-primary/8 to-white px-5 pt-5 pb-4 backdrop-blur-xl sm:px-8 sm:pt-7 sm:pb-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2
                                id="sell-modal-title"
                                className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]"
                            >
                                Create New Post
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Fill in the details to list your item.
                            </p>
                        </div>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            whileTap={{ scale: 0.94 }}
                            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                        >
                            <X className="size-5" strokeWidth={2.25} />
                        </motion.button>
                    </div>
                </motion.header>

                <form
                    id="sell-form"
                    className="relative z-10 flex min-h-0 flex-1 flex-col"
                    onSubmit={handleSubmit(onSubmit, scheduleScrollToFirstInvalidField)}
                >
                    <div
                        id="sell-form-scroll"
                        className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-5"
                    >
                        <motion.div
                            variants={formContainer}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col gap-0 pb-2"
                        >
                            <FormSection
                                step="01"
                                title="Post details"
                                hint="A clear title and story sell faster."
                            >
                                <div className="grid grid-cols-1 gap-5">
                                    <Field
                                        label="Post Title"
                                        error={errors.title?.message}
                                        required
                                        hint={`${(titleValue ?? "").length} / 70`}
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
                                    </Field>

                                    <Field
                                        label="Description"
                                        error={errors.description?.message}
                                        required
                                        hint={`${(descriptionValue ?? "").length} / 4096`}
                                    >
                                        <textarea
                                            rows={4}
                                            maxLength={4096}
                                            placeholder="Condition, extras, reason for selling…"
                                            className={`${inputClassName} min-h-24 resize-y leading-relaxed`}
                                            aria-invalid={!!errors.description}
                                            {...register("description", {
                                                required: "Description is required",
                                                minLength: {
                                                    value: 20,
                                                    message: "At least 20 characters",
                                                },
                                            })}
                                        />
                                    </Field>
                                </div>
                            </FormSection>

                            <FormSection
                                step="02"
                                title="Category"
                                hint="Pick where buyers will find this."
                            >
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <motion.div variants={formItem}>
                                        <Controller
                                            name="category"
                                            control={control}
                                            rules={{ required: "Pick a Category" }}
                                            render={({ field }) => (
                                                <SelectDropdown
                                                    label="Category"
                                                    required
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
                                                    required
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

                                {subCategoryFields ? (
                                    <div className="mt-4 rounded-xl bg-slate-50/80 p-3.5 ring-1 ring-slate-100 sm:p-4">
                                        {subCategoryFields}
                                    </div>
                                ) : null}
                            </FormSection>

                            {!hidePrice && (
                                <FormSection
                                    step="03"
                                    title="Pricing"
                                    hint="Set a fair price buyers can trust."
                                >
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <Field
                                            label="Price (₹)"
                                            error={errors.price?.message}
                                            required
                                        >
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                placeholder="e.g. 15000"
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
                                            {priceValue ? (
                                                <span className="text-xs font-medium text-slate-500">
                                                    {numberToWords(Number(priceValue))} Rupees
                                                </span>
                                            ) : null}
                                        </Field>
                                        <motion.div
                                            variants={formItem}
                                            data-invalid={errors.isNegotiable ? "true" : undefined}
                                            className="flex flex-col gap-1.5"
                                        >
                                            <label className="text-sm font-semibold text-slate-700">
                                                Negotiable
                                                <span className="ml-0.5 text-primary" aria-hidden>*</span>
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
                                                                    className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-bold transition-colors ${active
                                                                        ? "bg-primary text-white"
                                                                        : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-slate-900"
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
                                </FormSection>
                            )}

                            <FormSection
                                step={hidePrice ? "03" : "04"}
                                title="Photos"
                                hint="First photo becomes the cover."
                            >
                                <PhotoUpload
                                    onChange={(files) => {
                                        setPhotos(files);
                                        setPhotoError(null);
                                    }}
                                    error={photoError}
                                />
                            </FormSection>

                            <FormSection
                                step={hidePrice ? "04" : "05"}
                                title="Location"
                                hint="Help nearby buyers find you."
                            >
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {(
                                        [
                                            { id: "list", label: "Select location", icon: MapPin },
                                            { id: "current", label: "Current location", icon: Navigation },
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
                                                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${active
                                                    ? "bg-primary text-white"
                                                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-slate-900"
                                                    }`}
                                            >
                                                <Icon className="size-3.5" strokeWidth={2.25} />
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {locationTab === "list" ? (
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    transition={{
                                                        duration: 0.2,
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
                                            ) : (
                                                <p className="hidden self-end pb-3 text-sm font-medium text-slate-400 sm:block">
                                                    Select a state first
                                                </p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div
                                        data-invalid={
                                            errors.neighbourhood?.message ||
                                                errors.city?.message ||
                                                errors.state?.message
                                                ? "true"
                                                : undefined
                                        }
                                        className="flex items-start gap-3 rounded-xl bg-slate-50 px-3.5 py-3.5 ring-1 ring-slate-100"
                                    >
                                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            {detecting ? (
                                                <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
                                            ) : (
                                                <Navigation className="size-4" strokeWidth={2.25} />
                                            )}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {detecting
                                                    ? "Detecting your location…"
                                                    : "Using your current location"}
                                            </p>
                                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                                Switch to Select location to pick manually.
                                            </p>
                                            {errors.neighbourhood?.message ||
                                                errors.city?.message ||
                                                errors.state?.message ? (
                                                <p className="mt-2 text-xs font-semibold text-red-500">
                                                    Location is required
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </FormSection>

                            <FormSection
                                step={hidePrice ? "05" : "06"}
                                title="Seller contact"
                                hint="Shown to interested buyers."
                            >
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Name"
                                        error={errors.sellerName?.message}
                                        required
                                        hint={`${(sellerNameValue ?? "").length} / 30`}
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
                                    </Field>

                                    <Field
                                        label="Mobile Number"
                                        error={errors.mobile?.message}
                                    >
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            // disabled
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
                            </FormSection>
                        </motion.div>
                    </div>

                    <motion.footer
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="shrink-0 border-t border-slate-100 bg-white px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4 sm:pb-6 justify-end items-center flex"
                    >
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                            >
                                Cancel
                            </button>
                            <GlowButton
                                type="submit"
                                disabled={isPosting}
                                variant="sell"
                                className="group flex-1 sm:flex-none"
                            >
                                <span>{isPosting ? "Posting…" : "Post Now"}</span>
                                {isPosting ? (
                                    <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
                                ) : (
                                    <ArrowRight
                                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                        strokeWidth={2.5}
                                    />
                                )}
                            </GlowButton>
                        </div>
                    </motion.footer>
                </form>
            </motion.div>
        </div>
    );
}
